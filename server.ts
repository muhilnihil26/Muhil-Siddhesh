/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI-powered project details generation
  app.post("/api/gemini/generate-project", async (req, res) => {
    const { webLink } = req.body;
    if (!webLink) {
      return res.status(400).json({ error: "Web link is required." });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set. Please supply it in Settings.");
      }
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert AI software engineer and systems architect. A user has provided this web link or repository: "${webLink}".
Analyze this URL, utilize your extensive knowledge base and search capabilities to deduce and generate highly detailed, professional portfolio project specifications.
If you cannot browse it directly, make an intelligent, realistic, and inspiring deduction based on the keywords and domain implied by the URL.

Return a JSON object conforming STRICTLY to this format (do NOT wrap in markdown code blocks or add extra explanation, return ONLY the raw JSON string):
{
  "title": "A crisp, compelling, high-fidelity project title",
  "description": "A short, engaging tagline description (1-2 sentences) summarizing its value and purpose",
  "detailedDescription": "An extremely rich, detailed description (3-4 sentences) outlining core architecture, subcomponents, and workflow details",
  "category": "AI",
  "features": [
    "Feature 1: explanation of high-impact benefit",
    "Feature 2: explanation of high-impact benefit",
    "Feature 3: explanation of high-impact benefit",
    "Feature 4: explanation of high-impact benefit"
  ],
  "techStack": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"]
}

The category field MUST be strictly one of: "AI", "Software", "Game", or "Web".
Return ONLY raw valid JSON. Do not include markdown code block backticks (\`\`\`).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      const data = JSON.parse(text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate project content using Gemini." });
    }
  });

  // API Route: Contact Form submission
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      console.log(`[EMAIL SYSTEM SIMULATION]`);
      console.log(`Sending email to admin (muhillsiddhesh.in@gmail.com): New message from ${name} (${email}) - ${message}`);
      console.log(`Sending confirmation email to user (${email}): Thanks for reaching out, ${name}! Your message has been received.`);
      
      // If Resend API key is available, we could integrate it here
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        console.log("Resend API key found. Implementing actual send...");
        // You would use `resend.emails.send(...)` here
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Contact API Error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite integration as middleware or static asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
