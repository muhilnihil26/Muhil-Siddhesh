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
import InnovationSim from "./components/InnovationSim";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import ResumeModal from "./components/ResumeModal";
import JourneyTimeline from "./components/JourneyTimeline";
import AdminPanel from "./components/AdminPanel";
import { usePortfolio } from "./context/PortfolioContext";
import { Phone } from "lucide-react";

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;

    setContactStatus("submitting");
    setTimeout(() => {
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setTimeout(() => setContactStatus("idle"), 4000);
    }, 1800);
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
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            id="app-loader-screen"
            className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 font-mono select-none"
          >
            <div className="w-full max-w-md text-left space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
                  SYSTEM INITIALIZATION SEQUENCE
                </span>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs text-slate-300 backdrop-blur-md">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>BOOT NODE: Cloud-Run-Svr</span>
                  <span className="text-blue-400 font-bold">PORT 3000</span>
                </div>
                <div className="text-blue-400 font-bold text-sm h-5">{bootStep}</div>
                <div className="text-[10px] text-slate-500">
                  Checking modules: Types safe, Particles canvas OK, Resume PDF templates ready.
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase">
                  <span>Downloading Assets</span>
                  <span>{bootProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-75"
                    style={{ width: `${bootProgress}%` }}
                  />
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
                  onClick={() => {
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
                  onClick={() => setResumeOpen(true)}
                  id="hero-cta-resume"
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-full transition duration-200 cursor-pointer flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md"
                >
                  <Download className="w-4 h-4" />
                  View Resume
                </button>
                <button
                  onClick={() => {
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
                  <div className="relative group p-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
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
                  </div>

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
          <section id="projects" className="py-24 px-4 bg-white/[0.02] border-y border-white/5 relative z-10 backdrop-blur-sm">
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

          {/* 5. INNOVATION SECTION */}
          <section id="innovation" className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                Conceptual Breakthroughs
              </span>
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                Smart Station Entry Innovation
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
                Discover Muhil's blueprint for the modern railway station—an ecosystem optimizing crowd movement, verifying tickets dynamically, and securely handling guest access.
              </p>
            </div>

            {/* Visual simulation sandbox component */}
            <div className="space-y-6">
              <InnovationSim />
              
              {/* Written Details Grid explaining specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <h4 className="text-xs font-mono text-blue-400 font-bold uppercase mb-2">PNR Optical Barriers</h4>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Instead of slow paper-stamping steps, high-speed optical turnstiles parse structured PNR database signatures instantly. Upon match confirmation, access corridors blink green and arm triggers spin automatically.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <h4 className="text-xs font-mono text-blue-400 font-bold uppercase mb-2">Adaptive Flow Throttling</h4>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Dynamic timers track train departures and queue lengths. If platform density limits are flagged, the gateway AI automatically scales verification delays from 1.5s to 4.5s to regulate passengers flow seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. EDUCATION & FUTURE ROADMAP SECTION */}
          <section id="education" className="py-24 px-4 bg-white/[0.02] border-y border-white/5 relative z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-12">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                  Mission Timeline
                </span>
                <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                  Education & Career Goals
                </h2>
              </div>

              {/* Split layout: School details vs Roadmap */}
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

                {/* Entrepreneurial Roadmap Panel (7 columns) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Warrior Developers: Growth Map
                    </h3>

                    <div className="space-y-6 relative border-l border-white/10 ml-3.5 pl-6">
                      
                      {/* Step 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] border-2 border-[#030712]" />
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase">Phase 01: Build Concepts (Class 9-10)</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Refining high-fidelity architectural models like Warrior Nexus and Sonexa. Expanding coding proficiency in TypeScript, React, and Game Mechanics.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-[#030712]" />
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase">Phase 02: Systems Engineering (Class 11-12)</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Pioneering full production pipelines. Testing real APIs, database relays, cloud storage, and hosting early software mockups for peer clinics and services.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] border-2 border-[#030712]" />
                        <h4 className="text-xs font-mono font-bold text-purple-400 uppercase">Phase 03: Warrior Developers Launch</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Forming 'Warrior Developers' as a real-world software startup to offer enterprise automated tools, hospital coordination portals, and educational utilities.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 7. ACHIEVEMENTS SECTION */}
          <section id="achievements" className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
                Distinctions
              </span>
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3">
                Key Accomplishments
              </h2>
            </div>

            {/* Bento-style Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div 
                  key={idx}
                  id={`achievement-bento-${idx}`}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-blue-500/30 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition duration-200 backdrop-blur-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-blue-400 mt-0.5">
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wide">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed text-justify">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. CONTACT SECTION */}
          <section id="contact" className="py-24 px-4 bg-white/[0.02] border-t border-white/5 relative z-10 backdrop-blur-sm">
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
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <Github className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>github.com/WarriorDevelopers</span>
                      </div>
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
                          className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none placeholder-slate-600 transition"
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
                          className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none placeholder-slate-600 transition"
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
                        className="w-full bg-black/25 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none placeholder-slate-600 resize-none transition"
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
