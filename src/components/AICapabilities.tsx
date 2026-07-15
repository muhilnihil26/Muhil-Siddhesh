import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { playClickSound } from "../utils/audio";

export default function AICapabilities() {
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const pcmToBase64 = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const buffer = bytes.buffer;
    const dataView = new DataView(buffer);
    const float32Array = new Float32Array(len / 2);
    for (let i = 0; i < len / 2; i++) {
      float32Array[i] = dataView.getInt16(i * 2, true) / 32768;
    }

    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.copyToChannel(float32Array, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const currentTime = audioCtx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
  };

  const toggleLiveVoice = async () => {
    playClickSound();
    if (isLiveActive) {
      stopLiveVoice();
    } else {
      startLiveVoice();
    }
  };

  const startLiveVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!isMicMuted && ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio && outputAudioCtxRef.current) {
          playAudioChunk(outputAudioCtxRef.current, msg.audio);
        }
        if (msg.interrupted) {
          nextStartTimeRef.current = 0;
        }
      };

      ws.onopen = () => setIsLiveActive(true);
      ws.onclose = () => stopLiveVoice();
    } catch (err) {
      console.error("Failed to start live voice", err);
      alert("Could not access microphone.");
    }
  };

  const stopLiveVoice = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsLiveActive(false);
  };

  useEffect(() => {
    return () => stopLiveVoice();
  }, []);

  return (
    <section id="ai-capabilities" className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
      <div className="text-center mb-12">
        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-white/5 px-2.5 py-1 border border-white/10 rounded-md backdrop-blur-md">
          Generative AI Powered
        </span>
        <h2 className="text-2xl md:text-4xl font-sans font-bold text-white mt-3 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          AI Studio Playground
        </h2>
      </div>

      <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8">
        
        {/* Gemini Live Audio Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-between items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-500 flex items-center gap-1.5 pointer-events-none select-none">
            <span className={isLiveActive ? "text-indigo-400 animate-pulse" : ""}>LIVE_API_READY</span>
          </div>
          
          <div className="mb-6 mt-4">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl ${
              isLiveActive 
                ? "bg-indigo-500/20 border-indigo-400 shadow-indigo-500/20 animate-pulse" 
                : "bg-white/5 border-white/10 shadow-black/50"
            }`}>
              {isLiveActive && !isMicMuted ? (
                <Mic className={`w-10 h-10 ${isLiveActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              ) : (
                <MicOff className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-6 mb-2">Speak to Muhil's AI</h3>
            <p className="text-sm text-slate-400 font-mono">
              Experience Gemini 2.0 Live. Ask about my projects, skills, or vision for Warrior Developers.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleLiveVoice}
              className={`px-8 py-3 rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                isLiveActive 
                  ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30" 
                  : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30"
              }`}
            >
              {isLiveActive ? "End Conversation" : "Start Conversation"}
            </button>
            {isLiveActive && (
               <button
                 onClick={() => {
                   playClickSound();
                   setIsMicMuted(!isMicMuted);
                 }}
                 className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                 title={isMicMuted ? "Unmute" : "Mute"}
               >
                 {isMicMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-indigo-400" />}
               </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
