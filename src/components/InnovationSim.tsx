/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Users, 
  ShieldCheck, 
  Train, 
  PlusCircle, 
  TrendingUp, 
  KeyRound, 
  Calendar, 
  Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

const SAMPLE_PNRS = [
  { pnr: "PNR-492-3852", passenger: "S. Raghavan", train: "Chennai Express (12602)", seat: "S4-42", status: "Verified" },
  { pnr: "PNR-883-9124", passenger: "Priyan K.", train: "Ananthapuri Exp (16823)", seat: "A1-15", status: "Verified" },
  { pnr: "PNR-221-5093", passenger: "M. Abdul", train: "Vande Bharat (20608)", seat: "C3-11", status: "Verified" },
  { pnr: "PNR-604-8113", passenger: "L. Swathi", train: "Nilgiri Express (12671)", seat: "S2-09", status: "Verified" }
];

export default function InnovationSim() {
  const [pnrInput, setPnrInput] = useState("");
  const [gateState, setGateState] = useState<"locked" | "scanning" | "granted" | "denied">("locked");
  const [activePassenger, setActivePassenger] = useState<typeof SAMPLE_PNRS[0] | null>(null);
  const [stationLogs, setStationLogs] = useState<LogEntry[]>([
    { time: "10:14:02", message: "Smart Entry System initialized.", type: "info" },
    { time: "10:14:15", message: "Automated crowd density monitors calibrating...", type: "info" },
    { time: "10:15:00", message: "Station Gate 1 & 2 standard clearance status: OK.", type: "success" }
  ]);
  const [crowdRate, setCrowdRate] = useState<"standard" | "dense" | "restricted">("standard");
  const [guestName, setGuestName] = useState("");
  const [guestPass, setGuestPass] = useState<{ name: string; pin: string; expiry: string } | null>(null);
  const [scannedCount, setScannedCount] = useState(124);

  const addLog = (message: string, type: "info" | "success" | "warning" = "info") => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setStationLogs((prev) => [{ time, message, type }, ...prev.slice(0, 15)]);
  };

  const selectRandomPnr = () => {
    const random = SAMPLE_PNRS[Math.floor(Math.random() * SAMPLE_PNRS.length)];
    setPnrInput(random.pnr);
  };

  const handleScanPnr = (overridePnr?: string) => {
    const targetPnr = overridePnr || pnrInput.trim();
    if (!targetPnr) {
      addLog("Ticketing scanning failed: Empty input field.", "warning");
      setGateState("denied");
      setTimeout(() => setGateState("locked"), 2000);
      return;
    }

    setGateState("scanning");
    addLog(`Scanning ticket credential [${targetPnr}]...`, "info");

    setTimeout(() => {
      // Find matches in sample PNRs or evaluate format
      const match = SAMPLE_PNRS.find(p => p.pnr.toLowerCase() === targetPnr.toLowerCase()) || 
                    (targetPnr.startsWith("G-") && guestPass && targetPnr === guestPass.pin ? {
                      pnr: targetPnr,
                      passenger: guestPass.name + " (Guest)",
                      train: "Platform Guest Pass",
                      seat: "N/A",
                      status: "Verified"
                    } : null);

      if (match) {
        setGateState("granted");
        setActivePassenger(match);
        setScannedCount(prev => prev + 1);
        addLog(`Access GRANTED for ${match.passenger} (Seat ${match.seat}) on ${match.train}.`, "success");
        
        // Gate auto reset after 4 seconds
        setTimeout(() => {
          setGateState("locked");
          setActivePassenger(null);
        }, 4000);
      } else {
        setGateState("denied");
        addLog(`Access DENIED: Invalid or expired ticket QR [${targetPnr}].`, "warning");
        setTimeout(() => setGateState("locked"), 3000);
      }
    }, 1500);
  };

  const handleCreateGuestPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const pin = `G-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const newPass = { name: guestName.trim(), pin, expiry };
    setGuestPass(newPass);
    addLog(`Guest clearance issued for ${newPass.name}. Code ${pin} (Expires ${expiry}).`, "success");
    setGuestName("");
  };

  useEffect(() => {
    if (crowdRate === "dense") {
      addLog("Crowd congestion alert: Adaptive gating algorithm throttled entry delay to 4s.", "warning");
    } else if (crowdRate === "restricted") {
      addLog("Emergency throttling: Restricted Platform access mode activated.", "warning");
    } else {
      addLog("Gating flow state: Standard, nominal corridor traffic.", "success");
    }
  }, [crowdRate]);

  return (
    <div id="innovation-sim" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-md">
      
      {/* Simulation Screen/Visualizer (7 columns on large, top on mobile) */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-black/45 border border-white/10 rounded-2xl p-4 relative overflow-hidden min-h-[420px]">
        
        {/* Futuristic Grid Overlay Background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300">
              Station Core Gateway Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-medium">IoT Hub Sync</span>
          </div>
        </div>

        {/* Dynamic visual representation of Gating Systems */}
        <div className="my-6 flex flex-col items-center justify-center relative z-10 py-4">
          
          {/* Laser Scanners Sweep Simulation */}
          <div className="relative w-64 h-36 border border-white/10 bg-white/5 rounded-xl flex flex-col items-center justify-center shadow-inner overflow-hidden backdrop-blur-md">
            
            {/* Active scanner sweep line */}
            {gateState === "scanning" && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] pointer-events-none z-10"
              />
            )}

            {/* Target Area Graphics */}
            <div className="absolute inset-2 border border-dashed border-slate-800 rounded-lg flex items-center justify-center">
              <QrCode className={`w-12 h-12 transition-colors duration-300 ${
                gateState === "scanning" ? "text-cyan-400" :
                gateState === "granted" ? "text-emerald-400" :
                gateState === "denied" ? "text-red-400 animate-shake" : "text-slate-700"
              }`} />
            </div>

            {/* Floating ticket info detail */}
            <AnimatePresence>
              {gateState === "granted" && activePassenger && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute inset-2 bg-emerald-950/95 rounded-lg border border-emerald-500/30 flex flex-col items-center justify-center text-center p-2 z-20"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-emerald-300">{activePassenger.passenger}</span>
                  <span className="text-[9px] font-mono text-emerald-400/80 mt-0.5">
                    {activePassenger.train} | {activePassenger.seat}
                  </span>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold mt-1.5 uppercase">
                    Authorized
                  </span>
                </motion.div>
              )}

              {gateState === "denied" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute inset-2 bg-red-950/95 rounded-lg border border-red-500/30 flex flex-col items-center justify-center text-center p-2 z-20"
                >
                  <AlertTriangle className="w-6 h-6 text-red-400 mb-1" />
                  <span className="text-xs font-bold text-red-300">Invalid QR Signature</span>
                  <span className="text-[9px] font-mono text-red-400/80 mt-0.5">Barrier Lock Active</span>
                  <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold mt-1.5 uppercase">
                    Access Denied
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Physical Gate Barrier Animation Indicator */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-500">Gating Barrier</span>
              <span className="text-xs font-mono font-semibold text-slate-300">Turnstile-01</span>
            </div>
            
            {/* Gate indicator light */}
            <div className={`w-4 h-4 rounded-full shadow-[0_0_10px] transition-colors duration-300 ${
              gateState === "granted" ? "bg-emerald-500 shadow-emerald-500/80" :
              gateState === "scanning" ? "bg-amber-400 shadow-amber-400/80" :
              gateState === "denied" ? "bg-red-500 shadow-red-500/80" : "bg-red-600 shadow-red-600/50"
            }`} />

            {/* Gating Physical Barrier arm layout */}
            <div className="relative w-32 h-6 border-b-2 border-slate-800 flex items-center">
              <motion.div
                animate={{ rotate: gateState === "granted" ? -85 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-0 bottom-0 w-28 h-2 bg-gradient-to-r from-red-600 to-amber-500 origin-left border border-slate-900"
                style={{ borderRadius: "2px" }}
              />
              <span className="ml-auto text-[9px] font-mono font-bold text-slate-600">
                {gateState === "granted" ? "OPEN" : "LOCKED"}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard statistics footer row */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 relative z-10 text-center font-mono">
          <div className="bg-white/5 p-2 rounded-lg border border-white/5 backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Today Passes</div>
            <div className="text-sm font-bold text-blue-400 mt-0.5">{scannedCount}</div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg border border-white/5 backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Congestion</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {crowdRate === "standard" ? "12%" : crowdRate === "dense" ? "78%" : "95%"}
            </div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg border border-white/5 backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Guest Mode</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">Active</div>
          </div>
        </div>
      </div>

      {/* Gating Simulation Controls Panel (5 columns on large) */}
      <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
        
        {/* Ticket Scanner control block */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            Passenger Verification Console
          </h4>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter PNR code..."
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                id="sim-pnr-input"
                className="flex-1 bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 placeholder-slate-700"
              />
              <button
                onClick={selectRandomPnr}
                id="btn-sim-random-pnr"
                className="p-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-cyan-400 rounded border border-slate-800 transition cursor-pointer"
                title="Generate Random Ticket PNR"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleScanPnr()}
              disabled={gateState === "scanning" || gateState === "granted"}
              id="btn-sim-verify"
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-mono font-bold text-xs py-2 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {gateState === "scanning" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Simulating Gating Scanner...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Scan & Verify Ticket PNR
                </>
              )}
            </button>
          </div>
        </div>

        {/* Adaptive Crowd Throttling */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Adaptive Traffic Shaper
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(["standard", "dense", "restricted"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCrowdRate(mode)}
                id={`btn-sim-mode-${mode}`}
                className={`px-1.5 py-1.5 border font-mono text-[10px] rounded font-bold uppercase transition cursor-pointer ${
                  crowdRate === mode 
                    ? "bg-indigo-950/80 border-indigo-500 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {mode === "standard" && "Standard Flow"}
                {mode === "dense" && "Rush Hour"}
                {mode === "restricted" && "Lockdown"}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Passcode Generator */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 mb-3">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Guest OTP Entry System
          </h4>
          <form onSubmit={handleCreateGuestPass} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Guest guardian name..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              id="sim-guest-name-input"
              className="flex-1 bg-slate-900 text-xs font-mono text-amber-300 border border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500 placeholder-slate-700"
            />
            <button
              type="submit"
              disabled={!guestName.trim()}
              id="btn-sim-guest-submit"
              className="px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 font-mono font-bold text-xs py-1.5 rounded transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Issue
            </button>
          </form>

          {guestPass && (
            <div className="bg-amber-950/30 border border-amber-900/40 rounded p-2.5 text-xs font-mono flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-400">{guestPass.name}</div>
                <div className="text-[10px] text-amber-500/80 mt-0.5">Expires: {guestPass.expiry}</div>
              </div>
              <button
                onClick={() => {
                  setPnrInput(guestPass.pin);
                  handleScanPnr(guestPass.pin);
                }}
                id="btn-sim-scan-guest"
                className="bg-amber-950 hover:bg-amber-900 text-amber-400 px-2 py-1 rounded text-[10px] border border-amber-800/50 transition cursor-pointer"
              >
                Scan Code: <strong className="underline">{guestPass.pin}</strong>
              </button>
            </div>
          )}
        </div>

        {/* Live Station Logs Stream */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 flex flex-col justify-between max-h-[160px] backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 mb-2 border-b border-white/10 pb-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
            Station Log Feed
          </h4>
          <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-400 custom-scrollbar pr-1">
            {stationLogs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start leading-tight">
                <span className="text-slate-600 select-none">[{log.time}]</span>
                <span className={
                  log.type === "success" ? "text-emerald-400" :
                  log.type === "warning" ? "text-amber-400" : "text-slate-300"
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
