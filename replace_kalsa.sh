#!/bin/bash
sed -i 's/Kalsa the Warrior/Veera Yugam/g' src/data.ts
sed -i 's/kalsa-warrior/veera-yugam/g' src/data.ts
sed -i 's/https:\/\/play.kalsawarrior.com/https:\/\/veerayugam.vercel.app\//g' src/data.ts

sed -i 's/Kalsa the Warrior/Veera Yugam/g' src/components/ProjectCard.tsx
sed -i 's/kalsa-warrior/veera-yugam/g' src/components/ProjectCard.tsx

sed -i 's/KALSA THE WARRIOR/VEERA YUGAM/g' src/components/TerminalConsole.tsx
sed -i 's/Kalsa series/Veera Yugam series/g' src/components/TerminalConsole.tsx
sed -i 's/Kalsa the Warrior/Veera Yugam/g' src/components/TerminalConsole.tsx
