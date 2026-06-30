/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { FileText, Printer, Download, Mail, Github, Globe, MapPin, X, GraduationCap, Trophy, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../context/PortfolioContext";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { personalInfo, skills, projects, achievements } = usePortfolio();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById("resume-print-area");
    if (!element) return;
    
    setIsGenerating(true);
    try {
      // Dynamic import to avoid SSR issues if ever applicable, and to keep initial bundle size small
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin:       10,
        filename:     `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      // We clone the element to manipulate it for PDF (like removing dark mode styles if any are inherited)
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = "#ffffff";
      clone.style.color = "#0f172a";
      clone.style.padding = "20px";
      
      const container = document.createElement('div');
      container.appendChild(clone);
      
      // Temporarily append to body to render
      document.body.appendChild(container);
      container.style.position = "absolute";
      container.style.left = "-9999px";

      await html2pdf().set(opt).from(container).save();
      
      // Cleanup
      document.body.removeChild(container);

    } catch (error) {
      console.error("PDF generation failed", error);
      // Fallback
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030712]/65 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-[#030712]/90 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl z-10 backdrop-blur-2xl"
          >
            
            {/* Header / Actions Panel */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                  Interactive Resume Hub
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    const { playClickSound } = await import("../utils/audio");
                    playClickSound();
                    handlePrint();
                  }}
                  onMouseEnter={async () => {
                    const { playHoverSound } = await import("../utils/audio");
                    playHoverSound();
                  }}
                  disabled={isGenerating}
                  id="btn-print-resume"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full text-xs font-mono flex items-center gap-1.5 transition border border-white/10 cursor-pointer backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      Download PDF
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    const { playClickSound } = await import("../utils/audio");
                    playClickSound();
                    onClose();
                  }}
                  onMouseEnter={async () => {
                    const { playHoverSound } = await import("../utils/audio");
                    playHoverSound();
                  }}
                  id="btn-close-resume"
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-full transition cursor-pointer backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Resume Sheet Body (Scrollable in modal, formatted for print) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-950/40">
              
              {/* Actual paper mimic layout sheet */}
              <div 
                id="resume-print-area"
                className="bg-white text-slate-900 p-6 md:p-10 rounded-xl shadow-xl max-w-3xl mx-auto font-sans leading-relaxed text-sm printable-sheet"
              >
                
                {/* Resume Header Section */}
                <div className="border-b-2 border-slate-900 pb-5 mb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-sans font-extrabold tracking-tight text-slate-950 uppercase">
                      {personalInfo.fullName}
                    </h1>
                    <p className="text-sm font-mono font-bold text-indigo-600 mt-1 uppercase tracking-wide">
                      {personalInfo.title}
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Class 10 Tech Innovator & Aspiring Startup Founder
                    </p>
                  </div>
                  
                  {/* Telemetry Contact Specs */}
                  <div className="text-xs text-slate-600 space-y-1 font-mono md:text-right">
                    <div className="flex md:justify-end items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex md:justify-end items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex md:justify-end items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-slate-500" />
                      <span>github.com/WarriorDevelopers</span>
                    </div>
                  </div>
                </div>

                {/* Resume Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Main Column (8 columns) */}
                  <div className="md:col-span-8 space-y-6">
                    
                    {/* Summary */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        Executive Profile Summary
                      </h3>
                      <p className="text-xs text-slate-700 text-justify">
                        {personalInfo.bio}
                      </p>
                    </div>

                    {/* Blueprinted Innovations */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        Blueprinted Software Systems
                      </h3>
                      <div className="space-y-4">
                        {projects.map((proj) => (
                          <div key={proj.id} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-950">
                              <span>{proj.title}</span>
                              <span className="font-mono text-slate-500 text-[10px] uppercase font-normal">{proj.category} Core</span>
                            </div>
                            <p className="text-slate-600 mt-1 text-justify">
                              {proj.description}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1 font-mono text-[9px] text-slate-500 font-semibold">
                              <span>Tech Stack:</span>
                              {proj.techStack.map((tech, i) => (
                                <span key={tech}>
                                  {tech}{i < proj.techStack.length - 1 ? " • " : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Smart Railway entry */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        System Innovation Concepts
                      </h3>
                      <div className="text-xs">
                        <div className="font-bold text-slate-950">Smart Railway Station Entry System</div>
                        <p className="text-slate-600 mt-1 text-justify">
                          Automated access barriers utilizing QR ticket sweeps, train timetable-guided flow throttling algorithms, and encrypted single-session mobile OTP generation for relative platform guards.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Sidebar Column (4 columns) */}
                  <div className="md:col-span-4 space-y-6">
                    
                    {/* Education block */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        Education
                      </h3>
                      <div className="text-xs">
                        <div className="font-bold text-slate-950">{personalInfo.education.school}</div>
                        <div className="text-slate-600 font-medium">{personalInfo.education.grade}</div>
                        <div className="text-indigo-600 font-bold font-mono text-[9px] mt-1 uppercase tracking-wide">AI & Dev Enthusiast</div>
                      </div>
                    </div>

                    {/* Goals block */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                        Future Target
                      </h3>
                      <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                        <div className="font-bold text-slate-950">{personalInfo.careerGoal.role}</div>
                        <div className="text-[10px] text-indigo-600 font-mono font-bold uppercase">{personalInfo.careerGoal.firm}</div>
                        <p className="text-[11px] text-slate-600 mt-1 italic text-justify leading-relaxed">
                          {personalInfo.careerGoal.description}
                        </p>
                      </div>
                    </div>

                    {/* Skill Lists */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                        Capabilities
                      </h3>
                      <div className="space-y-3.5 text-xs">
                        {skills.slice(0, 3).map((cat) => (
                          <div key={cat.title}>
                            <div className="font-bold text-slate-950 text-[11px] uppercase tracking-wider mb-1">
                              {cat.title}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {cat.skills.map((s) => (
                                <span 
                                  key={s.name}
                                  className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements block */}
                    <div>
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-indigo-600" />
                        Achievements
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-600 pl-3 list-disc">
                        {achievements.map((ach, idx) => (
                          <li key={idx} className="text-justify leading-snug">
                            <strong>{ach.title}</strong>: {ach.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Print Footer Notice */}
                <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] font-mono text-slate-400 select-none hidden-print">
                  Generated via Muhil's Portfolio System. © 2026 Muhil Siddhesh.
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
