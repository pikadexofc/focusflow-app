import React from 'react';

export const InjectedStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    :root {
      --bg-dark: #030303;
      --glass-border: rgba(255, 255, 255, 0.1);
      --glass-bg: rgba(15, 15, 15, 0.45);
      --glass-highlight: rgba(255, 255, 255, 0.05);
      
      /* Premium Commercial Palette */
      --glow-blue: #00f0ff;
      --glow-violet: #6366f1;
      --glow-magenta: #ff00ff;
      --glow-lime: #ccff00;
      --glow-amber: #ffaa00;
      --glow-pink: #ec4899;
    }

    body {
      background-color: var(--bg-dark);
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Outfit', sans-serif; }
    .font-script { font-family: 'Yellowtail', cursive; }

    /* Premium 3D Glassmorphism - LITE OPTIMIZED */
    .glass-card {
      background: linear-gradient(145deg, rgba(35, 35, 35, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
      /* backdrop-filter removed for battery/GPU optimization */
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(0, 0, 0, 0.8);
      border-right: 1px solid rgba(0, 0, 0, 0.6);
      box-shadow: 
        0 20px 40px -15px rgba(0, 0, 0, 1), 
        inset 0 1px 2px rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    .glass-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at top left, rgba(255,255,255,0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .glass-recessed {
      background: rgba(0, 0, 0, 0.5);
      border-top: 1px solid rgba(0, 0, 0, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 
        inset 0 6px 15px rgba(0, 0, 0, 0.8),
        inset 0 2px 4px rgba(0, 0, 0, 0.6);
    }

    /* Glossy & Tactile Buttons */
    .btn-tactile {
      background: linear-gradient(180deg, rgba(55, 55, 55, 0.9) 0%, rgba(20, 20, 20, 1) 100%);
      /* backdrop-filter removed for battery/GPU optimization */
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(0, 0, 0, 0.9);
      box-shadow: 
        0 10px 20px -5px rgba(0, 0, 0, 0.8),
        inset 0 1px 1px rgba(255, 255, 255, 0.15);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .btn-tactile:hover:not(:disabled) {
      background: linear-gradient(180deg, rgba(60, 60, 60, 0.6) 0%, rgba(20, 20, 20, 0.9) 100%);
      box-shadow: 
        0 15px 25px -5px rgba(0, 0, 0, 0.9),
        inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    .btn-tactile:active:not(:disabled) {
      transform: translateY(1px) scale(0.98);
      background: rgba(10, 10, 10, 0.9);
      border-top-color: rgba(0, 0, 0, 0.8);
      box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.9);
    }

    .btn-primary-3d {
      background: linear-gradient(180deg, var(--theme-color, var(--glow-blue)) 0%, var(--glow-violet) 100%);
      color: #ffffff;
      border-top: 1px solid rgba(255,255,255,0.6);
      border-bottom: 2px solid rgba(0,0,0,0.4);
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.6),
        inset 0 -2px 5px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .btn-primary-3d:hover:not(:disabled) {
      background: linear-gradient(180deg, #4ade80 0%, var(--glow-lime) 100%);
      color: #000;
      border-top: 1px solid #d9f99d;
      box-shadow: 
        0 12px 24px rgba(0, 0, 0, 0.7);
      transform: translateY(-2px);
      text-shadow: none;
    }
    .btn-primary-3d:active:not(:disabled) {
      transform: translateY(2px) scale(0.98);
      border-bottom: 0px solid transparent;
      box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4);
    }

    /* Oversized Text Gradients */
    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .gradient-cyan-blue { background-image: linear-gradient(to right, var(--glow-blue), var(--glow-violet)); }
    .gradient-magenta-orange { background-image: linear-gradient(to right, var(--glow-magenta), var(--glow-amber)); }
    .gradient-lime-emerald { background-image: linear-gradient(to right, var(--glow-lime), #10b981); }

    /* Animations - Simplified for Battery/GPU */
    @keyframes float {
      /* Disabled for battery optimization */
    }
    @keyframes drift {
      /* Disabled for battery optimization */
    }
    
    @keyframes spatialReveal { 
      0% { opacity: 0; transform: translateY(15px) scale(0.97); visibility: hidden; } 
      1% { opacity: 0; visibility: visible; }
      100% { opacity: 1; transform: translateY(0) scale(1); visibility: visible; } 
    }
    @keyframes spatialHide { 
      0% { opacity: 1; transform: translateY(0) scale(1); } 
      100% { opacity: 0; transform: translateY(-15px) scale(0.97); } 
    }

    .animate-float { /* Disabled */ }
    .animate-drift { /* Disabled */ }
    
    /* animation-fill-mode:both holds the 0% keyframe (opacity:0) during the delay,
       preventing any flash before the stagger fires */
    .animate-cinematic { animation: spatialReveal 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; opacity: 0; }
    .animate-cinematic-out { animation: spatialHide 1s cubic-bezier(0.8, 0, 0.8, 0.2) forwards; }

    /* Delays */
    .delay-500 { animation-delay: 500ms; }
    .delay-1000 { animation-delay: 1000ms; }
    .delay-1500 { animation-delay: 1500ms; }
    .delay-2000 { animation-delay: 2000ms; }
    .delay-2500 { animation-delay: 2500ms; }
    .delay-3000 { animation-delay: 3000ms; }
    .delay-3500 { animation-delay: 3500ms; }
    .delay-4000 { animation-delay: 4000ms; }
    .delay-4500 { animation-delay: 4500ms; }
    .delay-5000 { animation-delay: 5000ms; }
    .delay-6000 { animation-delay: 6000ms; }
    .delay-7000 { animation-delay: 7000ms; }
    .delay-8000 { animation-delay: 8000ms; }
    .delay-9000 { animation-delay: 9000ms; }
    .delay-10000 { animation-delay: 10000ms; }
    .delay-11000 { animation-delay: 11000ms; }
    .delay-12000 { animation-delay: 12000ms; }
    .delay-13000 { animation-delay: 13000ms; }
    .delay-14000 { animation-delay: 14000ms; }
    .delay-15000 { animation-delay: 15000ms; }

    /* Utilities */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .bg-grid {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    }
  `}} />
);
