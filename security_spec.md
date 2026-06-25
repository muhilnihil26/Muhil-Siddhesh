# Security Specification: Muhil Siddhesh Portfolio

This document outlines the security architecture, invariants, and adversarial test payloads designed to validate the protection of portfolio data stored in Cloud Firestore.

## 1. Data Invariants

1. **Owner-Exclusive Writes**: Only the verified administrator (`muhilsiddhesh.in@gmail.com`) can perform write operations (create, update, delete) on any document in the `portfolio` collection.
2. **Global Read Access**: Unauthenticated or general authenticated users can perform single-document reads (`get`) to fetch the active portfolio data, but cannot edit or list documents.
3. **Data Shape Integrity**: Any update must match the exact schema of a Portfolio document, maintaining all required root keys (`personalInfo`, `skills`, `projects`, `achievements`, `timelineEvents`) with limited bounds (e.g. no infinite arrays or oversized strings to prevent Denial of Wallet attacks).
4. **Verified Email Mandate**: Email verification is strictly required for the administrator write check (`request.auth.token.email_verified == true`).

---

## 2. The "Dirty Dozen" Adversarial Payloads

Below are the 12 malicious payloads and contexts designed to test the robustness of the firestore security rules. All of these MUST return `PERMISSION_DENIED`.

### Payload 1: Unauthenticated Creation Attempt
* **Context**: User is anonymous/not signed in.
* **Operation**: `create` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "personalInfo": { "name": "Hacker" }
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Requires active auth).

### Payload 2: Spoofed Email Write Attempt
* **Context**: Authenticated as `attacker@gmail.com`.
* **Operation**: `create` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "personalInfo": { "name": "Muhil Siddhesh" },
    "skills": [],
    "projects": [],
    "achievements": [],
    "timelineEvents": []
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Email mismatch).

### Payload 3: Unverified Admin Email Bypass
* **Context**: Authenticated as `muhilsiddhesh.in@gmail.com` but `email_verified` is `false`.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "personalInfo": { "name": "Muhil Siddhesh" }
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Requires verified email).

### Payload 4: Invalid Document ID Poisoning
* **Context**: Authenticated as verified admin.
* **Operation**: `create` on `/portfolio/muhil_special_long_character_path_attempt_representing_id_poisoning_vulnerability_with_oversized_string_exceeding_128_characters`
* **Expected Result**: `PERMISSION_DENIED` (Path variable fails `isValidId` size threshold of 128 chars).

### Payload 5: Key Incomplete Schema / Shadow Update
* **Context**: Authenticated as verified admin.
* **Operation**: `create` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "personalInfo": { "name": "Muhil" },
    "ghostField": "corruptedData"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Fails `keys().size() == 5` or exact property validation).

### Payload 6: Value Type Poisoning (String in place of Array)
* **Context**: Authenticated as verified admin.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "personalInfo": {},
    "skills": "this-should-be-an-array",
    "projects": [],
    "achievements": [],
    "timelineEvents": []
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Type check verification).

### Payload 7: Denial of Wallet - Massive Project Array Injection
* **Context**: Authenticated as verified admin.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "projects": [ /* 1000 duplicated oversized projects to exhaust storage / read rules cost */ ]
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Exceeds size boundary of list items).

### Payload 8: Immutable Attribute Violation (Altering fixed metadata fields if added)
* **Context**: Authenticated as verified admin.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "createdAt": "2025-01-01" /* modifying creation date */
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (CreatedAt is immutable).

### Payload 9: Blanket Query Scraping / Collection Listing
* **Context**: General authenticated user.
* **Operation**: `list` query on `/portfolio`
* **Expected Result**: `PERMISSION_DENIED` (Blanket listing is disabled; only explicit document reads are permitted).

### Payload 10: State Bypass / Forcing Invalid Enumerated Categories
* **Context**: Authenticated as verified admin.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "projects": [{ "id": "1", "category": "SUPER_ILLEGAL_CATEGORY" }]
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Enumeration validation violation).

### Payload 11: Spoofing System Generate Signatures
* **Context**: Attacker writes to a reserved system path `/portfolio/system_metadata`
* **Expected Result**: `PERMISSION_DENIED` (Protected system path).

### Payload 12: Invalid Timestamp (Altering client temporal sequence)
* **Context**: Authenticated as verified admin.
* **Operation**: `update` on `/portfolio/muhil`
* **Payload**:
  ```json
  {
    "updatedAt": "1990-01-01"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (Must match server timestamp `request.time`).

---

## 3. Security Tests Runner (Conceptual Rules Test Suite)

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

describe("Muhil Siddhesh Portfolio security unit tests", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "muhil-siddhesh-portfolio",
      firestore: {
        rules: require("fs").readFileSync("firestore.rules", "utf8")
      }
    });
  });

  it("should deny unauthenticated users edit rights", async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthedDb.doc("portfolio/muhil").set({ personalInfo: {} }));
  });

  it("should deny wrong email users write access", async () => {
    const intruderDb = testEnv.authenticatedContext("intruder_uid", {
      email: "attacker@gmail.com",
      email_verified: true
    }).firestore();
    await assertFails(intruderDb.doc("portfolio/muhil").set({ personalInfo: {} }));
  });

  it("should allow verified owner to edit the portfolio document", async () => {
    const adminDb = testEnv.authenticatedContext("admin_uid", {
      email: "muhilsiddhesh.in@gmail.com",
      email_verified: true
    }).firestore();
    await assertSucceeds(adminDb.doc("portfolio/muhil").set({
      personalInfo: { name: "Muhil Siddhesh" },
      skills: [],
      projects: [],
      achievements: [],
      timelineEvents: []
    }));
  });
});
```
