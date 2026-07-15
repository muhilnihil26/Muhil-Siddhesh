/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Gamepad2, 
  BrainCircuit, 
  Code, 
  Rocket, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  ListFilter,
  Layers,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TimelineEvent } from "../types";
import { usePortfolio } from "../context/PortfolioContext";

// Helper to render lucide icon dynamically
const getTimelineIcon = (iconName: string, className: string = "w-5 h-5") => {
  switch (iconName) {
    case "Lightbulb":
      return <Lightbulb className={className} />;
    case "Gamepad2":
      return <Gamepad2 className={className} />;
    case "BrainCircuit":
      return <BrainCircuit className={className} />;
    case "Code":
      return <Code className={className} />;
    case "Rocket":
      return <Rocket className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export default function JourneyTimeline() {
  const { timelineEvents } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"interactive" | "list">("interactive");

  // Sync selectedEventId when timelineEvents load or category changes
  useEffect(() => {
    if (timelineEvents.length > 0) {
      const activeEvents = timelineEvents.filter(e => activeCategory === "all" || e.category === activeCategory);
      if (activeEvents.length > 0) {
        // If current selectedEventId is not in active list, select first of active list
        if (!activeEvents.some(e => e.id === selectedEventId)) {
          setSelectedEventId(activeEvents[0].id);
        }
      }
    }
  }, [timelineEvents, activeCategory, selectedEventId]);

  const categories = [
    { id: "all", label: "Full Journey" },
    { id: "early", label: "Early Sparks (2022)" },
    { id: "development", label: "Interactive Dev (2023)" },
    { id: "ai", label: "AI & Current Era (2024-2025)" },
    { id: "future", label: "Future Frontier (2026+)" }
  ];

  // Filter events based on selected tab
  const filteredEvents = timelineEvents.filter(event => {
    if (activeCategory === "all") return true;
    return event.category === activeCategory;
  });

  // Selected event for interactive details panel
  const selectedEvent = timelineEvents.find(e => e.id === selectedEventId) || timelineEvents[0] || {
    id: "",
    year: "",
    title: "",
    subtitle: "",
    description: "",
    category: "ai",
    icon: "Sparkles",
    skills: [],
    metrics: []
  };

  const handleNextEvent = () => {
    const currentIndex = timelineEvents.findIndex(e => e.id === selectedEventId);
    if (currentIndex !== -1 && currentIndex < timelineEvents.length - 1) {
      setSelectedEventId(timelineEvents[currentIndex + 1].id);
    } else if (timelineEvents.length > 0) {
      setSelectedEventId(timelineEvents[0].id); // wrap around
    }
  };

  const handlePrevEvent = () => {
    const currentIndex = timelineEvents.findIndex(e => e.id === selectedEventId);
    if (currentIndex > 0) {
      setSelectedEventId(timelineEvents[currentIndex - 1].id);
    } else if (timelineEvents.length > 0) {
      setSelectedEventId(timelineEvents[timelineEvents.length - 1].id); // wrap around
    }
  };

  return (
    <div id="journey-timeline-section" className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-md relative z-10 overflow-hidden">
      
      {/* HUD Header Decor */}
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-500 flex items-center gap-1.5 pointer-events-none select-none">
        <Cpu className="w-3 h-3 text-indigo-400 animate-pulse" />
        <span>JOURNEY_TRAJECTORY_ENGINE_v2.1</span>
      </div>

      {/* Main Timeline Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <h3 className="text-lg md:text-xl font-sans font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            The Evolution of a Young Founder
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track Muhil's milestones from class-level curiosity to pioneering AI systems and future ventures.
          </p>
        </div>

        {/* View Toggle Switches */}
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setViewMode("interactive")}
            id="btn-view-interactive"
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
              viewMode === "interactive"
                ? "bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            HUD Console View
          </button>
          <button
            onClick={() => setViewMode("list")}
            id="btn-view-list"
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
              viewMode === "list"
                ? "bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Chronological List
          </button>
        </div>
      </div>

      {/* Category Tabs / Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              // Auto focus first item in filtered list if active selection is no longer matching
              const firstMatch = timelineEvents.find(e => cat.id === "all" || e.category === cat.id);
              if (firstMatch) {
                setSelectedEventId(firstMatch.id);
              }
            }}
            id={`btn-timeline-cat-${cat.id}`}
            className={`px-3 py-1.5 border rounded-full text-xs font-mono transition cursor-pointer backdrop-blur-md ${
              activeCategory === cat.id
                ? "bg-white/5 border-blue-500 text-indigo-400 font-bold shadow-lg shadow-blue-500/10"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ==================== VIEW MODE 1: INTERACTIVE HUD CONSOLE ==================== */}
      <AnimatePresence mode="wait">
        {viewMode === "interactive" && (
          <motion.div
            key="view-interactive"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            
            {/* LEFT: Nodes Pathway (Vertical on desktop, horizontal on mobile) (5 columns) */}
            <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Header Label */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 font-mono text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ListFilter className="w-3 h-3 text-indigo-400 animate-pulse" />
                  NAVIGATION ORBIT
                </span>
                <span>{filteredEvents.length} MILESTONES FOUND</span>
              </div>

              {/* Pathway Loop */}
              <div className="flex-1 flex flex-col justify-center space-y-3 relative z-10 py-2">
                {timelineEvents.map((event, idx) => {
                  const isSelected = event.id === selectedEventId;
                  const isFilteredOut = activeCategory !== "all" && event.category !== activeCategory;
                  
                  return (
                    <motion.button
                      whileHover={isFilteredOut ? {} : { x: 5 }}
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      id={`btn-node-${event.id}`}
                      className={`w-full flex items-center gap-4 text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-white/10 border-indigo-500/50 shadow-md shadow-blue-500/5"
                          : isFilteredOut
                          ? "opacity-30 border-white/5 hover:opacity-50"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Year badge indicator */}
                      <div className={`w-14 shrink-0 font-mono text-center py-1 rounded-md text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-sm"
                          : "bg-black/30 text-slate-400 group-hover:text-white"
                      }`}>
                        {event.year}
                      </div>

                      {/* Icon connector indicator */}
                      <div className={`p-1.5 rounded-full border transition-all ${
                        isSelected 
                          ? "bg-indigo-500/20 border-indigo-400 text-indigo-400 scale-110 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                          : "bg-black/20 border-white/10 text-slate-500 group-hover:text-slate-300"
                      }`}>
                        {getTimelineIcon(event.icon, "w-3.5 h-3.5")}
                      </div>

                      {/* Snippet summary title */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-sans font-bold truncate transition ${
                          isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}>
                          {event.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tight truncate">
                          {event.subtitle}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation Slide Buttons */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <button
                  onClick={handlePrevEvent}
                  id="btn-timeline-prev"
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  PREV
                </button>
                <div className="text-[10px] font-mono text-slate-500">
                  CLICK NODES OR USE SLIDERS
                </div>
                <button
                  onClick={handleNextEvent}
                  id="btn-timeline-next"
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                >
                  NEXT
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* RIGHT: Selected Node Specifications Console (7 columns) */}
            <div className="lg:col-span-7 bg-black/45 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              
              {/* Animated glass shine effect */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

              <div className="space-y-5">
                {/* Panel Title bar */}
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    CORE SPECIFICATION DATABASE
                  </span>
                  <span className="text-indigo-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    NODE_ID: {selectedEvent.id.toUpperCase()}
                  </span>
                </div>

                {/* Main Heading details */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-fuchsia-500/10 border border-white/10 rounded-2xl text-indigo-400 shrink-0 shadow-inner">
                    {getTimelineIcon(selectedEvent.icon, "w-6 h-6")}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[10px] font-mono text-indigo-400 font-bold uppercase mb-1">
                      {selectedEvent.year} • {selectedEvent.subtitle}
                    </div>
                    <h4 className="text-base sm:text-lg font-sans font-extrabold text-white leading-tight">
                      {selectedEvent.title}
                    </h4>
                  </div>
                </div>

                {/* Long description text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify bg-white/[0.01] p-3 rounded-xl border border-white/5">
                  {selectedEvent.description}
                </p>

                {/* Metrics display sub-grid */}
                {selectedEvent.metrics && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEvent.metrics.map((m, i) => (
                      <div key={i} className="bg-white/5 p-2.5 rounded-xl border border-white/5 font-mono text-[10px]">
                        <div className="text-slate-500 uppercase font-bold">{m.label}</div>
                        <div className="text-slate-200 font-bold mt-0.5 text-xs truncate">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills/Technologies Badges */}
                {selectedEvent.skills && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Skills Cultivated / Utilized:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEvent.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-mono text-slate-300 hover:text-white hover:bg-white/10 transition"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Status footer banner */}
              <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  MIL_OS_NODE STATUS: SYNCED
                </span>
                <span>COGNITIVE MATRIX VERIFIED</span>
              </div>

            </div>

          </motion.div>
        )}

        {/* ==================== VIEW MODE 2: CHRONOLOGICAL LIST VIEW ==================== */}
        {viewMode === "list" && (
          <motion.div
            key="view-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative border-l border-white/10 ml-4 md:ml-12 pl-6 md:pl-10 py-4 space-y-12"
          >
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                
                {/* Timeline Node Point (Glow Pulse on Hover) */}
                <div className="absolute -left-[35px] md:-left-[51px] top-1 w-4 h-4 rounded-full bg-black border-2 border-white/20 flex items-center justify-center transition group-hover:border-blue-500/80 group-hover:scale-110 shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-blue-400 animate-pulse" />
                </div>

                {/* Left Year Label for desktop */}
                <div className="absolute -left-[104px] top-0.5 hidden md:block w-16 text-right font-mono text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition">
                  {event.year}
                </div>

                {/* Accordion Card details */}
                <div className="bg-black/25 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all shadow-inner backdrop-blur-md relative overflow-hidden">
                  
                  {/* Decorative background beam */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-fuchsia-600 opacity-30" />

                  <div className="pl-3 space-y-4">
                    {/* Header line */}
                    <div>
                      <div className="md:hidden inline-block font-mono text-xs font-extrabold text-indigo-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md mb-2">
                        {event.year}
                      </div>
                      <div className="flex items-center gap-2">
                        {getTimelineIcon(event.icon, "w-4 h-4 text-indigo-400 shrink-0")}
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                          {event.subtitle}
                        </span>
                      </div>
                      <h4 className="text-base font-sans font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                        {event.title}
                      </h4>
                    </div>

                    {/* Main narrative content */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                      {event.description}
                    </p>

                    {/* Stats display & Tech specs */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-white/5 text-[10px] font-mono">
                      {event.skills && (
                        <div className="flex flex-wrap gap-1">
                          {event.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400">
                              {skill}
                            </span>
                          ))}
                          {event.skills.length > 3 && (
                            <span className="text-slate-500 pl-1">+{event.skills.length - 3} more</span>
                          )}
                        </div>
                      )}
                      {event.metrics && event.metrics[0] && (
                        <div className="text-slate-500">
                          {event.metrics[0].label}: <strong className="text-slate-300">{event.metrics[0].value}</strong>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
