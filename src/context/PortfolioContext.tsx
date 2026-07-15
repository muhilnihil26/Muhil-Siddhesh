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
    year: "2023",
    title: "Early Sparks & Computing Fundamentals",
    subtitle: "Class 9 Exploration",
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
    id: "warrior-nexus-era",
    year: "2024",
    title: "Warrior Nexus & Healthcare Systems",
    subtitle: "Class 10 Progression",
    description: "Built Warrior Nexus, a comprehensive digital healthcare framework. Engineered role-based access, smart queue management, pharmacy integration, and ambulance tracking to replace archaic manual administrative practices with dynamic, automated workflows.",
    category: "development",
    icon: "Code",
    skills: ["React", "TypeScript", "Tailwind CSS", "System Design", "Complex State Management"],
    metrics: [
      { label: "Lines of Code", value: "45,000+" },
      { label: "Components", value: "120+" }
    ]
  },
  {
    id: "ai-sonexa",
    year: "2025",
    title: "AI Orchestration & Sonexa Hub",
    subtitle: "Current Milestones",
    description: "Developed Sonexa, an AI-powered digital automation hub designed to orchestrate intelligent services. Integrated LLMs for complex natural language processing, transforming prompts into concrete service processes, data stream filters, and real-time visual step executions.",
    category: "ai",
    icon: "BrainCircuit",
    skills: ["LLM APIs", "Prompt Engineering", "JSON-RPC Concepts", "Agentic Workflows"],
    metrics: [
      { label: "Automated Workflows", value: "50+" },
      { label: "LLM Tokens Processed", value: "2M+" }
    ]
  },
  {
    id: "future-career",
    year: "2026+",
    title: "Future Career Goals & Enterprise Vision",
    subtitle: "The Road Ahead",
    description: "Aiming to establish Warrior Developers as an enterprise software startup. Planning to build innovative, high-impact AI-powered solutions for healthcare, education, and business automation, reshaping how humans interact with digital systems.",
    category: "future",
    icon: "Rocket",
    skills: ["AI Engineering", "Software Architecture", "Product Management", "SaaS Scaling"],
    metrics: [
      { label: "Core Venture", value: "Warrior Developers LLC" },
      { label: "Target Role", value: "AI Engineer & Founder" }
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
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialPersonalInfo, ...parsed };
    }
    return initialPersonalInfo;
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
        
        // Sanitize old image paths
        const sanitizePath = (path: string) => {
          if (typeof path !== 'string') return path;
          if (path.startsWith('/images/') || path.startsWith('data:image/') || path.startsWith('http://') || path.startsWith('https://')) return path;
          const parts = path.split('/');
          const filename = parts[parts.length - 1];
          return `/images/${filename}`;
        };
        
        if (data.personalInfo) {
          const sanitizedInfo = { ...data.personalInfo };
          if (sanitizedInfo.avatarUrl) sanitizedInfo.avatarUrl = sanitizePath(sanitizedInfo.avatarUrl);
          if (sanitizedInfo.avatarUrls) sanitizedInfo.avatarUrls = sanitizedInfo.avatarUrls.map(sanitizePath);
          setPersonalInfo(sanitizedInfo);
        }
        if (data.skills) setSkills(data.skills);
        if (data.projects) {
          const sanitizedProjects = data.projects.map((p: any) => ({
            ...p,
            screenshots: p.screenshots ? p.screenshots.map(sanitizePath) : []
          }));
          setProjects(sanitizedProjects);
        }
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
