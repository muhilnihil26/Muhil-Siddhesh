/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Award, 
  Mail, 
  ArrowRight, 
  Download, 
  User, 
  Terminal, 
  CheckCircle2, 
  Target, 
  GraduationCap, 
  Send, 
  Github, 
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  Workflow,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import ParticleBackground from "./components/ParticleBackground";
import TerminalConsole from "./components/TerminalConsole";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import ResumeModal from "./components/ResumeModal";
import JourneyTimeline from "./components/JourneyTimeline";
import AdminPanel from "./components/AdminPanel";
import { usePortfolio } from "./context/PortfolioContext";
import { Phone } from "lucide-react";
import { playClickSound, playHoverSound, playSuccessSound } from "./utils/audio";

export default function App() {
  const { personalInfo, skills, projects, achievements } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.pathname === "/admin");

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname === "/admin");
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  if (isAdminRoute) {
    return <AdminPanel />;
  }
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStep, setBootStep] = useState("Loading Warrior Core OS...");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [activeSkillCat, setActiveSkillCat] = useState<number>(0);

  // Simulated Boot Screen
  useEffect(() => {
    const steps = [
      { p: 25, s: "Synthesizing particles network..." },
      { p: 55, s: "Compiling modular project specifications..." },
      { p: 80, s: "Syncing Muhil's cognitive developer matrix..." },
      { p: 100, s: "System online. Launching UX dashboard." }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }

        // Advance steps based on percentage
        const matchingStep = steps.find(s => next >= s.p && s.p > (steps[currentStepIdx - 1]?.p || 0));
        if (matchingStep && steps.indexOf(matchingStep) >= currentStepIdx) {
          setBootStep(matchingStep.s);
          currentStepIdx = steps.indexOf(matchingStep) + 1;
        }

        return next;
      });
    }, 18);

    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;

    playClickSound();
    setContactStatus("submitting");
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("./firebase");
      
      const messageId = `msg_${Date.now()}`;
      await setDoc(doc(db, "messages", messageId), {
        name: contactName,
        email: contactEmail,
        message: contactMsg,
        createdAt: new Date().toISOString()
      });

      // Send via server API to email both user and admin
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg })
        });
      } catch (err) {
        console.error("Failed to trigger email API", err);
      }

      playSuccessSound();
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setTimeout(() => setContactStatus("idle"), 4000);
    } catch (error) {
      console.error("Failed to submit message", error);
      setContactStatus("idle");
    }
  };

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>
      
      {/* Immersive Startup Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            id="app-loader-screen"
            className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 select-none"
          >
            <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6">
              {/* Monogram Circular Logo with Pulse/Glow */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 shadow-lg shadow-blue-500/5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 animate-pulse" />
                <span className="text-xl font-sans font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  MS
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-sm font-sans font-bold tracking-widest text-slate-100 uppercase">
                  Muhil Siddhesh
                </h1>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  AI & Software Developer Portfolio
                </p>
              </div>

              {/* Minimalist Micro-Progress Bar */}
              <div className="w-full space-y-2">
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full transition-all duration-75"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  <span>Loading</span>
                  <span>{bootProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Neural Network Particle Background */}
      <ParticleBackground />

      {/* Floating Scroll-to-Top Button or background grids */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Render Main Page Content */}
      {!loading && (
        <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* Responsive Header Navbar */}
          <Navbar onOpenResume={() => setResumeOpen(true)} />

          {/* 1. HERO SECTION */}
          <header id="hero" className="min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 max-w-7xl mx-auto w-full text-center relative">
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Young AI Founder HUD indicator */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono text-blue-400 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Full Stack & AI Architect</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight text-white leading-none">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent text-glow-indigo">
                  {personalInfo.name}
                </span>
              </h1>

              {/* Subheading Titles */}
              <p className="text-base sm:text-xl md:text-2xl font-display font-medium text-slate-300">
                {personalInfo.title}
              </p>

              {/* Custom Tagline */}
              <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                "{personalInfo.tagline}" — Crafting real-world autonomous algorithms for healthcare, automation, and enterprise operations.
              </p>

              {/* Call-to-Actions Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                    playClickSound();
                    const el = document.getElementById("projects");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  id="hero-cta-projects"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-mono font-extrabold text-xs uppercase tracking-wider rounded-full transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  View My Projects
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                    playClickSound();
                    setResumeOpen(true);
                  }}
                  id="hero-cta-resume"
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-full transition duration-200 cursor-pointer flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md"
                >
                  <Download className="w-4 h-4" />
                  View Resume
                </button>
                <button
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                    playClickSound();
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  id="hero-cta-contact"
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 font-mono text-xs uppercase tracking-wider rounded-full transition duration-200 cursor-pointer border border-white/10 backdrop-blur-md"
                >
                  Contact Me
                </button>
              </div>

            </div>

            {/* Futuristic CLI Interactive Terminal below */}
            <div className="w-full mt-16 px-2">
              <TerminalConsole />
            </div>
          </header>

          {/* 2. ABOUT ME SECTION */}
          <section id="about" className="py-24 px-4 bg-white/[0.02] border-y border-white/5 relative z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center md:text-left mb-12">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                  Developer Profile
                </span>
                <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                  About Muhil
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left side: Avatar and HUD Info Display */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative group p-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={personalInfo.avatarUrl}
                      alt={`${personalInfo.name} - Young Tech Founder Portrait`}
                      referrerPolicy="no-referrer"
                      className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-[22px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120";
                      }}
                    />
                    <div className="absolute inset-0 bg-[#030712]/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center rounded-[22px]">
                      <span className="text-xs font-mono text-white bg-[#030712]/80 px-3 py-1.5 rounded-full border border-white/10">
                        Warrior HQ Sync Active
                      </span>
                    </div>
                  </motion.div>

                  {/* Node Tech HUD Card */}
                  <div className="mt-6 bg-[#030712]/80 border border-white/10 rounded-2xl p-4 w-full max-w-sm font-mono text-[10px] text-slate-400 space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between border-b border-white/5 pb-1 mb-1 text-[11px] text-blue-400 font-bold uppercase">
                      <span>Node Telemetry</span>
                      <span>Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OPERATOR:</span>
                      <span className="text-slate-300 font-bold">{personalInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOCATION:</span>
                      <span className="text-slate-300">{personalInfo.location}</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span>ACADEMIC UNIT:</span>
                      <span className="text-slate-300 text-right line-clamp-1" title={`${personalInfo.education.grade}, ${personalInfo.education.school}`}>
                        {personalInfo.education.grade}, {personalInfo.education.school}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DEVELOPER ORG:</span>
                      <span className="text-purple-400 font-bold">Warrior Developers</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Detailed narrative bio and core vision */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 backdrop-blur-md">
                    <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Who is {personalInfo.name}?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify whitespace-pre-line">
                      {personalInfo.bio}
                    </p>
                  </div>

                  {/* Three Pillars Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 border border-white/10 rounded-2xl space-y-1 hover:bg-white/10 transition backdrop-blur-md">
                      <BrainCircuit className="w-5 h-5 text-blue-400" />
                      <div className="text-xs font-mono font-bold text-white uppercase">AI Integration</div>
                      <p className="text-[11px] text-slate-400">Prompt orchestration, autonomous chains, and automated digital operations.</p>
                    </div>
                    <div className="bg-white/5 p-4 border border-white/10 rounded-2xl space-y-1 hover:bg-white/10 transition backdrop-blur-md">
                      <Workflow className="w-5 h-5 text-purple-400" />
                      <div className="text-xs font-mono font-bold text-white uppercase">Full Stack</div>
                      <p className="text-[11px] text-slate-400">Robust client interfaces, state synchronization, APIs, and modern styling.</p>
                    </div>
                    <div className="bg-white/5 p-4 border border-white/10 rounded-2xl space-y-1 hover:bg-white/10 transition backdrop-blur-md">
                      <Laptop className="w-5 h-5 text-indigo-400" />
                      <div className="text-xs font-mono font-bold text-white uppercase">Startup Vision</div>
                      <p className="text-[11px] text-slate-400">Forming Warrior Developers to build automated tools for global businesses.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 2.5. JOURNEY SECTION */}
          <section id="journey" className="py-24 px-4 relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                Interactive Chronology
              </span>
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                Evolution & Roadmap
              </h2>
            </div>
            <JourneyTimeline />
          </section>

          {/* 3. SKILLS SECTION */}
          <section id="skills" className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                Cognitive Spectrum
              </span>
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                Skills & Technologies
              </h2>
            </div>

            {/* Categorization tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {skills.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSkillCat(idx)}
                  id={`btn-skill-tab-${idx}`}
                  className={`px-4 py-2 border rounded-full font-mono text-xs transition cursor-pointer backdrop-blur-md ${
                    activeSkillCat === idx
                      ? "bg-white/5 border-blue-500 text-blue-400 font-bold"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Display Active Category Skills with Animated Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              {(skills[activeSkillCat]?.skills || []).map((skill) => (
                <div key={skill.name} className="space-y-2 bg-black/25 p-4 border border-white/5 rounded-2xl backdrop-blur-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-white">{skill.name}</span>
                    <span className="font-mono text-blue-400 font-bold">{skill.level}%</span>
                  </div>
                  
                  {/* Skill level indicator bar */}
                  <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  
                  {skill.details && (
                    <p className="text-[10px] font-mono text-slate-400 leading-normal">
                      {skill.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. PROJECTS SECTION */}
          <section id="projects" className="py-16 md:py-24 px-4 md:px-8 bg-white/[0.02] border-y border-white/5 relative z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                    Creative Blueprint Repository
                  </span>
                  <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                    Personal Projects
                  </h2>
                </div>
                
                {/* Project Filter Controls */}
                <div className="flex flex-wrap justify-center gap-1.5 font-mono text-xs">
                  {["All", "AI", "Software", "Game"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      id={`btn-proj-filter-${cat}`}
                      className={`px-3 py-1.5 border rounded-full transition cursor-pointer backdrop-blur-md ${
                        selectedCategory === cat
                          ? "bg-white/5 border-blue-500 text-blue-400 font-bold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

            </div>
          </section>

          {/* 5. EDUCATION & CREDENTIALS SECTION */}
          <section id="education" className="py-24 px-4 bg-white/[0.02] border-t border-white/5 relative z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-12">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                  Timeline & Credentials
                </span>
                <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                  Academic Profile & Certifications
                </h2>
              </div>

              {/* Split layout: School details vs Credentials/Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* School Profile Panel (5 columns) */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-2xl border border-white/10 text-blue-400">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Current Academic Unit</h3>
                      <p className="text-xs text-slate-400">PM SHRI Kendriya Vidyalaya RTC ITBP Illuppaikudi</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-4 text-justify">
                    Currently pursuing Class 9. Building structured knowledge fields across sciences and languages, while dedicating personal hours to exploring software compilers, AI agent frameworks, and UI designs.
                  </p>

                  <div className="bg-black/25 p-4 rounded-2xl border border-white/5 font-mono text-[10px] space-y-2">
                    <div className="text-blue-400 font-bold uppercase text-[11px]">Academic Highlights</div>
                    <div className="flex justify-between text-slate-300">
                      <span>• Self-Taught Full Stack Code</span>
                      <span>100% Mastery</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>• Prompt Design Chaining</span>
                      <span>Advanced Tier</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>• Animation Sprites</span>
                      <span>Warrior Studio Core</span>
                    </div>
                  </div>
                </div>

                {/* Key Achievements & Verified Credentials (7 columns) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Dynamic Achievements List */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-400" />
                      Key Achievements & Honors
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {achievements.map((ach, idx) => (
                        <div 
                          key={idx}
                          className="bg-black/20 border border-white/5 p-4 rounded-2xl hover:border-blue-500/20 transition-all duration-200"
                        >
                          <h4 className="text-xs font-sans font-bold text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            {ach.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed pl-3.5 text-justify">
                            {ach.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certified & Verified Tech Credentials */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                      Verified Tech Credentials & Recognition
                    </h3>
                    
                    <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                      Core development concepts, software architectures, and technical competencies validated and certified against industry standards.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Google Credential Badge */}
                      <div className="bg-[#4285F4]/5 border border-[#4285F4]/20 hover:border-[#4285F4]/40 p-4 rounded-2xl flex flex-col justify-between transition-colors">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#4285F4] bg-[#4285F4]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            Google
                          </span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 mt-2">
                          Google Developer Concepts
                        </h4>
                        <span className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                          ● Verified Core Skills
                        </span>
                      </div>

                      {/* Microsoft Credential Badge */}
                      <div className="bg-[#F25022]/5 border border-[#F25022]/20 hover:border-[#F25022]/40 p-4 rounded-2xl flex flex-col justify-between transition-colors">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#F25022] bg-[#F25022]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            Microsoft
                          </span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 mt-2">
                          Cloud Architecture
                        </h4>
                        <span className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                          ● Verified Azure Concept
                        </span>
                      </div>

                      {/* Zoho Credential Badge */}
                      <div className="bg-[#E22E2E]/5 border border-[#E22E2E]/20 hover:border-[#E22E2E]/40 p-4 rounded-2xl flex flex-col justify-between transition-colors">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#E22E2E] bg-[#E22E2E]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            Zoho
                          </span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 mt-2">
                          Creator Automation
                        </h4>
                        <span className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                          ● Certified Developer API
                        </span>
                      </div>

                      {/* Meta Credential Badge */}
                      <div className="bg-[#0064E0]/5 border border-[#0064E0]/20 hover:border-[#0064E0]/40 p-4 rounded-2xl flex flex-col justify-between transition-colors">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#0064E0] bg-[#0064E0]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            Meta
                          </span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 mt-2">
                          Frontend AI Design
                        </h4>
                        <span className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                          ● Verified UI Integration
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* 8. CONTACT SECTION */}
          <section id="contact" className="py-16 md:py-24 px-4 md:px-8 bg-white/[0.02] border-t border-white/5 relative z-10 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                  Telemetry Channel
                </span>
                <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                  Get in Touch
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Have a question about my project blueprints or looking to collaborate? Drop a transmission package below.
                </p>
              </div>

              {/* Layout for direct details + form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Contact Info (4 Columns) */}
                <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between text-left backdrop-blur-md">
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Direct Contacts:</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate" title={personalInfo.email}>
                          {personalInfo.email}
                        </span>
                      </div>
                      {personalInfo.phone && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.github && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <Github className="w-4 h-4 text-purple-400 shrink-0" />
                          <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-white transition">Github</a>
                        </div>
                      )}
                      {personalInfo.linkedin && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition">LinkedIn</a>
                        </div>
                      )}
                      {personalInfo.instagram && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <svg className="w-4 h-4 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                          <a href={personalInfo.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram</a>
                        </div>
                      )}
                      {personalInfo.facebook && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                          <a href={personalInfo.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition">Facebook</a>
                        </div>
                      )}
                      {personalInfo.youtube && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.086 0 12 0 12s0 3.914.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.914 24 12 24 12s0-3.914-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          <a href={personalInfo.youtube} target="_blank" rel="noreferrer" className="hover:text-white transition">YouTube</a>
                        </div>
                      )}
                      {personalInfo.whatsapp && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.89-4.443 9.893-9.892.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.738-.974zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          <a href={personalInfo.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white transition">WhatsApp</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-4 text-[10px] font-mono text-slate-500 leading-normal">
                    *Telemetric routing handles messages via automated queue pipelines. Muhil responds within standard operating windows.
                  </div>
                </div>

                {/* Cyber Contact Form (8 Columns) */}
                <div className="md:col-span-8">
                  <form onSubmit={handleContactSubmit} className="bg-[#030712]/60 border border-white/10 rounded-3xl p-5 md:p-6 text-left space-y-4 backdrop-blur-md">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Sender Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          id="contact-form-name"
                          className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl p-3 sm:px-3 sm:py-2 text-sm sm:text-xs font-mono text-white outline-none placeholder-slate-600 transition"
                          placeholder="e.g. S. Raghavan"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          id="contact-form-email"
                          className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl p-3 sm:px-3 sm:py-2 text-sm sm:text-xs font-mono text-white outline-none placeholder-slate-600 transition"
                          placeholder="e.g. guest@terminal.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-bold">Transmission Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        id="contact-form-message"
                        className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl p-3 sm:px-3 sm:py-2 text-sm sm:text-xs font-mono text-white outline-none placeholder-slate-600 resize-none transition"
                        placeholder="Write message details..."
                      />
                    </div>

                    {/* Submit Button & States */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[10px] font-mono text-slate-500">
                        {contactStatus === "idle" && "SSL Secured Channel Available"}
                        {contactStatus === "submitting" && "Encoding data packet..."}
                      </div>

                      <button
                        type="submit"
                        onMouseEnter={playHoverSound}
                        disabled={contactStatus !== "idle"}
                        id="btn-contact-submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:bg-white/5 disabled:text-slate-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-full transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
                      >
                        {contactStatus === "submitting" ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Send Transmission
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {contactStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-xs font-mono text-emerald-400 mt-4"
                        >
                          ✔ Transmission successfully written to Muhil's local buffer. Automated dispatcher response dispatched to your email!
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </form>
                </div>

              </div>

            </div>
          </section>

          {/* FOOTER SECTION */}
          <footer className="bg-[#030712] border-t border-white/5 py-12 px-4 text-center text-xs font-mono text-slate-500 space-y-3 relative z-10">
            <p className="text-slate-300 font-sans font-bold tracking-widest text-[11px] uppercase">
              {personalInfo.fullName}
            </p>
            <p className="text-slate-500 max-w-md mx-auto text-[11px] leading-relaxed">
              "{personalInfo.tagline}" — Founder of Warrior Developers.
            </p>
            <div className="flex justify-center gap-4 pt-1">
              <a 
                href="/admin" 
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/admin");
                  window.dispatchEvent(new Event("popstate"));
                }}
                className="text-blue-500 hover:text-blue-400 hover:underline font-bold transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Console
              </a>
            </div>
            <div className="border-t border-white/5 max-w-sm mx-auto pt-3 mt-3">
              {personalInfo.name} © 2026. All Systems Operational.
            </div>
          </footer>

          {/* Printable Professional Resume Toggler Modal */}
          <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

        </div>
      )}

    </div>
  );
}
