/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Terminal, Menu, X, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playHoverSound, playClickSound } from "../utils/audio";

interface NavbarProps {
  onOpenResume: () => void;
}

export default function Navbar({ onOpenResume }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine which section is currently active
      const sections = ["hero", "about", "journey", "skills", "projects", "innovation", "education", "achievements", "contact"];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "about", label: "About" },
    { id: "journey", label: "Journey" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "innovation", label: "Innovation" },
    { id: "education", label: "Future Goal" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" }
  ];

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav
      id="navbar-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#030712]/60 backdrop-blur-xl border-white/10 py-3 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            id="nav-brand-logo"
            className="flex items-center space-x-3 text-white group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-105">
              M
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-sans font-bold tracking-tight text-white group-hover:text-blue-400 transition">
                MUHIL
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400">
                AI Developer & Innovator
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHoverSound}
                key={item.id}
                onClick={() => {
                  playClickSound();
                  handleScrollTo(item.id);
                }}
                id={`nav-link-${item.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition relative group cursor-pointer ${
                  activeSection === item.id
                    ? "text-blue-400 bg-white/5 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
                <span className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 rounded-lg -z-10 transition duration-150" />
              </motion.button>
            ))}

            {/* Resume Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                onOpenResume();
              }}
              id="nav-btn-resume"
              className="ml-4 px-5 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl hover:bg-white/10 text-xs text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/10"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Resume
            </motion.button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                onOpenResume();
              }}
              id="nav-mobile-resume"
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono flex items-center gap-1 transition text-white"
            >
              <FileText className="w-3 h-3 text-blue-400" />
              Resume
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                setIsOpen(!isOpen);
              }}
              id="nav-mobile-toggle"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#030712]/95 backdrop-blur-xl">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                id={`nav-mobile-link-${item.id}`}
                className={`block w-full px-3 py-2.5 rounded-lg text-sm font-mono tracking-wide transition ${
                  activeSection === item.id
                    ? "text-blue-400 bg-white/5 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
