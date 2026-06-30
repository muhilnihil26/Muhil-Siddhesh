/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonalInfo, SkillCategory, Project, Innovation, Achievement, TimelineEvent, BlogPost } from "../types";
import { 
  PERSONAL_INFO as defaultPersonalInfo, 
  SKILLS_DATA as defaultSkills, 
  PROJECTS_DATA as defaultProjects, 
  ACHIEVEMENTS_DATA as defaultAchievements,
  INNOVATIONS_DATA as defaultInnovations,
  BLOG_POSTS_DATA as defaultBlogPosts
} from "../data";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Fallback timeline events matching those in JourneyTimeline
const defaultTimelineEvents: TimelineEvent[] = [
  {
    id: "early-sparks",
    year: "2022",
    title: "Early Sparks & Computing Fundamentals",
    subtitle: "Class 6-7 Exploration",
    description: "Discovered the magic of software architecture and turning logical instructions into interactive interfaces. Independently mastered semantic HTML, responsive CSS layouts, and basic JavaScript loops, building a rock-solid foundation for future complex development.",
    category: "early",
    icon: "Lightbulb",
    skills: ["HTML5 / Semantic Web", "CSS3 Flexbox & Grid", "Basic Algorithms", "UI Design Principles"],
    metrics: [
      { label: "Trigger Event", value: "Curiosity Spark" },
      { label: "Hours Logged", value: "350+ Dev Hours" }
    ]
  },
  {
    id: "dev-era",
    year: "2023",
    title: "Interactive Web Apps & Game Loops",
    subtitle: "Class 7-8 Progression",
    description: "Dived deep into advanced JavaScript and modern ES6+ paradigms. Explored reactive UI components and began experimenting with game loop mechanics, animation trees, and physics engines inside Unity and Godot to understand how digital interactive worlds are built.",
    category: "development",
    icon: "Gamepad2",
    skills: ["JavaScript ES6+", "React Concepts", "Unity & Godot Engines", "Interactive State Management"],
    metrics: [
      { label: "Game Projects", value: "3 Concepts Created" },
      { label: "State Paradigms", value: "Component Lifecycles" }
    ]
  },
  {
    id: "ai-spark",
    year: "2024",
    title: "AI Prompt Orchestration & Automation Chains",
    subtitle: "Class 8 Academic Milestone",
    description: "Experienced a paradigm shift with Large Language Models. Mastered complex Prompt Engineering concepts including few-shot prompting, system instructions, and chain-of-thought orchestration. Configured automated AI helper modules to speed up dev workflows.",
    category: "ai",
    icon: "BrainCircuit",
    skills: ["Prompt Engineering", "LLM Fine-Tuning Concepts", "API Integration", "Autonomous Workflow Chains"],
    metrics: [
      { label: "AI Engines Tested", value: "ChatGPT, Gemini, Claude" },
      { label: "Automation Level", value: "Agentic Assistant" }
    ]
  },
  {
    id: "warrior-launch",
    year: "2025",
    title: "Branding Warrior Developers & System Design",
    subtitle: "Class 10 Breakthroughs (Current)",
    description: "Formulated the 'Warrior Developers' brand, representing a bold vision for next-generation automated SaaS tools. Coded multiple advanced visual conceptual structures: Warrior Nexus (a complete digital hospital suite), Sonexa (AI digital assistant panel), and Vaster AI (autonomous website builder).",
    category: "ai",
    icon: "Code",
    skills: ["TypeScript", "Full Stack Paradigms", "Framer Motion", "Tailwind CSS", "Systems Design"],
    metrics: [
      { label: "Active Architectures", value: "4 Advanced Ecosystems" },
      { label: "Startup Focus", value: "Warrior Developers" }
    ]
  },
  {
    id: "future-deployment",
    year: "2026",
    title: "Database Integration & Smart Station Entry",
    subtitle: "Class 10 Goals",
    description: "Moving from static design simulations to live deployed server operations. Implementing Express/Node backends, real cloud databases (Firestore), and refining specs for the Smart Railway Station Entry System—integrating QR verification and adaptive crowd throttling algorithms.",
    category: "future",
    icon: "Rocket",
    skills: ["Express.js", "Cloud Firestore / PostgreSQL", "IoT Gateway Routing", "QR Algorithms"],
    metrics: [
      { label: "Target Deployment", value: "Cloud-Run Backends" },
      { label: "IoT Simulation", value: "150ms Barrier Verification" }
    ]
  },
  {
    id: "future-startup",
    year: "2027+",
    title: "Warrior Developers Enterprise Scale",
    subtitle: "Launch & Entrepreneurship Vision",
    description: "Formally establishing Warrior Developers as a real-world enterprise software startup. Providing transit networks, medical centers, and business offices with fully automated visual coordination suites, while mentoring the next wave of class-level coders through Warrior Studio publications.",
    category: "future",
    icon: "Terminal",
    skills: ["SaaS Scaling", "Product Management", "AI System Operations", "Business Automation"],
    metrics: [
      { label: "Core Venture", value: "Warrior Developers LLC" },
      { label: "Mission Impact", value: "Reshaping Transit & Health SaaS" }
    ]
  }
];

