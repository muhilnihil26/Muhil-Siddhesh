/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  Lock, 
  Layers, 
  Activity, 
  Award, 
  BookOpen, 
  Plus, 
  Trash, 
  PlusCircle, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Briefcase,
  MapPin,
  Laptop,
  Upload,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../context/PortfolioContext";
import { PersonalInfo, Project, SkillCategory, Achievement, TimelineEvent } from "../types";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function AdminPanel() {
  const { 
    personalInfo, 
    skills, 
    projects, 
    achievements, 
    timelineEvents,
    updatePersonalInfo, 
    updateSkills, 
    updateProjects, 
    updateAchievements, 
    updateTimelineEvents,
    resetAll 
  } = usePortfolio();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("muhil_admin_authenticated") === "true";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Synchronize Google Auth session state
  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user && user.email === "muhilsiddhesh.in@gmail.com" && user.emailVerified) {
        setIsAuthenticated(true);
        localStorage.setItem("muhil_admin_authenticated", "true");
      }
    });
    return () => unsub();
  }, []);

  // Active Admin tab
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "skills" | "timeline" | "achievements" | "messages">("profile");
  
  // Notification alert state
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Messages State
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  React.useEffect(() => {
    if (activeTab === "messages" && isAuthenticated) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
          const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
          const { db } = await import("../firebase");
          const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(msgs);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          triggerAlert("error", "Failed to load messages from secure telemetry.");
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [activeTab, isAuthenticated]);

  const handleDeleteMessage = async (id: string) => {
    if (confirm("Permanently delete this transmission?")) {
      try {
        const { doc, deleteDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(m => m.id !== id));
        triggerAlert("success", "Transmission expunged.");
      } catch (error) {
        console.error(error);
        triggerAlert("error", "Failed to delete message.");
      }
    }
  };

  // Handle Authentication submit (credentials)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    setTimeout(() => {
      // Prompt specification credentials check
      if (email === "muhilsiddhesh.in@gmail.com" && password === "muhil@2011") {
        setIsAuthenticated(true);
        localStorage.setItem("muhil_admin_authenticated", "true");
        triggerAlert("success", "Access granted. Synchronizing systems...");
      } else {
        setAuthError("Invalid core clearance credentials.");
        triggerAlert("error", "Access denied. Verification failed.");
      }
      setAuthLoading(false);
    }, 800);
  };

  // Handle Google Auth Login
  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user && user.email === "muhilsiddhesh.in@gmail.com") {
        setIsAuthenticated(true);
        localStorage.setItem("muhil_admin_authenticated", "true");
        triggerAlert("success", "Access granted. Synchronizing systems...");
      } else {
        await signOut(auth);
        setAuthError("Access denied. Only the portfolio administrator can access this panel.");
        triggerAlert("error", "Access denied. Verification failed.");
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setAuthError(err.message || "Failed to authenticate via Google.");
      triggerAlert("error", "Access denied. Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("muhil_admin_authenticated");
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase Signout Error:", err);
    }
    triggerAlert("success", "Clearance revoked. Terminal locked.");
  };

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Editable Profile States
  const [profileForm, setProfileForm] = useState<PersonalInfo>({ ...personalInfo });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      triggerAlert("error", "Invalid file type. Please select an image.");
      return;
    }
    
    // We will resize and compress the image to ensure it fits in Firestore easily
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Max dimension 800px
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          
          setProfileForm(prev => ({
            ...prev,
            avatarUrl: compressedBase64
          }));
          triggerAlert("success", "Avatar image compressed and updated.");
        };
        img.src = event.target.result as string;
      }
    };
    reader.onerror = () => {
      triggerAlert("error", "Error reading image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo(profileForm);
    triggerAlert("success", "Core profile metadata updated and synced.");
  };

  // Editable Projects States
  const [editedProjects, setEditedProjects] = useState<Project[]>([...projects]);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    id: "",
    title: "",
    description: "",
    detailedDescription: "",
    category: "Software",
    features: [],
    techStack: [],
    githubUrl: "",
    launchUrl: ""
  });
  const [newFeatureText, setNewFeatureText] = useState("");
  const [newTechText, setNewTechText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateProjectWithAI = async () => {
    if (!newProject.launchUrl) {
      triggerAlert("error", "Please provide a valid web demo URL first.");
      return;
    }
    setAiLoading(true);
    triggerAlert("success", "Scanning target URL using Gemini 2.5 Flash...");
    try {
      const response = await fetch("/api/gemini/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webLink: newProject.launchUrl }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to scan and analyze the provided URL.");
      }

      const data = await response.json();
      if (data && data.title) {
        setNewProject(prev => ({
          ...prev,
          title: data.title,
          description: data.description,
          detailedDescription: data.detailedDescription,
          category: data.category || "Software",
          features: data.features || [],
          techStack: data.techStack || []
        }));
        
        if (data.techStack && data.techStack.length > 0) {
          setNewTechText(data.techStack.join(", "));
        }
        
        triggerAlert("success", "✨ Gemini AI successfully analyzed URL and generated project blueprint!");
      } else {
        throw new Error("Invalid response schema received from Gemini AI.");
      }
    } catch (err: any) {
      console.error("AI Auto-fill Error:", err);
      triggerAlert("error", err.message || "Failed to orchestrate Gemini AI generation.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleProjectFieldChange = (index: number, field: keyof Project, value: any) => {
    const updated = [...editedProjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditedProjects(updated);
  };

  const handleSaveProjects = () => {
    updateProjects(editedProjects);
    triggerAlert("success", "Projects repository synchronized with system.");
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      triggerAlert("error", "Title and basic description are required.");
      return;
    }
    const finalId = newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const proj: Project = {
      id: finalId,
      title: newProject.title,
      description: newProject.description,
      detailedDescription: newProject.detailedDescription || "",
      category: newProject.category || "Software",
      features: newProject.features || [],
      techStack: newProject.techStack || ["React", "TypeScript"],
      githubUrl: newProject.githubUrl || "https://github.com",
      launchUrl: newProject.launchUrl || ""
    };
    const updated = [...editedProjects, proj];
    setEditedProjects(updated);
    updateProjects(updated);
    // Reset form
    setNewProject({
      id: "",
      title: "",
      description: "",
      detailedDescription: "",
      category: "Software",
      features: [],
      techStack: [],
      githubUrl: "",
      launchUrl: ""
    });
    triggerAlert("success", "New architectural blueprint injected.");
  };

  const handleDeleteProject = (index: number) => {
    if (confirm("Are you sure you want to scrub this project from the database?")) {
      const updated = editedProjects.filter((_, idx) => idx !== index);
      setEditedProjects(updated);
      updateProjects(updated);
      triggerAlert("success", "Project blueprint removed.");
    }
  };

  // Editable Skills States
  const [editedSkills, setEditedSkills] = useState<SkillCategory[]>([...skills]);

  const handleSkillLevelChange = (catIdx: number, skillIdx: number, val: number) => {
    const updated = [...editedSkills];
    updated[catIdx].skills[skillIdx].level = val;
    setEditedSkills(updated);
  };

  const handleSkillDetailsChange = (catIdx: number, skillIdx: number, field: "name" | "details", val: string) => {
    const updated = [...editedSkills];
    updated[catIdx].skills[skillIdx][field] = val;
    setEditedSkills(updated);
  };

  const handleSaveSkills = () => {
    updateSkills(editedSkills);
    triggerAlert("success", "Cognitive Spectrum skills updated.");
  };

  // Editable Journey States
  const [editedTimeline, setEditedTimeline] = useState<TimelineEvent[]>([...timelineEvents]);
  const [newTimelineEvent, setNewTimelineEvent] = useState<Partial<TimelineEvent>>({
    id: "",
    year: "2026",
    title: "",
    subtitle: "",
    description: "",
    category: "ai",
    icon: "Sparkles",
    skills: [],
    metrics: []
  });
  const [newTimelineSkill, setNewTimelineSkill] = useState("");
  const [newTimelineMetricLabel, setNewTimelineMetricLabel] = useState("");
  const [newTimelineMetricValue, setNewTimelineMetricValue] = useState("");

  const handleTimelineFieldChange = (index: number, field: keyof TimelineEvent, value: any) => {
    const updated = [...editedTimeline];
    updated[index] = { ...updated[index], [field]: value };
    setEditedTimeline(updated);
  };

  const handleSaveTimeline = () => {
    updateTimelineEvents(editedTimeline);
    triggerAlert("success", "Chronological roadmap events updated.");
  };

  const handleAddTimelineEvent = () => {
    if (!newTimelineEvent.title || !newTimelineEvent.year) {
      triggerAlert("error", "Year and Title are mandatory.");
      return;
    }
    const event: TimelineEvent = {
      id: "node-" + Date.now(),
      year: newTimelineEvent.year,
      title: newTimelineEvent.title,
      subtitle: newTimelineEvent.subtitle || "",
      description: newTimelineEvent.description || "",
      category: newTimelineEvent.category || "ai",
      icon: newTimelineEvent.icon || "Sparkles",
      skills: newTimelineEvent.skills || [],
      metrics: newTimelineEvent.metrics || []
    };
    const updated = [...editedTimeline, event];
    setEditedTimeline(updated);
    updateTimelineEvents(updated);
    // Reset
    setNewTimelineEvent({
      id: "",
      year: "2026",
      title: "",
      subtitle: "",
      description: "",
      category: "ai",
      icon: "Sparkles",
      skills: [],
      metrics: []
    });
    triggerAlert("success", "New timeline event added.");
  };

  const handleDeleteTimelineEvent = (index: number) => {
    if (confirm("Remove this roadmap milestone?")) {
      const updated = editedTimeline.filter((_, idx) => idx !== index);
      setEditedTimeline(updated);
      updateTimelineEvents(updated);
      triggerAlert("success", "Milestone removed.");
    }
  };

  // Editable Achievements States
  const [editedAchievements, setEditedAchievements] = useState<Achievement[]>([...achievements]);
  const [newAch, setNewAch] = useState<Achievement>({
    title: "",
    description: "",
    category: "coding"
  });

  const handleAchFieldChange = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...editedAchievements];
    updated[index] = { ...updated[index], [field]: value };
    setEditedAchievements(updated);
  };

  const handleSaveAchievements = () => {
    updateAchievements(editedAchievements);
    triggerAlert("success", "Aura Distinctions synchronized.");
  };

  const handleAddAchievement = () => {
    if (!newAch.title || !newAch.description) {
      triggerAlert("error", "Title and description are required.");
      return;
    }
    const updated = [...editedAchievements, { ...newAch }];
    setEditedAchievements(updated);
    updateAchievements(updated);
    setNewAch({ title: "", description: "", category: "coding" });
    triggerAlert("success", "Distinction registered.");
  };

  const handleDeleteAchievement = (index: number) => {
    if (confirm("Scrub this distinction?")) {
      const updated = editedAchievements.filter((_, idx) => idx !== index);
      setEditedAchievements(updated);
      updateAchievements(updated);
      triggerAlert("success", "Distinction removed.");
    }
  };

  const handleResetSystem = () => {
    if (confirm("WARNING: This will completely scrub your local overrides and restore Muhil's factory-default details. Proceed?")) {
      resetAll();
      window.location.reload();
    }
  };

  // Redirect back to main portfolio view (SPA Routing helper)
  const navigateBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Absolute Grid Backdrops */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating alert notification portal */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full border shadow-2xl backdrop-blur-xl ${
              alert.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/80 border-rose-500/40 text-rose-300"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span className="text-xs font-mono font-bold uppercase tracking-wider">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= STATE A: LOGIN FORM ======================= */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#030712]/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative"
          >
            {/* Corner Decorators */}
            <span className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 font-bold">SECURE_VERIFICATION</span>

            <div className="text-center mb-6 mt-2">
              <div className="inline-flex p-3.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full text-blue-400 mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-sans font-black uppercase text-white tracking-wider">Clearance Required</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter core administrator keys to synchronize Muhil's portfolio.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Secure ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white outline-none placeholder-slate-600 transition"
                    placeholder="e.g. muhilsiddhesh.in@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Access Token (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-white outline-none placeholder-slate-600 transition"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-800/30 rounded-xl p-3 text-xs font-mono text-rose-400 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:bg-white/5 disabled:text-slate-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 mt-6"
              >
                {authLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Clearing Entry...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Verify Identity
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4 flex py-1 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-500 font-bold tracking-widest">SECURE_OAUTH_LINK</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>

            <button
              onClick={navigateBack}
              className="w-full text-center text-[11px] font-mono text-slate-500 hover:text-white transition mt-4 block"
            >
              ← Terminate and Return to Portfolio
            </button>
          </motion.div>
        </div>
      ) : (
        
        // ======================= STATE B: AUTHENTICATED SYSTEM DASHBOARD =======================
        <div className="flex-1 flex flex-col">
          
          {/* Top Panel HUD Header */}
          <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-blue-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-sans font-black uppercase text-white tracking-widest">MUHIL_OS CORE CONSOLE</h1>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">ADMIN_ACTIVE</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">ADMIN EMAIL: {profileForm.email} | CONTROL PARADIGMS</p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleResetSystem}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-900/30 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                title="Wipe overrides and restore defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Factory Reset
              </button>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-xl text-xs font-mono transition cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={navigateBack}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wide rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Exit Console
              </button>
            </div>
          </header>

          {/* Main Dashboard Workspace (Side list + edit form, highly responsive) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            
            {/* Sidebar Navigation: 3 columns on desktop, flat pills on mobile */}
            <aside className="lg:col-span-3 p-4 md:p-6 space-y-4 bg-black/20 lg:sticky lg:top-[73px]">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold hidden lg:block mb-2 px-2">CONSOLE DIRECTORY</div>
              
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "profile"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Core Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "projects"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Projects Blueprints</span>
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "skills"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Cognitive Spectrum</span>
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "timeline"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Journey Roadmaps</span>
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "achievements"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Distinctions</span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-3 ${
                    activeTab === "messages"
                      ? "bg-white/10 border-blue-500/50 text-blue-400 font-bold"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Messages</span>
                </button>
              </nav>

              <div className="hidden lg:block bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-[10px] font-mono text-slate-500 space-y-1.5 leading-normal">
                <div className="font-bold text-slate-400">PERSISTENCE PROTOCOL:</div>
                <p>All changes actively update the local context state and are pushed to `localStorage`. Refresh is not required.</p>
              </div>
            </aside>

            {/* Editing Panel: 9 columns on desktop */}
            <main className="lg:col-span-9 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)]">
              
              {/* ===================== TAB 1: CORE PROFILE DETAILS ===================== */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Core Profile Credentials
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Set critical metadata, contacts, social tags, avatar links, and educational focus.
                    </p>
                  </div>

                  <form onSubmit={handleProfileSave} className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5">
                    
                    {/* Primary Grid: Identity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">First Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          required
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Secondary Grid: Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          Clearance Email Address
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-400" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={profileForm.phone || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    {/* Image URL & Avatar */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Avatar Photo Link & File Upload</label>
                      <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center">
                        {/* Interactive Avatar Preview and Hover Uploader */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-lg bg-black/40">
                            <img 
                              src={profileForm.avatarUrl} 
                              alt="Avatar Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120";
                              }}
                            />
                            {/* Hover Overlay for direct click-to-upload */}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-blue-600/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white cursor-pointer"
                              title="Click to Upload"
                            >
                              <Upload className="w-5 h-5 mb-0.5 animate-bounce" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                            </button>
                          </div>
                          {profileForm.avatarUrl !== "/src/assets/images/muhil_avatar_1782394981906.jpg" && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfileForm(prev => ({
                                  ...prev,
                                  avatarUrl: "/src/assets/images/muhil_avatar_1782394981906.jpg"
                                }));
                                triggerAlert("success", "Reverted to system default avatar.");
                              }}
                              className="text-[9px] font-mono text-slate-400 hover:text-red-400 underline transition-colors cursor-pointer"
                            >
                              Reset to Default
                            </button>
                          )}
                        </div>

                        {/* Drag and Drop Zone Container */}
                        <div className="flex-1 min-h-[110px] flex flex-col justify-center">
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-center ${
                              isDragging 
                                ? "border-blue-500 bg-blue-500/10 scale-[0.99] shadow-inner shadow-blue-500/20" 
                                : "border-white/10 hover:border-blue-500/50 bg-black/30 hover:bg-black/55"
                            }`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            
                            <Upload className={`w-6 h-6 mb-2 transition-transform duration-200 ${isDragging ? "text-blue-400 scale-125" : "text-slate-400"}`} />
                            
                            <p className="text-xs font-medium text-slate-200">
                              {isDragging ? (
                                <span className="text-blue-400 font-bold">Drop your image here!</span>
                              ) : (
                                <>
                                  <span className="text-blue-400 font-bold">Click to upload</span> or drag and drop
                                </>
                              )}
                            </p>
                            <p className="text-[10px] font-mono text-slate-500 mt-1">
                              Supports PNG, JPG, WEBP, GIF (Max 2MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Manual/Text Input Fallback */}
                      <div className="mt-2 bg-white/5 border border-white/5 rounded-xl p-3 space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold block">Or specify image link manually</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profileForm.avatarUrl}
                            onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                            className="flex-1 bg-black/40 border border-white/10 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
                            placeholder="Relative folder path or absolute image URL"
                          />
                        </div>
                        <p className="text-[9px] font-mono text-slate-500">
                          Supports local asset folders (e.g. `/src/assets/...`) or any external Unsplash or custom link.
                        </p>
                      </div>
                    </div>

                    {/* Headlines & Roles */}
                    <div className="space-y-4 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Tagline</label>
                          <input
                            type="text"
                            value={profileForm.tagline}
                            onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Location</label>
                          <input
                            type="text"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Developer Roles (Headline)</label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Biographical narrative (About Me)</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Academic Focus Details */}
                    <div className="space-y-4 border-t border-white/5 pt-4">
                      <h4 className="text-xs font-mono text-blue-400 uppercase tracking-wider font-bold">Academic Core:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Active Institution</label>
                          <input
                            type="text"
                            value={profileForm.education.school}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              education: { ...profileForm.education, school: e.target.value }
                            })}
                            className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Grade / Class Level</label>
                          <input
                            type="text"
                            value={profileForm.education.grade}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              education: { ...profileForm.education, grade: e.target.value }
                            })}
                            className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trigger Submit Action */}
                    <div className="border-t border-white/5 pt-5 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-500/10"
                      >
                        <Save className="w-4 h-4" />
                        Save Profile Changes
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* ===================== TAB 2: PROJECTS MANAGEMENT ===================== */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        Portfolio Project Blueprints
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Register, restructure, or remove high-fidelity project cards shown in the creative vault.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveProjects}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg shadow-blue-500/10 hover:from-blue-400 flex items-center gap-1.5 transition self-start cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Commit Order Updates
                    </button>
                  </div>

                  {/* Add New Project Card */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4">
                    <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Incorporate New Blueprint Concept
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Project Name</label>
                        <input
                          type="text"
                          value={newProject.title || ""}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="e.g. Sonexa Terminal"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Domain Category</label>
                        <select
                          value={newProject.category || "Software"}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                        >
                          <option value="Software">Software</option>
                          <option value="AI">AI</option>
                          <option value="Game">Game</option>
                          <option value="Creative">Creative</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">General Description Snippet</label>
                      <input
                        type="text"
                        value={newProject.description || ""}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                        placeholder="Brief overview tagline..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">In-Depth Architecture Description</label>
                      <textarea
                        value={newProject.detailedDescription || ""}
                        onChange={(e) => setNewProject({ ...newProject, detailedDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none resize-none"
                        placeholder="Long form specification breakdowns..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tech Stack Entry */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Tech Stack Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={newTechText}
                          onChange={(e) => setNewTechText(e.target.value)}
                          onBlur={() => {
                            if (newTechText.trim()) {
                              const tags = newTechText.split(",").map(t => t.trim()).filter(Boolean);
                              setNewProject({ ...newProject, techStack: tags });
                            }
                          }}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="React, Tailwind, Express..."
                        />
                      </div>
                      {/* Github Link */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">GitHub Repository Link</label>
                        <input
                          type="text"
                          value={newProject.githubUrl || ""}
                          onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Live Web Demo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProject.launchUrl || ""}
                          onChange={(e) => setNewProject({ ...newProject, launchUrl: e.target.value })}
                          className="flex-1 bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="https://my-app.vercel.app"
                        />
                        <button
                          type="button"
                          onClick={handleGenerateProjectWithAI}
                          disabled={aiLoading || !newProject.launchUrl}
                          className="px-4 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 disabled:from-slate-850 disabled:to-slate-900 disabled:text-slate-500 text-white font-mono font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 hover:opacity-90 transition shadow-lg shadow-indigo-500/10 shrink-0 cursor-pointer"
                        >
                          {aiLoading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Scanning URL...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                              AI Auto-Fill Project
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddProject}
                      type="button"
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 text-white font-mono font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                    >
                      + Inject Project to List
                    </button>
                  </div>

                  {/* Editable Existing Project Cards */}
                  <div className="space-y-4">
                    {editedProjects.map((proj, idx) => (
                      <div key={proj.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 md:p-5 space-y-4 relative">
                        
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteProject(idx)}
                            className="p-1.5 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 border border-rose-900/20 rounded-lg transition cursor-pointer"
                            title="Scrub project from record"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="text-blue-400 bg-white/5 px-2 py-0.5 border border-white/10 rounded font-bold">PROJECT #{idx + 1}</span>
                          <span className="text-slate-500 uppercase">SYS_REF: {proj.id}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-8 space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Project Heading</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleProjectFieldChange(idx, "title", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-sans text-white font-bold outline-none"
                            />
                          </div>
                          <div className="sm:col-span-4 space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Category Scope</label>
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) => handleProjectFieldChange(idx, "category", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Tagline Description</label>
                          <input
                            type="text"
                            value={proj.description}
                            onChange={(e) => handleProjectFieldChange(idx, "description", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Extended Narrative Details</label>
                          <textarea
                            value={proj.detailedDescription || ""}
                            onChange={(e) => handleProjectFieldChange(idx, "detailedDescription", e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none resize-none"
                          />
                        </div>

                        {/* Tag details & Launch link */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Tech Stack Tags (Comma separated)</label>
                            <input
                              type="text"
                              value={proj.techStack.join(", ")}
                              onChange={(e) => {
                                const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                handleProjectFieldChange(idx, "techStack", tags);
                              }}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-blue-300 outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">GitHub link</label>
                            <input
                              type="text"
                              value={proj.githubUrl || ""}
                              onChange={(e) => handleProjectFieldChange(idx, "githubUrl", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-400 outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Live Demo / Web Link</label>
                            <input
                              type="text"
                              value={proj.launchUrl || ""}
                              onChange={(e) => handleProjectFieldChange(idx, "launchUrl", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-400 outline-none"
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ===================== TAB 3: SKILLS COGNITIVE EDITOR ===================== */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-400" />
                        Skills & Mastery Configurations
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Calibrate percentages and technical descriptions across categories inside the Cognitive Spectrum.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveSkills}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg shadow-blue-500/10 hover:from-blue-400 flex items-center gap-1.5 transition self-start cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Spectrum Changes
                    </button>
                  </div>

                  {/* Render Categories Accordion */}
                  <div className="space-y-6">
                    {editedSkills.map((cat, catIdx) => (
                      <div key={cat.title} className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4">
                        
                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                          <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                            <Activity className="w-4 h-4" />
                          </span>
                          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{cat.title}</h3>
                        </div>

                        {/* Skill nodes inside this category */}
                        <div className="space-y-4 pt-1">
                          {cat.skills.map((skill, skillIdx) => (
                            <div key={skill.name} className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-3">
                              
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                
                                <div className="sm:col-span-8 flex flex-col sm:flex-row sm:items-center gap-2.5">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleSkillDetailsChange(catIdx, skillIdx, "name", e.target.value)}
                                    className="bg-transparent border-b border-transparent focus:border-blue-500 px-1 py-0.5 text-xs font-sans font-bold text-white outline-none"
                                  />
                                </div>

                                <div className="sm:col-span-4 flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={skill.level}
                                    onChange={(e) => handleSkillLevelChange(catIdx, skillIdx, parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                  />
                                  <span className="font-mono text-xs text-blue-400 font-bold shrink-0 w-8 text-right">{skill.level}%</span>
                                </div>

                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Details:</span>
                                <input
                                  type="text"
                                  value={skill.details}
                                  onChange={(e) => handleSkillDetailsChange(catIdx, skillIdx, "details", e.target.value)}
                                  className="w-full bg-black/40 border border-white/15 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-300 outline-none"
                                />
                              </div>

                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ===================== TAB 4: CHRONOLOGICAL TIMELINE EDITOR ===================== */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Milestones & Future Roadmaps
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Edit and add nodes displaying Muhil's historical educational milestones and future entrepreneurship goals.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveTimeline}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg shadow-blue-500/10 hover:from-blue-400 flex items-center gap-1.5 transition self-start cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Commit Roadmap Updates
                    </button>
                  </div>

                  {/* Add New Milestone Node */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4">
                    <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Log New Timeline Anchor point
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Year</label>
                        <input
                          type="text"
                          value={newTimelineEvent.year || ""}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, year: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="e.g. 2026"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Main Title</label>
                        <input
                          type="text"
                          value={newTimelineEvent.title || ""}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, title: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-sans text-white outline-none"
                          placeholder="e.g. Smart Railway Simulation"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Orbit Category</label>
                        <select
                          value={newTimelineEvent.category || "ai"}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, category: e.target.value as any })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                        >
                          <option value="early">Early Sparks (2022)</option>
                          <option value="development">Interactive Dev (2023)</option>
                          <option value="ai">AI / Current Era (2024-2025)</option>
                          <option value="future">Future Frontier (2026+)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Subtitle Context</label>
                        <input
                          type="text"
                          value={newTimelineEvent.subtitle || ""}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, subtitle: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="e.g. Class 9 Breakthroughs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Display Icon Reference</label>
                        <select
                          value={newTimelineEvent.icon || "Sparkles"}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, icon: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                        >
                          <option value="Lightbulb">Lightbulb</option>
                          <option value="Gamepad2">Gamepad2</option>
                          <option value="BrainCircuit">BrainCircuit</option>
                          <option value="Code">Code</option>
                          <option value="Rocket">Rocket</option>
                          <option value="Terminal">Terminal</option>
                          <option value="Sparkles">Sparkles</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Milestone Narrative / Narrative Description</label>
                      <textarea
                        value={newTimelineEvent.description || ""}
                        onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, description: e.target.value })}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-sans text-white outline-none resize-none"
                        placeholder="Detail the experience, logs, or milestones of this phase..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Skill Badges (Comma-separated list)</label>
                        <input
                          type="text"
                          value={newTimelineSkill}
                          onChange={(e) => setNewTimelineSkill(e.target.value)}
                          onBlur={() => {
                            if (newTimelineSkill.trim()) {
                              const list = newTimelineSkill.split(",").map(s => s.trim()).filter(Boolean);
                              setNewTimelineEvent({ ...newTimelineEvent, skills: list });
                            }
                          }}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                          placeholder="e.g. TypeScript, Firestore, QR Engines"
                        />
                      </div>
                      
                      {/* Interactive Metrics mapping */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Quick Metric: Label + Value (e.g. Trigger | Event)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Active Deployments"
                            value={newTimelineMetricLabel}
                            onChange={(e) => setNewTimelineMetricLabel(e.target.value)}
                            className="w-1/2 bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-2.5 py-1 text-xs font-mono text-white outline-none"
                          />
                          <input
                            type="text"
                            placeholder="e.g. 5 Systems"
                            value={newTimelineMetricValue}
                            onChange={(e) => setNewTimelineMetricValue(e.target.value)}
                            onBlur={() => {
                              if (newTimelineMetricLabel && newTimelineMetricValue) {
                                setNewTimelineEvent({
                                  ...newTimelineEvent,
                                  metrics: [{ label: newTimelineMetricLabel, value: newTimelineMetricValue }]
                                });
                              }
                            }}
                            className="w-1/2 bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-2.5 py-1 text-xs font-mono text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddTimelineEvent}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 text-white font-mono font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                    >
                      + Inject Node into Timeline
                    </button>
                  </div>

                  {/* List and editable timeline items */}
                  <div className="space-y-4">
                    {editedTimeline.map((node, idx) => (
                      <div key={node.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 md:p-5 space-y-4 relative">
                        
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteTimelineEvent(idx)}
                            className="p-1.5 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 border border-rose-900/20 rounded-lg transition cursor-pointer"
                            title="Remove timeline event"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="text-blue-400 bg-white/5 px-2 py-0.5 border border-white/10 rounded font-bold">{node.year}</span>
                          <span className="text-slate-500 uppercase">ANCHOR: {node.id}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Year</label>
                            <input
                              type="text"
                              value={node.year}
                              onChange={(e) => handleTimelineFieldChange(idx, "year", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-3">
                            <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Main Heading</label>
                            <input
                              type="text"
                              value={node.title}
                              onChange={(e) => handleTimelineFieldChange(idx, "title", e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-sans text-white font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Subtitle Level</label>
                          <input
                            type="text"
                            value={node.subtitle}
                            onChange={(e) => handleTimelineFieldChange(idx, "subtitle", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Description Narrative</label>
                          <textarea
                            value={node.description}
                            onChange={(e) => handleTimelineFieldChange(idx, "description", e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none resize-none"
                          />
                        </div>

                        {/* Interactive Skills in list */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Skill Badges (Comma-separated override)</label>
                          <input
                            type="text"
                            value={node.skills?.join(", ") || ""}
                            onChange={(e) => {
                              const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                              handleTimelineFieldChange(idx, "skills", list);
                            }}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-blue-300 outline-none"
                          />
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ===================== TAB 5: ACHIEVEMENTS EDITOR ===================== */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        Achievements & Distinction Cards
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Configure the special honors and custom credit awards displayed under Distinctions.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveAchievements}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg shadow-blue-500/10 hover:from-blue-400 flex items-center gap-1.5 transition self-start cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Commit Distinctions
                    </button>
                  </div>

                  {/* Add New Distinction Form */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4">
                    <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Register New Distinction Blueprint
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Achievement Heading</label>
                        <input
                          type="text"
                          value={newAch.title}
                          onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-sans text-white outline-none"
                          placeholder="e.g. Certified Full Stack Innovator"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Category Vibe</label>
                        <select
                          value={newAch.category}
                          onChange={(e) => setNewAch({ ...newAch, category: e.target.value as any })}
                          className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none"
                        >
                          <option value="coding">Coding & Systems</option>
                          <option value="academic">Academic Honor</option>
                          <option value="creativity">Creativity & Innovation</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Explanatory Narrative</label>
                      <input
                        type="text"
                        value={newAch.description}
                        onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs font-sans text-white outline-none"
                        placeholder="Detail the metrics, scope, or impact of this award..."
                      />
                    </div>

                    <button
                      onClick={handleAddAchievement}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 text-white font-mono font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                    >
                      + Inject Award into Spectrum
                    </button>
                  </div>

                  {/* List of existing achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedAchievements.map((ach, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3.5 relative">
                        
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteAchievement(idx)}
                            className="p-1.5 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 border border-rose-900/20 rounded-lg transition cursor-pointer"
                            title="Remove distinction"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[9px]">
                          <span className="text-blue-400 bg-white/5 px-2 py-0.5 border border-white/10 rounded font-bold uppercase">{ach.category}</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Award Heading</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => handleAchFieldChange(idx, "title", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-sans text-white font-bold outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Narrative Context</label>
                          <input
                            type="text"
                            value={ach.description}
                            onChange={(e) => handleAchFieldChange(idx, "description", e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                          />
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {activeTab === "messages" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      Secure Transmissions
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Review incoming telemetry and messages submitted by external entities.
                    </p>
                  </div>

                  {loadingMessages ? (
                    <div className="text-center py-10 font-mono text-xs text-slate-500">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      Decrypting messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 font-mono text-xs text-slate-500 bg-white/5 border border-white/10 rounded-3xl">
                      No transmissions detected in the buffer.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 relative">
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute top-4 right-4 p-1.5 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 border border-rose-900/20 rounded-lg transition cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
                              {msg.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-200">{msg.name}</div>
                              <div className="text-[10px] font-mono text-blue-400">{msg.email}</div>
                            </div>
                          </div>
                          
                          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mb-3">
                            {msg.message}
                          </p>
                          
                          <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* Futuristic status footer decor */}
      <footer className="bg-black/40 border-t border-white/5 py-3 px-4 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0 select-none pointer-events-none">
        <span>SECURITY_LEVEL: ALPHA_COMMITTED</span>
        <span>MUHIL_OS © 2026</span>
        <span>ALL_SYSTEMS_FUNCTIONAL</span>
      </footer>

    </div>
  );
}
