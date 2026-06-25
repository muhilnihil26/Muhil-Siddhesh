/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkillCategory, Project, Innovation, Achievement } from "./types";

export const PERSONAL_INFO = {
  name: "Muhil",
  fullName: "Muhil Siddhesh",
  title: "AI Developer | Full Stack Developer | Student Innovator",
  role: "Aspiring Tech Entrepreneur & AI Innovator",
  tagline: "Building the Future with AI and Innovation",
  avatarUrl: "/src/assets/images/muhil_avatar_1782394981906.jpg",
  email: "muhillsiddhesh.in@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  whatsapp: "https://wa.me/919876543210",
  location: "Tamil Nadu, India",
  education: {
    school: "PM SHRI Kendriya Vidyalaya RTC ITBP Illuppaikudi",
    grade: "Class 10 Student",
    achievements: "Pioneering technology concepts beyond school-level learning"
  },
  careerGoal: {
    role: "AI Engineer & Software Architect",
    firm: "Warrior Developers (Future Founder)",
    description: "To create innovative, high-impact AI-powered solutions for healthcare, education, and business automation, reshaping how humans interact with digital systems."
  },
  bio: "Hi, I'm Muhil, a passionate Class 10 student deeply interested in Artificial Intelligence, Full Stack Development, Software Engineering, and Technology Innovation. I enjoy building websites, software solutions, AI-powered applications, and creative technology projects that solve real-world problems. I combine engineering design with design thinking, striving to create systems that are not only highly functional but also intuitive and visually stunning."
};

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: "Artificial Intelligence",
    skills: [
      { name: "Prompt Engineering", level: 95, details: "System instructions, few-shot prompting, and prompt chaining for LLMs" },
      { name: "AI Tools Integration", level: 90, details: "Leveraging APIs and tools to automate workflows and enhance apps" },
      { name: "AI Automation", level: 85, details: "Creating autonomous agents and custom workflow automations" },
      { name: "LLM Concepts", level: 80, details: "Understanding neural architectures, fine-tuning, embeddings, and vector databases" }
    ]
  },
  {
    title: "Web Development",
    skills: [
      { name: "HTML & CSS", level: 90, details: "Semantic markup, modern layouts (Flexbox, Grid), and custom animations" },
      { name: "JavaScript / TS", level: 85, details: "ES6+, asynchronous programming, DOM manipulation, and static typing" },
      { name: "React / Vite", level: 85, details: "Component lifecycles, advanced state management, and virtual DOM concepts" },
      { name: "Responsive Design", level: 95, details: "Fluid responsive layouts across mobile, tablet, and ultra-wide desktops" }
    ]
  },
  {
    title: "Software Engineering",
    skills: [
      { name: "Full Stack Concepts", level: 80, details: "Client-server architecture, RESTful API design, and JSON handling" },
      { name: "System Design", level: 75, details: "Database schemas, entity relationships, and modular code architecture" },
      { name: "UI/UX Design", level: 85, details: "Figma wireframing, typography, color theory, and smooth micro-interactions" },
      { name: "Project Planning", level: 90, details: "Agile sprints, feature scoping, milestones, and documentation" }
    ]
  },
  {
    title: "Tools & Technologies",
    skills: [
      { name: "GitHub & VS Code", level: 90, details: "Version control, branching, package management, and custom extensions" },
      { name: "ChatGPT & Devin AI", level: 95, details: "AI-assisted pair programming and agentic coding execution" },
      { name: "Unity & Godot", level: 80, details: "2D/3D game physics, scripting, animation tree, and rendering pipelines" }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "warrior-nexus",
    title: "Warrior Nexus",
    description: "A complete hospital and healthcare management ecosystem featuring role-based access, smart queue management, pharmacy integration, ambulance tracking, dashboards, and automated healthcare workflows.",
    detailedDescription: "Warrior Nexus is a comprehensive, next-generation digital healthcare framework designed to streamline clinic and hospital workloads. It replaces archaic manual administrative practices with dynamic, automated workflows, giving power back to medical professionals and patients alike.",
    category: "Software",
    features: [
      "Role-Based Dashboards: Custom portals for Admins, Doctors, Receptionists, and Patients",
      "Smart Queue Management: Real-time appointment scheduling and visual queue tracking",
      "Integrated Digital Pharmacy: Instant prescription dispatch, stock level tracking, and automatic re-orders",
      "Ambulance Geo-Tracking: Mock GPS dispatcher showing nearest emergency vehicle coordinates",
      "Medical Record Vault: Secure, encrypted storage of health history logs and digital diagnostic reports"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts", "Lucide Icons"],
    githubUrl: "https://github.com"
  },
  {
    id: "sonexa",
    title: "Sonexa",
    description: "An AI-powered digital automation hub designed to orchestrate intelligent services, workflow execution, and intelligent data analysis through automated agentic patterns.",
    detailedDescription: "Sonexa is a vision of modular software execution. It provides users with a central control panel that processes complex natural language prompts, breaking them down into structured digital services, files, and scheduled triggers.",
    category: "AI",
    features: [
      "AI Prompt Orchestration: Translate natural language demands into concrete service processes",
      "Task Execution Pipeline: Real-time visual steps showing agentic actions in progress",
      "Data Stream Processing: Smart filtering and auto-tagging of text, logs, and CSV assets",
      "Interactive Interface: Elegant cosmic glass glassmorphism layout with terminal logging elements"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "LLM APIs", "JSON-RPC Concepts"],
    githubUrl: "https://github.com"
  },
  {
    id: "kalsa-warrior",
    title: "Kalsa the Warrior",
    description: "An animated storytelling and gaming concept created by Warrior Studio, tracking the journeys of the hero Anven against the forces of the Evil King Makas.",
    detailedDescription: "Kalsa the Warrior is a rich creative narrative combining game engine animations with interactive storytelling. Set in a mythical cyber-fantasy world, users explore chapters of lore, animated combat interactions, and hero progress statistics.",
    category: "Game",
    features: [
      "Rich Lore Explorer: Animated storyboard chapters presenting Anven's battle for freedom",
      "Interactive Character Viewer: Inspect 2D/3D sprite characteristics, custom weapons, and skills",
      "Combat Simulator: Playable text/turn-based visual sparring engine with Evil King Makas's minions",
      "Warrior Studio Soundboard: Theme-fitting retro chiptune ambient sounds and visual fx"
    ],
    techStack: ["Godot / Unity Concepts", "React Canvas", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com"
  },
  {
    id: "vaster-ai",
    title: "Vaster AI",
    description: "A visionary AI developer system concept capable of automatically generating ready-to-deploy websites, native mobile applications, and desktop software from simple prompts.",
    detailedDescription: "Vaster AI represents the future of software development—an advanced autonomous coding partner. This platform maps software architecture plans, compiles code blocks, compiles visual layouts, and tests for bugs autonomously.",
    category: "AI",
    features: [
      "Multi-Platform Planner: Generate architecture schemas for Web, iOS, Android, and Electron apps",
      "UI/UX Design Engine: Automated styling guides, component layouts, and custom palette selections",
      "Code Compiler Simulator: Watch a live visual cascade of source files compiling, linking, and executing",
      "Smart Bug Scanner: Simulated error injection and self-healing debugger visual dashboard"
    ],
    techStack: ["React", "Tailwind CSS", "Framer Motion", "LLM Fine-Tuning Concepts", "Node.js Schema Validators"],
    githubUrl: "https://github.com"
  }
];

export const INNOVATIONS_DATA: Innovation[] = [
  {
    title: "Smart Railway Station Entry System",
    description: "An automated IoT and software ecosystem designed to eliminate congestion, verify credentials instantly, and manage guest access at modern railway terminals.",
    detailedPoints: [
      "PNR/QR Instant Verification: Seamless QR scanning at digital optical barriers, checking ticket databases in under 150ms.",
      "Passenger Crowd Management: Automated flow throttling gates that balance access corridors based on train departure times.",
      "Smart Guest Entry: Digitally authorized, time-limited single-entry passcodes for non-travelling guardians, sent directly to mobile phones.",
      "Station Automation: Unified stationmaster terminal reporting platform with active gate indicators, train departures, and passenger statistics."
    ],
    techStack: ["React Canvas", "IoT Gateway Architecture", "QR Coding Algorithims", "Real-Time Databases"]
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    title: "AI & Software Visionary",
    description: "Formulated and structured multiple high-complexity software architecture concepts (Warrior Nexus, Vaster AI) showcasing full-stack workflows.",
    category: "coding"
  },
  {
    title: "Creative Storytelling Animator",
    description: "Authored rich narrative chapters and configured asset setups for 'Kalsa the Warrior' under Warrior Studio, mixing gaming and storytelling.",
    category: "creativity"
  },
  {
    title: "Advanced Autonomous Learning",
    description: "Mastered full-stack paradigms, prompt engineering chains, and game engine mechanics (Unity/Godot) independently, exceeding standard grade level guidelines.",
    category: "academic"
  },
  {
    title: "Entrepreneurial Spirit",
    description: "Spearheading 'Warrior Developers' branding, detailing blueprints for real-world automated systems such as Smart Railway Entry and AI healthcare.",
    category: "creativity"
  }
];
