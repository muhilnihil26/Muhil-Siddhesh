/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, ChevronRight, CornerDownLeft, Sparkles } from "lucide-react";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "info" | "success" | "ascii";
}

const COMMAND_SUGGESTIONS = [
  { cmd: "help", label: "Help" },
  { cmd: "whoami", label: "Who Am I" },
  { cmd: "skills", label: "Skills" },
  { cmd: "projects", label: "Projects" },
  { cmd: "innovate", label: "Railway Innovation" },
  { cmd: "warrior", label: "Warrior Studio" },
  { cmd: "contact", label: "Contact Info" },
  { cmd: "clear", label: "Clear" }
];

export default function TerminalConsole() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogLine[]>([
    { text: "=== WARRIOR CORE TERMINAL v4.2 ===", type: "info" },
    { text: "Initializing quantum prompt parser...", type: "info" },
    { text: "Connection secure. Muhil's portfolio catalog is online.", type: "success" },
    { text: "Type 'help' or click any of the quick-commands below to explore.", type: "output" }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();

    const newLines: LogLine[] = [
      { text: `muhil-os@guest:~$ ${trimmed}`, type: "input" }
    ];

    switch (command) {
      case "help":
        newLines.push(
          { text: "Available System Commands:", type: "info" },
          { text: "  whoami      - Discover who Muhil is and his career objective", type: "output" },
          { text: "  skills      - Scan Muhil's technical cognitive modules", type: "output" },
          { text: "  projects    - List innovative systems built by Muhil", type: "output" },
          { text: "  innovate    - Inspect the Smart Railway Station Entry blueprint", type: "output" },
          { text: "  warrior     - Retrieve Warrior Studio profile and ASCII shield", type: "output" },
          { text: "  contact     - Display telemetry contact pathways", type: "output" },
          { text: "  clear       - Wipe the current terminal matrix log", type: "output" },
          { text: "  quote       - Load a tech catalyst quote from storage", type: "output" }
        );
        break;

      case "whoami":
        newLines.push(
          { text: "NAME: Muhil (Muhil Siddhesh)", type: "success" },
          { text: "CLASS: Grade 9 Student Pioneer", type: "output" },
          { text: "MISSION: Founder of Warrior Developers & Software Architect", type: "output" },
          { text: "COGNITIVE ALIGNMENT: Full Stack Dev | AI Engineer | Tech Entrepreneur", type: "output" },
          { text: "GOAL: Building automated AI infrastructure for Healthcare, Education, and Logistics.", type: "info" }
        );
        break;

      case "skills":
        newLines.push(
          { text: "=== SKILLS DIAGNOSTIC COGNITIVE SPECS ===", type: "info" },
          { text: "ARTIFICIAL INTELLIGENCE", type: "success" },
          { text: "  Prompt Eng.     [███████████████████-] 95%", type: "output" },
          { text: "  AI Automation   [█████████████████---] 85%", type: "output" },
          { text: "  LLM Concepts    [████████████████----] 80%", type: "output" },
          { text: "WEB DEVELOPMENT", type: "success" },
          { text: "  HTML / CSS      [██████████████████--] 90%", type: "output" },
          { text: "  JavaScript / TS [█████████████████---] 85%", type: "output" },
          { text: "  React / Vite    [█████████████████---] 85%", type: "output" },
          { text: "TOOLS", type: "success" },
          { text: "  ChatGPT / Devin [███████████████████-] 95%", type: "output" },
          { text: "  Unity / Godot   [████████████████----] 80%", type: "output" }
        );
        break;

      case "projects":
        newLines.push(
          { text: "=== PROJECTS INDEX ===", type: "info" },
          { text: "1. WARRIOR NEXUS [Category: HealthTech Automation]", type: "success" },
          { text: "   Features: Role-based dashboards, queue manager, digital pharmacy dispatch.", type: "output" },
          { text: "2. SONEXA [Category: AI Services Hub]", type: "success" },
          { text: "   Features: Natural language service pipelines, modular workflow triggers.", type: "output" },
          { text: "3. VEERA YUGAM [Category: Gaming Storyboards]", type: "success" },
          { text: "   Features: Interactive combat simulations, lore chapters of hero Anven.", type: "output" },
          { text: "4. VASTER AI [Category: Autonomous Web Architect]", type: "success" },
          { text: "   Features: Autonomous boilerplate scaffold code blocks & layout generators.", type: "output" }
        );
        break;

      case "innovate":
        newLines.push(
          { text: "=== BLUEPRINT: Smart Railway Station Entry System ===", type: "info" },
          { text: "CONGESTION SOLUTION VERIFIED:", type: "success" },
          { text: " - Instantly decodes PNR credentials at digital barriers in under 150ms.", type: "output" },
          { text: " - Dynamically triggers smart gate throughput limits matching train schedules.", type: "output" },
          { text: " - Issues single-pass secure guest OTP validation for relative platforms.", type: "output" },
          { text: "SYSTEM STATUS: Conceptual Blueprint with UI Sandbox (See section below!)", type: "info" }
        );
        break;

      case "warrior":
        newLines.push(
          {
            text: `
      /\\
     /  \\
    /____\\
   |  __  |    WARRIOR STUDIO
   | |  | |    =========================
   | |__| |    Crafting legend narratives,
   |  __  |    hero sagas (Veera Yugam series),
   | |  | |    and futuristic software systems.
   |_|  |_|
`,
            type: "ascii"
          },
          { text: "ESTABLISHED: 2024", type: "info" },
          { text: "CURRENT PRODUCTION: Veera Yugam - Saga of Hero Anven", type: "success" }
        );
        break;

      case "contact":
        newLines.push(
          { text: "=== TRANSMISSION CHANNELS ===", type: "info" },
          { text: "EMAIL: muhilsiddhesh.in@gmail.com", type: "success" },
          { text: "GITHUB: https://github.com (WarriorDevelopers HQ)", type: "output" },
          { text: "STATUS: Open to collaboration on cutting-edge AI and SaaS tooling.", type: "info" }
        );
        break;

      case "quote":
        const quotes = [
          "\"The best way to predict the future is to invent it.\" — Alan Kay",
          "\"AI does not replace human ingenuity; it expands it into infinity.\" — Muhil",
          "\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke",
          "\"Code is like humor. When you have to explain it, it’s bad.\" — Cory House"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        newLines.push({ text: randomQuote, type: "info" });
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        newLines.push({
          text: `Command not recognized: '${command}'. Type 'help' to see valid protocols.`,
          type: "error"
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div id="terminal-console" className="w-full max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs font-mono text-slate-300 pl-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            warrior-core-terminal@muhil-os:~
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          <Sparkles className="w-3 h-3 animate-pulse" />
          AI Quantum Parser Active
        </div>
      </div>

      {/* Terminal Screen Logs */}
      <div className="p-4 h-80 overflow-y-auto font-mono text-xs md:text-sm space-y-2 select-text custom-scrollbar bg-black/45">
        {history.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === "input"
                ? "text-indigo-300"
                : line.type === "error"
                ? "text-red-400 font-semibold"
                : line.type === "success"
                ? "text-indigo-400"
                : line.type === "info"
                ? "text-indigo-400 font-semibold"
                : line.type === "ascii"
                ? "text-yellow-400/90 leading-tight text-xs"
                : "text-slate-300"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Quick Suggestions Buttons */}
      <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex flex-wrap gap-1.5 items-center backdrop-blur-md">
        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold mr-1">Quick Scans:</span>
        {COMMAND_SUGGESTIONS.map((s) => (
          <button
            key={s.cmd}
            onClick={() => handleCommand(s.cmd)}
            id={`btn-terminal-${s.cmd}`}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 hover:text-indigo-400 text-[11px] font-mono text-slate-300 rounded border border-white/10 hover:border-white/20 transition duration-150 ease-in-out cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Command Prompt Input */}
      <div className="flex items-center px-4 py-3 bg-black/45 border-t border-white/10">
        <ChevronRight className="w-4 h-4 text-indigo-400 animate-pulse mr-1" />
        <span className="font-mono text-xs md:text-sm text-slate-500 mr-2 select-none">muhil-os:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          id="terminal-input-field"
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-white placeholder-slate-600 focus:ring-0 focus:border-none p-0"
          placeholder="Type a command (e.g. help, whoami, skills)..."
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={() => handleCommand(input)}
          id="btn-terminal-submit"
          className="ml-2 p-1 text-slate-500 hover:text-indigo-400 transition"
          title="Execute Command"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
