#!/bin/bash
find src -type f -name "*.tsx" -exec sed -i 's/emerald-/indigo-/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/teal-/fuchsia-/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/#020604/#050511/g' {} +