interface PortfolioContextType {
  personalInfo: PersonalInfo;
  skills: SkillCategory[];
  projects: Project[];
  innovations: Innovation[];
  achievements: Achievement[];
  timelineEvents: TimelineEvent[];
  blogPosts: BlogPost[];
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateSkills: (skills: SkillCategory[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateAchievements: (achievements: Achievement[]) => void;
  updateTimelineEvents: (events: TimelineEvent[]) => void;
  resetAll: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Setup baseline personal info with phone default
  const initialPersonalInfo: PersonalInfo = {
    ...defaultPersonalInfo,
    phone: "+91 98765 43210" // Default phone number
  };

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    const saved = localStorage.getItem("muhil_personal_info");
    return saved ? JSON.parse(saved) : initialPersonalInfo;
  });

  const [skills, setSkills] = useState<SkillCategory[]>(() => {
    const saved = localStorage.getItem("muhil_skills");
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("muhil_projects");
    if (saved) {
      const parsedProjects = JSON.parse(saved);
      // Merge missing fields from defaultProjects to ensure backward compatibility and apply new schema updates
      return parsedProjects.map((proj: Project) => {
        const defaultProj = defaultProjects.find(dp => dp.id === proj.id);
        if (defaultProj) {
          return { ...defaultProj, ...proj, status: proj.status || defaultProj.status, features: proj.features?.length ? proj.features : defaultProj.features };
        }
        return proj;
      });
    }
    return defaultProjects;
  });

  const [innovations] = useState<Innovation[]>(() => {
    return defaultInnovations;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("muhil_achievements");
    return saved ? JSON.parse(saved) : defaultAchievements;
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem("muhil_timeline_events");
    return saved ? JSON.parse(saved) : defaultTimelineEvents;
  });

  const [blogPosts] = useState<BlogPost[]>(() => {
    return defaultBlogPosts;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("muhil_personal_info", JSON.stringify(personalInfo));
  }, [personalInfo]);

  useEffect(() => {
    localStorage.setItem("muhil_skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("muhil_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("muhil_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("muhil_timeline_events", JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  // Synchronize with Firestore real-time updates
  useEffect(() => {
    const docRef = doc(db, "portfolio", "muhil");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.skills) setSkills(data.skills);
        if (data.projects) setProjects(data.projects);
        if (data.achievements) setAchievements(data.achievements);
        if (data.timelineEvents) setTimelineEvents(data.timelineEvents);
      }
    }, (error) => {
      console.warn("Firestore subscription inactive or offline fallback: ", error);
    });

    return () => unsubscribe();
  }, []);

  const updatePersonalInfo = async (info: PersonalInfo) => {
    setPersonalInfo(info);
    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), { personalInfo: info }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  const updateSkills = async (newSkills: SkillCategory[]) => {
    setSkills(newSkills);
    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), { skills: newSkills }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  const updateProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), { projects: newProjects }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  const updateAchievements = async (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), { achievements: newAchievements }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  const updateTimelineEvents = async (newEvents: TimelineEvent[]) => {
    setTimelineEvents(newEvents);
    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), { timelineEvents: newEvents }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  const resetAll = async () => {
    setPersonalInfo(initialPersonalInfo);
    setSkills(defaultSkills);
    setProjects(defaultProjects);
    setAchievements(defaultAchievements);
    setTimelineEvents(defaultTimelineEvents);
    localStorage.removeItem("muhil_personal_info");
    localStorage.removeItem("muhil_skills");
    localStorage.removeItem("muhil_projects");
    localStorage.removeItem("muhil_achievements");
    localStorage.removeItem("muhil_timeline_events");

    if (auth.currentUser && auth.currentUser.email === "muhilsiddhesh.in@gmail.com") {
      try {
        await setDoc(doc(db, "portfolio", "muhil"), {
          personalInfo: initialPersonalInfo,
          skills: defaultSkills,
          projects: defaultProjects,
          achievements: defaultAchievements,
          timelineEvents: defaultTimelineEvents
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, "portfolio/muhil");
      }
    }
  };

  return (
    <PortfolioContext.Provider value={{
      personalInfo,
      skills,
      projects,
      innovations,
      achievements,
      timelineEvents,
      blogPosts,
      updatePersonalInfo,
      updateSkills,
      updateProjects,
      updateAchievements,
      updateTimelineEvents,
      resetAll
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
