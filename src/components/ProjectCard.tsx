/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "../types";
import { 
  Terminal, 
  ExternalLink, 
  Github, 
  X, 
  Sparkles, 
  Layers, 
  HeartPulse, 
  ShieldAlert, 
  CheckCircle2, 
  Sword, 
  Code2, 
  Play, 
  Cpu,
  Database,
  Globe,
  Gamepad2
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";

interface ProjectCardProps {
  project: Project;
  key?: string;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getTechIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react') || t.includes('typescript') || t.includes('css')) return <Code2 className="w-3 h-3" />;
    if (t.includes('firebase') || t.includes('database') || t.includes('sql')) return <Database className="w-3 h-3" />;
    if (t.includes('ai') || t.includes('llm') || t.includes('agent')) return <Sparkles className="w-3 h-3" />;
    if (t.includes('node') || t.includes('api')) return <Cpu className="w-3 h-3" />;
    if (t.includes('godot') || t.includes('unity') || t.includes('game')) return <Gamepad2 className="w-3 h-3" />;
    return <Globe className="w-3 h-3" />;
  };

  // Mini-sandbox state for each project
  const [nexusQueue, setNexusQueue] = useState(["Patient S. Raghavan - Cabin A", "Patient Priyan K. - Cabin C", "Patient M. Abdul - Main Lab"]);
  const [newPatient, setNewPatient] = useState("");
  
  const [sonexaPrompt, setSonexaPrompt] = useState("");
  const [sonexaLogs, setSonexaLogs] = useState<string[]>([]);
  const [sonexaStatus, setSonexaStatus] = useState<"idle" | "running">("idle");

  const [combatLog, setCombatLog] = useState<string[]>(["Saga Spar Initialized. Hero Anven stands tall!"]);
  const [heroHp, setHeroHp] = useState(100);
  const [bossHp, setBossHp] = useState(120);

  const [vasterCode, setVasterCode] = useState<string[]>([]);
  const [vasterCompiling, setVasterCompiling] = useState(false);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.trim()) return;
    setNexusQueue((prev) => [...prev, `${newPatient.trim()} - Reception Gating`]);
    setNewPatient("");
  };

  const handleSonexaProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sonexaPrompt.trim()) return;
    setSonexaStatus("running");
    setSonexaLogs(["[Request Received] Decoding orchestration prompt...", `[Intents Detected] Target: Digital Automations`, "[Routing Engine] Creating task pipeline..."]);
    
    setTimeout(() => {
      setSonexaLogs(prev => [...prev, "[Agent Match] Spawned automation client: DevOpsAgent-v3", "[Execution] Generating code boilerplates, writing environment configurations...", "[Complete] Digital service deployed successfully!"]);
      setSonexaStatus("idle");
    }, 2000);
  };

  const handleAttack = () => {
    if (bossHp <= 0 || heroHp <= 0) return;
    const heroDmg = Math.floor(15 + Math.random() * 15);
    const bossDmg = Math.floor(10 + Math.random() * 20);
    
    const newBossHp = Math.max(0, bossHp - heroDmg);
    const newHeroHp = Math.max(0, heroHp - bossDmg);
    
    setBossHp(newBossHp);
    setHeroHp(newHeroHp);

    let logs = [`Anven strikes Evil King Makas for ${heroDmg} dmg!`];
    if (newBossHp <= 0) {
      logs.push("🎉 Evil King Makas has been defeated! Warrior Studio victory!");
    } else {
      logs.push(`Evil King Makas counters Anven for ${bossDmg} dmg!`);
      if (newHeroHp <= 0) {
        logs.push("💀 Anven has fallen in battle! Reset to retry.");
      }
    }
    setCombatLog(logs);
  };

  const handleCombatReset = () => {
    setHeroHp(100);
    setBossHp(120);
    setCombatLog(["Saga Spar Reset. Hero Anven draws his sword!"]);
  };

  const handleVasterCompile = () => {
    setVasterCompiling(true);
    setVasterCode(["// Initiating Vaster Autonomous Code Synthesis", "import { App } from './core';", "const designLayout = createGridUX({ theme: 'galactic-slate' });"]);
    
    let step = 0;
    const intervals = setInterval(() => {
      step++;
      if (step === 1) {
        setVasterCode(prev => [...prev, "generatingAPIProxies({ endpoint: '/api/v1/automation' });", "compilingDatabaseModels({ engine: 'firestore' });"]);
      } else if (step === 2) {
        setVasterCode(prev => [...prev, "injectingSecurityPolicies({ rules: 'firestore.rules' });", "bundlingAssets({ target: 'dist/client.js' });"]);
      } else {
        setVasterCode(prev => [...prev, "✨ Autonomous Compilation Successful. Project deployed to Cloud Run!"]);
        setVasterCompiling(false);
        clearInterval(intervals);
      }
    }, 1000);
  };

  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
    }));
    setParticles(newParticles);
    
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  return (
    <>
      {/* Project Card Grid Item */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        id={`project-card-${project.id}`}
        className="group relative w-full h-[320px] [perspective:1000px]"
      >
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 border border-white/10 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between overflow-hidden [backface-visibility:hidden]">
            
            {/* Particles Burst Effect */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 1, scale: 0 }}
                animate={{
                  x: p.x + (Math.random() - 0.5) * 300,
                  y: p.y + (Math.random() - 0.5) * 300,
                  opacity: 0,
                  scale: Math.random() * 2 + 1,
                }}
                transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full z-20 pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              />
            ))}

            {/* Animated Image Preview Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/background_img_1782830236819.jpg" 
                alt="Project Cover" 
                className="w-full h-full object-cover opacity-20 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050511]/60 to-[#050511]" />
            </div>
            
            {/* Subtle top light bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                {/* Header row with icon name */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-white/10 px-2 py-0.5 border border-white/10 rounded-md backdrop-blur-md">
                    {project.category} Core
                  </span>
                  <div className="flex items-center gap-2">
                    {project.status && (
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm border backdrop-blur-md ${
                        project.status === 'Live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        project.status === 'Beta' ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>
                        {project.status}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">ID: {project.id}</span>
                  </div>
                </div>

                <motion.h3 
                  className="text-xl font-sans font-bold text-white transition duration-150 drop-shadow-md"
                >
                  {project.title}
                </motion.h3>
                
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed drop-shadow">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech badge lists with icons */}
                <div className="flex flex-wrap gap-1.5 mt-4 mb-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="flex items-center gap-1 text-[9px] font-mono text-slate-300 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded backdrop-blur-md">
                      {getTechIcon(tech)}
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="flex items-center text-[9px] font-mono text-indigo-300 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded backdrop-blur-md">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[8px] font-mono uppercase text-slate-400">{metric.label}</span>
                        <span className="text-[10px] font-mono font-bold text-indigo-300">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 bg-[#050511]/95 border border-indigo-500/30 group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]">
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-sans font-bold text-indigo-400 mb-2">Technical Specifications</h4>
              <ul className="text-xs text-slate-300 space-y-1 mb-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {project.features?.map((feature, idx) => (
                  <li key={idx} className="flex gap-1.5">
                    <span className="text-indigo-500 mt-0.5">▹</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-white/10 mb-4">
                 {project.techStack.map((tech) => (
                  <span key={tech} className="text-[8px] font-mono text-slate-400 bg-white/5 px-1 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Action button trigger */}
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-2">
                  {(project.launchUrl || project.demoUrl) && (
                    <a
                      href={project.launchUrl || project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500/50 text-[10px] font-mono rounded-lg transition duration-200 flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      {project.launchUrl ? "Launch" : "Demo"}
                    </a>
                  )}
                  {project.videoUrl && (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-fuchsia-600/20 hover:bg-fuchsia-600/35 text-fuchsia-300 hover:text-white border border-fuchsia-500/20 hover:border-fuchsia-500/50 text-[10px] font-mono rounded-lg transition duration-200 flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 text-fuchsia-400" />
                      Watch
                    </a>
                  )}
                  {!project.launchUrl && !project.demoUrl && !project.videoUrl && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                      id={`btn-open-project-${project.id}`}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-[10px] font-mono rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 backdrop-blur-sm"
                    >
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      Inspect Specs
                    </button>
                  )}
                </div>
                 
                {(project.launchUrl || project.demoUrl || project.videoUrl) && (
                   <button
                      onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                      id={`btn-open-project-secondary-${project.id}`}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-[10px] font-mono rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 backdrop-blur-sm"
                    >
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      Inspect Specifications
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive specification Popup Modal */}
      {createPortal(
        <>
          {isOpen && (
            <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-[#050511]/95 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-4 md:p-6 z-10 custom-scrollbar"
              >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                id={`btn-close-project-modal-${project.id}`}
                className="absolute top-4 right-4 p-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-lg transition z-20 cursor-pointer backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {project.category} PROJECT CORE
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">SYSTEM ID: {project.id}.CORE</span>
                  </div>
                  <h2 className="text-2xl font-sans font-bold text-white mt-1.5 flex items-center gap-2">
                    {project.title}
                    <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                  </h2>
                </div>
                {project.launchUrl && (
                  <a
                    href={project.launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 md:mt-0 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500/60 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition duration-200 text-xs font-mono"
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                    Launch Live Application
                  </a>
                )}
              </div>

              {/* Body Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Information Spec Side (7 Columns) */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                      System Blueprint & Concept
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {project.detailedDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Architectural Subsystems
                    </h4>
                    <ul className="space-y-1.5">
                      {project.features?.map((feat, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Technological Elements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800/60 px-2.5 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.challenges && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                        Challenges Faced
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-red-500/10 border-l-2 border-l-red-500/50">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.roadmap && project.roadmap.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                        Project Roadmap
                      </h4>
                      <div className="flex flex-col gap-2">
                        {project.roadmap.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/20 p-2 rounded border border-slate-800/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.screenshots && project.screenshots.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                        Gallery & Previews
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {project.screenshots.map((img, idx) => (
                          <img key={idx} src={img} alt={`Preview ${idx+1}`} className="w-full h-24 object-cover rounded-lg border border-slate-800/50 hover:border-indigo-500/50 transition-colors" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Playground Side (5 Columns) */}
                <div className="lg:col-span-5 bg-slate-900/30 border border-slate-850 rounded-xl p-4 flex flex-col justify-between min-h-[300px]">
                  
                  {/* PROJECT 1: Warrior Nexus Sandbox */}
                  {project.id === "warrior-nexus" && (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <HeartPulse className="w-4 h-4 text-red-500" />
                            Nexus Ward Queue Tracker
                          </span>
                          <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30">
                            Active Database
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {nexusQueue.map((pat, idx) => (
                            <div key={idx} className="bg-slate-950/60 p-2 border border-slate-850 rounded text-[11px] font-mono text-slate-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                {pat}
                              </span>
                              <button
                                onClick={() => setNexusQueue((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-300 text-[9px] cursor-pointer"
                              >
                                Dispatch
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleAddPatient} className="flex gap-2 mt-4 pt-3 border-t border-slate-900">
                        <input
                          type="text"
                          placeholder="Patient full name..."
                          value={newPatient}
                          onChange={(e) => setNewPatient(e.target.value)}
                          className="flex-1 bg-slate-950 text-xs font-mono text-cyan-300 border border-slate-850 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 placeholder-slate-700"
                        />
                        <button
                          type="submit"
                          className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs px-2.5 rounded transition cursor-pointer"
                        >
                          Book Appt
                        </button>
                      </form>
                    </div>
                  )}

                  {/* PROJECT 2: Sonexa Sandbox / Iframes */}
                  {project.id === "sonexa" && (
                    <div className="flex flex-col h-full overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-400" />
                          Sonexa Live Previews
                        </span>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-900/30">
                          Guest Mode
                        </span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        <div className="w-full rounded-xl overflow-hidden border border-slate-800/80 bg-black h-[400px] shrink-0">
                          <iframe 
                            src="https://sonexa-listen-beyond-main.vercel.app/home" 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            title="Sonexa Home"
                            allow="autoplay; encrypted-media" 
                            allowFullScreen
                          ></iframe>
                        </div>
                        
                        <div className="w-full flex justify-center shrink-0 pb-4">
                          <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-black max-w-full">
                            <iframe 
                              src="https://sonexa-listen-beyond-main.vercel.app/reels?videoId=3L3dVIHy5xc&embed=true" 
                              width="360" 
                              height="640" 
                              className="max-w-full"
                              frameBorder="0" 
                              title="Sonexa Reels"
                              allow="autoplay; encrypted-media" 
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PROJECT 3: Veera Yugam Spar Game */}
                  {project.id === "veera-yugam" && (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <Sword className="w-4 h-4 text-yellow-500" />
                            Saga Spar Arena
                          </span>
                          <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/20 px-1.5 py-0.5 rounded border border-yellow-900/30">
                            Warrior Studio v1.2
                          </span>
                        </div>

                        {/* Health Bars */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-slate-950 p-2 rounded border border-slate-850 font-mono text-[10px]">
                            <div className="flex justify-between font-bold text-slate-300">
                              <span>Hero Anven</span>
                              <span>HP: {heroHp}/100</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${heroHp}%` }} />
                            </div>
                          </div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-850 font-mono text-[10px]">
                            <div className="flex justify-between font-bold text-slate-300">
                              <span>King Makas</span>
                              <span>HP: {bossHp}/120</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(bossHp / 120) * 100}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-2 rounded border border-slate-850 text-[10px] font-mono text-amber-300 h-16 overflow-y-auto custom-scrollbar">
                          {combatLog.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-900">
                        {heroHp > 0 && bossHp > 0 ? (
                          <button
                            onClick={handleAttack}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs py-1.5 rounded transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Sword className="w-3.5 h-3.5" />
                            Heroic Slash
                          </button>
                        ) : (
                          <button
                            onClick={handleCombatReset}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs py-1.5 rounded transition cursor-pointer"
                          >
                            Spar Again
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PROJECT 4: Vaster AI Sandbox */}
                  {project.id === "vaster-ai" && (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-indigo-400" />
                            Vaster Compiler Stream
                          </span>
                          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-900/30">
                            Autonomous Dev
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 h-32 overflow-y-auto font-mono text-[9px] text-indigo-400 space-y-1 custom-scrollbar">
                          {vasterCode.length === 0 ? (
                            <span className="text-slate-600 italic">Click compile below to trigger autonomous modular generation...</span>
                          ) : (
                            vasterCode.map((line, i) => <div key={i} className="leading-relaxed">{line}</div>)
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleVasterCompile}
                        disabled={vasterCompiling}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono font-bold text-xs py-2 rounded transition flex items-center justify-center gap-1 mt-4 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {vasterCompiling ? "Compiling Node Scripts..." : "Synthesize Software Core"}
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          </div>
        )}
        </>,
      document.getElementById('root') || document.body
    )}
    </>
  );
}
