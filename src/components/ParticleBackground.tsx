/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

export default function ParticleBackground({ activeCategory = "All" }: { activeCategory?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates
    const mouse = { x: -1000, y: -1000, active: false, intensity: 0 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseColor: string;
    }

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    const getColorForCategory = (category: string) => {
      switch (category.toLowerCase()) {
        case "enterprise": return "147, 51, 234"; // Purple
        case "ai tools": return "236, 72, 153"; // Pink
        case "automation": return "59, 130, 246"; // Blue
        case "future": return "16, 185, 129"; // Green
        default: return "99, 102, 241"; // Indigo
      }
    };

    const currentColor = getColorForCategory(activeCategory);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        baseColor: currentColor,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.intensity = Math.min(mouse.intensity + 0.1, 1);
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
      mouse.intensity = 0;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (!mouse.active && mouse.intensity > 0) {
        mouse.intensity -= 0.05;
      }

      // Particle update and rendering
      particles.forEach((p, idx) => {
        // Smoothly transition color
        // For simplicity, just assign currentColor in real time here
        
        // Base Antigravity drift (slowly floating up)
        p.y -= 0.15;
        
        p.x += p.vx;
        p.y += p.vy;

        // Mouse repelling (antigravity field around cursor)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distToMouse = Math.hypot(dx, dy);
          
          if (distToMouse < 200) {
            const force = (200 - distToMouse) / 200;
            p.vx += (dx / distToMouse) * force * 0.1;
            p.vy += (dy / distToMouse) * force * 0.1;
          }
        }
        
        // Dampen velocity slightly to avoid infinite acceleration
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Bounce/Wrap on boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        let alphaMultiplier = 1;
        if (distToMouse < 250) {
            alphaMultiplier = 1 + (1 - distToMouse / 250) * 1.5 * mouse.intensity;
        }

        ctx.fillStyle = `rgba(${currentColor}, ${p.alpha * alphaMultiplier})`; 
        ctx.fill();

        // Connect particles with lines if close
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.15 * alphaMultiplier;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${currentColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.active) {
          if (distToMouse < 250) {
            const lineAlpha = (1 - distToMouse / 250) * 0.4 * mouse.intensity;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${currentColor}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeCategory]);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed inset-0 pointer-events-none z-0 bg-transparent transition-opacity duration-1000"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
