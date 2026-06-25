/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  Cpu 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectCardProps {
  project: Project;
  key?: string;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* Project Card Grid Item */}
      <div
        id={`project-card-${project.id}`}
        className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_0_rgba(3,7,18,0.3)] transition-all duration-300 backdrop-blur-md flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle top light bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div>
          {/* Header row with icon name */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-white/5 px-2 py-0.5 border border-white/5 rounded-md">
              {project.category} Core
            </span>
            <span className="text-[10px] font-mono text-slate-500">ID: {project.id}</span>
          </div>

          <h3 className="text-lg font-sans font-bold text-white group-hover:text-blue-400 transition duration-150">
            {project.title}
          </h3>
          
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech badge lists */}
          <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="text-[9px] font-mono text-slate-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[9px] font-mono text-blue-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>

          {/* Action button trigger */}
          <button
            onClick={() => setIsOpen(true)}
            id={`btn-open-project-${project.id}`}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs font-mono rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 backdrop-blur-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Inspect Specifications
          </button>
        </div>
      </div>

      {/* Interactive specification Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#030712]/65 backdrop-blur-xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#030712]/90 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-4 md:p-6 z-10 custom-scrollbar backdrop-blur-2xl"
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
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {project.category} PROJECT CORE
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">SYSTEM ID: {project.id}.CORE</span>
                  </div>
                  <h2 className="text-2xl font-sans font-bold text-white mt-1.5 flex items-center gap-2">
                    {project.title}
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  </h2>
                </div>
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
                      {project.features.map((feat, i) => (
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
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
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

                  {/* PROJECT 2: Sonexa Sandbox */}
                  {project.id === "sonexa" && (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-indigo-400" />
                            Sonexa Service Pipeline
                          </span>
                          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-900/30">
                            Orchestrator
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 h-32 overflow-y-auto font-mono text-[10px] text-indigo-300 space-y-1.5 custom-scrollbar">
                          {sonexaLogs.length === 0 ? (
                            <span className="text-slate-600 italic">Type automation requirements below and hit 'Deploy'...</span>
                          ) : (
                            sonexaLogs.map((log, i) => <div key={i}>{log}</div>)
                          )}
                        </div>
                      </div>

                      <form onSubmit={handleSonexaProcess} className="flex gap-2 mt-4 pt-3 border-t border-slate-900">
                        <input
                          type="text"
                          placeholder="e.g. Build website API proxy..."
                          value={sonexaPrompt}
                          onChange={(e) => setSonexaPrompt(e.target.value)}
                          className="flex-1 bg-slate-950 text-xs font-mono text-indigo-300 border border-slate-850 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                        />
                        <button
                          type="submit"
                          disabled={sonexaStatus === "running"}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs px-3 rounded transition flex items-center gap-1 cursor-pointer"
                        >
                          {sonexaStatus === "running" ? "Parsing" : "Deploy"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* PROJECT 3: Kalsa the Warrior Spar Game */}
                  {project.id === "kalsa-warrior" && (
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
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${heroHp}%` }} />
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
                            <Code2 className="w-4 h-4 text-emerald-400" />
                            Vaster Compiler Stream
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">
                            Autonomous Dev
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 h-32 overflow-y-auto font-mono text-[9px] text-emerald-400 space-y-1 custom-scrollbar">
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
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono font-bold text-xs py-2 rounded transition flex items-center justify-center gap-1 mt-4 cursor-pointer"
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
      </AnimatePresence>
    </>
  );
}
