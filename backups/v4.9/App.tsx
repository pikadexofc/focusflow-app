import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Circle, Plus, Target, FileText, BarChart2, Download, Upload,
  Shield, ArrowRight, Moon, Pickaxe, Heart, Sliders, Sparkles, Zap, Layers, ChevronRight,
  User, Flame, Loader2, BarChart3, Clock, Lock, LayoutGrid, Calendar, Check, Edit2, Save, X
} from 'lucide-react';

const STORAGE_KEY = 'focusflow_v1';
const weightMap: any = { low: 1, medium: 2, high: 3 };
const getTaskWeight = (priority: string) => {
  const p = (priority || 'medium').toLowerCase();
  return weightMap[p] || 2;
};

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage save failed:", e);
  }
};

// --- ERROR BOUNDARY ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { 
    super(props); 
    this.state = { hasError: false, errorMsg: '' }; 
  }
  static getDerivedStateFromError(error: Error) { 
    return { hasError: true, errorMsg: error.message }; 
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { 
    console.error("FocusFlow Critical Error:", error, errorInfo); 
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-white text-center">
          <Shield size={48} className="text-[#FF5A00] mb-4 opacity-50" />
          <h1 className="text-2xl font-display font-bold mb-2">System Interruption</h1>
          <p className="text-[#A1A1AA] text-sm mb-6 max-w-xs font-body">An unexpected anomaly occurred in the atmospheric engine. Please reboot the environment.</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-6 py-3 bg-white/10 rounded-full text-xs font-display font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Reboot Core</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- AUDIO FEEDBACK SYNTHESIZER ---
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
};

const playSound = (type: 'boot' | 'complete' | 'streak') => {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    if (type === 'boot') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now); osc.stop(now + 0.5);
    } else if (type === 'complete') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'streak') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.4); // C6
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn("Audio Context failed to play sound:", e);
  }
};

// --- CORE UTILITY FUNCTIONS ---
const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const format12Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${mStr} ${ampm}`;
};

const getLocalDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 240, 255';
};

// ============================================================================
// 1. GLOBAL STYLES & ANIMATIONS (Premium Commercial Design System)
// ============================================================================
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

    /* Premium 3D Glassmorphism */
    .glass-card {
      background: linear-gradient(145deg, rgba(30, 30, 30, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%);
      backdrop-filter: blur(50px);
      -webkit-backdrop-filter: blur(50px);
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(0, 0, 0, 0.8);
      border-right: 1px solid rgba(0, 0, 0, 0.6);
      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 1), 
        0 10px 20px -5px rgba(0, 0, 0, 0.8),
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
      background: linear-gradient(180deg, rgba(45, 45, 45, 0.5) 0%, rgba(15, 15, 15, 0.8) 100%);
      backdrop-filter: blur(20px);
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

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(1.5deg); }
    }
    @keyframes drift {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -40px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    
    @keyframes spatialReveal { 
      0% { opacity: 0; transform: translateY(15px) scale(0.97); filter: blur(10px); } 
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); } 
    }
    @keyframes spatialHide { 
      0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); } 
      100% { opacity: 0; transform: translateY(-15px) scale(0.97); filter: blur(10px); } 
    }

    .animate-float { animation: float 8s ease-in-out infinite; }
    .animate-drift { animation: drift 25s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
    
    .animate-cinematic { animation: spatialReveal 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    .animate-cinematic-out { animation: spatialHide 1s cubic-bezier(0.8, 0, 0.8, 0.2) forwards; }

    /* Delays */
    .delay-500 { animation-delay: 500ms; }
    .delay-1000 { animation-delay: 1000ms; }
    .delay-1500 { animation-delay: 1500ms; }
    .delay-2000 { animation-delay: 2000ms; }
    .delay-2500 { animation-delay: 2500ms; }
    .delay-3000 { animation-delay: 3000ms; }

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

// ============================================================================
// 2. ELITE UI COMPONENTS
// ============================================================================
interface BadgeProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  colorClass?: string;
}

const Badge = ({ icon: Icon, text, colorClass = "from-zinc-800 to-zinc-900 text-zinc-300 border-white/10" }: BadgeProps) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-medium border shadow-lg bg-gradient-to-b backdrop-blur-md ${colorClass}`}>
    {Icon && <Icon size={12} />}
    <span>{text}</span>
  </div>
);

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  showOrbs?: boolean;
}

const SpatialCard = ({ children, className = '', padding = 'p-6' }: SpatialCardProps) => (
  <div className={`glass-card ${className}`}>
    <div className={`relative z-10 ${padding}`}>
      {children}
    </div>
  </div>
);

const TactileButton = ({ children, onClick, className = '', disabled = false }: any) => (
  <button disabled={disabled} onClick={onClick} className={`btn-tactile rounded-[1.25rem] py-3.5 px-4 font-display font-medium text-[14px] flex justify-center items-center gap-2 text-white/90 w-full ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}>
    {children}
  </button>
);

const Primary3DButton = ({ children, onClick, className = '', disabled = false }: any) => (
  <button disabled={disabled} onClick={onClick} className={`btn-primary-3d rounded-[1.25rem] py-4 px-4 font-display font-bold text-[15px] flex justify-center items-center gap-2 w-full tracking-wide ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${className}`}>
    {children}
  </button>
);

const SegmentedControl3D = ({ options, selected, onChange }: any) => (
  <div className="flex p-1 glass-recessed rounded-[1.25rem] relative w-full">
    {options.map((opt: any) => (
      <button
        key={opt.id} type="button" onClick={() => onChange(opt.id)}
        className={`flex-1 py-2.5 text-[12px] font-display font-semibold rounded-xl transition-all duration-400 z-10 relative ${
          selected === opt.id ? 'text-black drop-shadow-sm' : 'text-zinc-500 hover:text-white'
        }`}
      >
        {opt.label}
      </button>
    ))}
    <div 
      className="absolute top-1 bottom-1 bg-gradient-to-r from-[#00f0ff] to-[#6366f1] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.15)] transition-all duration-500 z-0"
      style={{
        width: `calc(${100 / options.length}% - 4px)`,
        left: `calc(${options.findIndex((o: any) => o.id === selected) * (100 / options.length)}% + 2px)`
      }}
    />
  </div>
);

const ProgressRing = ({ progress, size = 60, stroke = 6, label, gradientId = "ringGradPrimary" }: any) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="ringGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="ringGradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffaa00" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
          <linearGradient id="ringGradLime" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccff00" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} stroke={`url(#${gradientId})`} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-display font-bold text-white uppercase tracking-widest drop-shadow-md">{label}</span>
      </div>
    </div>
  );
};

// ============================================================================
// 3. CINEMATIC ONBOARDING (16-Step Psychological Ritual)
// ============================================================================
const Onboarding = ({ onComplete }: any) => {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [name, setName] = useState('');
  const [directive, setDirective] = useState('Survive one more day');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [habits, setHabits] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  
  const [selectedHabitId, setSelectedHabitId] = useState<any>(null);
  const [deepDiveText, setDeepDiveText] = useState('');

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => (s === 6 && habits.length === 0) ? 11 : s + 1);
      setIsTransitioning(false);
    }, 1000); 
  };

  const addItem = (listSetter: any, list: any[]) => {
    if (!inputText.trim()) return;
    listSetter([{ id: Date.now(), text: inputText }, ...list]);
    setInputText('');
  };

  const finishOnboarding = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const deepDiveNote = deepDiveText.trim() ? {
        title: `Exploration: ${habits.find(h => h.id === selectedHabitId)?.text || 'Reflection'}`,
        content: deepDiveText
      } : null;
      onComplete({ name: name || 'User', habits, goals, deepDiveNote, directive, avatarUrl });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col px-8 pt-20 pb-16 relative z-10 overflow-hidden">

      <div key={step} className={`flex-1 flex flex-col relative z-10 ${isTransitioning ? 'animate-cinematic-out pointer-events-none' : ''}`}>
        
        {/* Screen 1: Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Hello, and welcome.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">The outside world can feel very loud.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Here, there’s no judgment and no hurry.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-12 animate-cinematic delay-3000">Take off your mask and relax. This is your space, you control it.</p>
            <p className="text-sm font-body text-blue-400/80 animate-cinematic delay-4000">Feel free to pause or step away anytime.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-5000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 2: The Shift */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Change often starts quietly.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">It doesn’t need to be loud or sudden.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-12 animate-cinematic delay-2000">First, let’s take a moment to be here now.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-3000">We’ll slow down and breathe.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-4000">
              <TactileButton onClick={handleNext}>Take a breath</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 3: Identity */}
        {step === 2 && (
          <div className="flex-1 flex flex-col pt-6 overflow-y-auto no-scrollbar pb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 animate-cinematic">Identity Setup</h2>
            <p className="text-sm font-body text-zinc-400 mb-8 animate-cinematic delay-500">Establish your profile within FocusFlow.</p>
            
            <div className="animate-cinematic delay-700 space-y-6">
              {/* Profile Pic Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-magenta-600 p-[2px] shadow-lg shrink-0 overflow-hidden relative flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="font-display font-bold text-xl text-white">{name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-widest">Profile Picture</span>
                  <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-widest transition-all">
                    Choose Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event: any) => {
                            setAvatarUrl(event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Codename Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-widest block">What would you like to be called?</label>
                <div className="glass-card p-1.5 border border-white/[0.04] focus-within:border-blue-500/30 transition-colors">
                  <input 
                    type="text" 
                    placeholder="Your name..."
                    className="w-full bg-transparent text-white px-3 py-2 outline-none font-display text-lg placeholder:text-zinc-700"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Core Goal / Directive Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-widest block">Your Core Goal / Directive</label>
                <div className="glass-card p-1.5 border border-white/[0.04] focus-within:border-blue-500/30 transition-colors">
                  <input 
                    type="text" 
                    placeholder="e.g. Survive one more day..."
                    className="w-full bg-transparent text-white px-3 py-2 outline-none font-body text-sm placeholder:text-zinc-600"
                    value={directive} 
                    onChange={(e) => setDirective(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Primary3DButton onClick={handleNext} disabled={!name.trim()}>Continue</Primary3DButton>
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: Privacy */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="absolute top-10 right-0 animate-float opacity-50">
              <Badge text="SECURE" icon={Shield} colorClass="bg-blue-900/40 border-blue-500/30 text-blue-300" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Nice to meet you, {name || 'there'}.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">This is your private space, you’re in complete control.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-2000">Everything you write stays on this device.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-3000">Nothing is ever sent to the cloud or shared. Your privacy is protected.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 5: Metaphor */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Let’s try a different perspective.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Think of your mind as a hidden cave filled with treasures, ideas and strengths you haven’t discovered yet.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-2000">It might feel a little dark or unfamiliar. That’s okay.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-3000">Together we’ll turn on a light and explore gently.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-4000">
              <TactileButton onClick={handleNext}>Turn on the light</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 6: The Setup */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-6 animate-cinematic">Let’s begin by noting anything you’d like to change or let go of, without judging yourself.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">It could be a habit, a feeling, or something you avoid (procrastination, anger, worry, etc.).</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Don’t feel ashamed; everyone struggles with something.</p>
            <p className="text-lg font-body font-medium text-amber-400/90 animate-cinematic delay-3000">Naming these things can actually make them feel lighter. Write quickly and honestly, without overthinking.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 7: Extraction Input */}
        {step === 6 && (
          <div className="flex-1 flex flex-col h-full animate-cinematic pt-6">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Just let your thoughts flow.</h2>
            <p className="text-sm font-body text-zinc-400 mb-2">Write whatever comes to mind about habits or behaviors you want to change.</p>
            <p className="text-xs font-body text-blue-400/80 mb-6">This is private, so no need to worry about spelling or grammar.</p>
            
            <div className="glass-card p-[1px] mb-4">
              <div className="bg-black/50 rounded-[2rem] p-2 flex items-center">
                <input 
                  className="bg-transparent flex-1 px-4 outline-none text-white font-body text-sm placeholder:text-zinc-600"
                  placeholder="Example: procrastination, getting angry..."
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (addItem(setHabits, habits), setInputText(''))}
                />
                <button type="button" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-3 rounded-xl shadow-lg hover:scale-105 transition-transform" onClick={() => { addItem(setHabits, habits); setInputText(''); }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {habits.length === 0 ? (
              <div className="text-center mt-4">
                <p className="text-xs font-body text-zinc-500 animate-cinematic delay-1000">Write short bullet points. Don’t edit yourself, just get it out.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
                {habits.map((h) => (
                  <div key={h.id} className="glass-card p-4 rounded-[1.25rem] flex items-center gap-4 animate-cinematic">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-magenta-500" />
                    <span className="font-body text-sm text-zinc-200">{h.text}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 mt-auto">
              <Primary3DButton onClick={handleNext}>
                {habits.length > 0 ? "Next Step" : "Skip for now"}
              </Primary3DButton>
            </div>
          </div>
        )}

        {/* Screen 8: Observation */}
        {step === 7 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Now, slowly read through what you wrote.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Try not to judge yourself—just observe.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Notice if any item jumps out as particularly strong or important.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-magenta-orange animate-cinematic delay-3000">That might be a good one to explore first. (We’ll focus on one thing at a time.)</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-4000">
              <TactileButton onClick={handleNext}>Observe</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 9: Selection */}
        {step === 8 && (
          <div className="flex-1 flex flex-col h-full animate-cinematic pt-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Which one feels most important right now?</h2>
            <p className="text-sm font-body text-zinc-400 mb-8">Tap the item you want to explore first. You can always come back to the others later.</p>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
              {habits.map((h) => (
                <button 
                  key={h.id} type="button" onClick={() => { setSelectedHabitId(h.id); handleNext(); }}
                  className="glass-card p-6 rounded-[1.5rem] text-left border border-white/5 hover:border-magenta-500/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-magenta-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-display font-medium text-lg text-white relative z-10 flex items-center justify-between">
                    {h.text}
                    <ChevronRight className="text-magenta-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 10: Deep Dive */}
        {step === 9 && (
          <div className="flex-1 flex flex-col h-full animate-cinematic pt-6">
            <div className="flex justify-center mb-4 animate-float">
              <Badge text={habits.find(h => h.id === selectedHabitId)?.text || "Reflection"} icon={Zap} colorClass="bg-magenta-900/40 border-magenta-500/30 text-magenta-200" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 text-center">Tell the story of this issue in your own words.</h2>
            <p className="text-sm font-body text-zinc-400 mb-6 text-center">Write in complete sentences about why this pattern might be happening.</p>

            <div className="glass-card flex-1 rounded-[2rem] p-6 flex flex-col border border-white/[0.04] focus-within:border-magenta-500/30 transition-colors shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <textarea 
                className="w-full bg-transparent text-white font-body text-[16px] outline-none placeholder:text-zinc-600 flex-1 resize-none leading-relaxed"
                placeholder="I feel this way because..."
                value={deepDiveText} onChange={(e) => setDeepDiveText(e.target.value)}
              />
            </div>
            <div className="mt-6 space-y-1.5 text-center text-[12px] font-body text-zinc-500">
              <p>Let your thoughts pour out naturally, don’t worry about editing.</p>
              <p>You might ask yourself: 'Why does this happen? What is it protecting me from? Am I angry or afraid of something?'</p>
            </div>
            
            <div className="pt-6 mt-auto">
              <Primary3DButton onClick={handleNext} disabled={!deepDiveText.trim()}>Save Story</Primary3DButton>
            </div>
          </div>
        )}

        {/* Screen 11: Reflection */}
        {step === 10 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Take a breath and read over what you wrote.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Everything you wrote is human and understandable.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">These thoughts and feelings are real parts of you, and bringing them into the light is a brave act.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-3000">There’s nothing wrong or disgusting here, it just shows you care about improving. Treat yourself with the same kindness you’d offer a friend.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 12: Realization */}
        {step === 11 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">How do you feel right now?</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Maybe a little lighter or proud?</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Confronting this is powerful, it takes courage.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-3000">It often feels more satisfying than trying to avoid the issue.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-4000">You’re doing the hard work now, and you have everything you need to keep going.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-5000">
              <TactileButton onClick={handleNext}>I am ready</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 13: The Future */}
        {step === 12 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 glass-card rounded-[1.5rem] flex items-center justify-center animate-float mb-4 animate-cinematic">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-magenta-500/20" />
              <Moon size={36} className="text-white relative z-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3 animate-cinematic delay-1000">Now imagine yourself years from today.</h2>
            <p className="text-[14px] font-body font-light text-zinc-400 mb-3 animate-cinematic delay-2000 leading-relaxed max-w-[320px]">If things stay the same, those habits will still be running your life, what might that life look like?</p>
            <p className="text-[14px] font-body font-light text-zinc-400 mb-4 animate-cinematic delay-3000 leading-relaxed max-w-[320px]">Remember, big changes come from small steps over time.</p>
            <p className="text-[15px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500 mb-20 animate-cinematic delay-4000 drop-shadow-lg leading-relaxed max-w-[300px] mx-auto">The door isn’t closed on you: you can start changing course today. You’re exactly where you need to be.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-5000">
              <TactileButton onClick={handleNext}>Step Forward</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 14: Goals Input */}
        {step === 13 && (
          <div className="flex-1 flex flex-col h-full animate-cinematic pt-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">What would you do differently from now on?</h2>
            <p className="text-sm font-body text-zinc-400 mb-6">List the goals or changes you want in your life, even small ones. (They don’t all have to happen, just focus on enough to move in a better direction.)</p>
            
            <div className="glass-card p-[1px] mb-6">
              <div className="bg-black/50 rounded-[2rem] p-2 flex items-center">
                <input 
                  className="bg-transparent flex-1 px-4 outline-none text-white font-body text-sm placeholder:text-zinc-600"
                  placeholder="e.g. Read 10 pages, sleep earlier..."
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (addItem(setGoals, goals), setInputText(''))}
                />
                <button type="button" className="bg-gradient-to-r from-lime-400 to-green-500 text-black p-3 rounded-xl shadow-lg hover:scale-105 transition-transform" onClick={() => { addItem(setGoals, goals); setInputText(''); }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {goals.length > 0 && (
              <p className="text-[11px] font-display text-lime-400/80 tracking-wide mb-4 animate-cinematic text-center uppercase">
                Your future is taking shape as you do this.
              </p>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
              {goals.map((g) => (
                <div key={g.id} className="glass-card p-4 rounded-[1.25rem] flex items-center gap-4 animate-cinematic">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-lime-400 to-green-500" />
                  <span className="font-body text-sm text-zinc-200">{g.text}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 mt-auto">
              <Primary3DButton onClick={handleNext}>{goals.length > 0 ? "Continue" : "Skip for now"}</Primary3DButton>
            </div>
          </div>
        )}

        {/* Screen 15: The Process */}
        {step === 14 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Real change happens step by step.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Like moving a mountain one stone at a time, every small action adds up.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">One day of effort can become a habit. Habits shape who we are.</p>
            <p className="text-2xl font-display font-bold text-gradient gradient-magenta-orange mb-12 animate-cinematic delay-3000">So remember: even the tiniest repeatable step is a real beginning.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 16: Launch / System */}
        {step === 15 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 glass-card rounded-[1.5rem] flex items-center justify-center animate-float mb-6 animate-cinematic">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-magenta-500/20" />
              <Layers size={32} className="text-white relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4 animate-cinematic delay-500">Welcome to your personal toolkit.</h2>
            <p className="text-sm font-body font-light text-zinc-400 mb-8 animate-cinematic delay-1000">Here’s how to use it:</p>
            
            <div className="space-y-4 w-full mb-10 animate-cinematic delay-2000">
              <div className="glass-recessed p-4 rounded-2xl flex items-center gap-4 text-left">
                <CheckCircle2 className="text-blue-400" size={24} />
                <div>
                  <span className="text-md font-display font-bold text-white block">Tasks</span>
                  <span className="text-xs font-body text-zinc-400">are your daily actions, the little stones you move.</span>
                </div>
              </div>
              <div className="glass-recessed p-4 rounded-2xl flex items-center gap-4 text-left">
                <Target className="text-magenta-400" size={24} />
                <div>
                  <span className="text-md font-display font-bold text-white block">Goals</span>
                  <span className="text-xs font-body text-zinc-400">are recurring habits to build consistency.</span>
                </div>
              </div>
              <div className="glass-recessed p-4 rounded-2xl flex items-center gap-4 text-left">
                <FileText className="text-amber-400" size={24} />
                <div>
                  <span className="text-md font-display font-bold text-white block">Notes</span>
                  <span className="text-xs font-body text-zinc-400">is a private journal for ideas or reflections.</span>
                </div>
              </div>
              <div className="glass-recessed p-4 rounded-2xl flex items-center gap-4 text-left">
                <BarChart2 className="text-lime-400" size={24} />
                <div>
                  <span className="text-md font-display font-bold text-white block">Progress</span>
                  <span className="text-xs font-body text-zinc-400">shows how far you’ve come on this journey.</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-display text-blue-300/80 uppercase tracking-widest animate-cinematic delay-3000 mb-2">Everything is stored only on your device (no internet needed).</p>
            <p className="text-lg font-display font-bold text-white animate-cinematic delay-4000 mb-8">You’re ready to start, go at your own pace.</p>
            
            <div className="absolute bottom-6 w-full animate-cinematic delay-5000">
              <Primary3DButton onClick={finishOnboarding} disabled={isTransitioning}>
                Enter Toolkit
              </Primary3DButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN APP TABS (UI Upgraded, Logic Intact)
// ============================================================================

const DashboardTab = ({ userData, tasks, setTasks, addXP, buff1, buff2, claimCustomBuff, timeBurn, dailyProgressPct, goals = [], setGoals, showToast, executeTask }: any) => {
  const curDateStr = getLocalDateStr();

  // Helper functions for date/schedule checks
  const isSameWeek = (dateStr1: string, dateStr2: string) => {
    if (!dateStr1 || !dateStr2) return false;
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const getStartOfWeek = (d: Date) => {
      const day = d.getDay();
      const diff = d.getDate() - day;
      const start = new Date(d);
      start.setDate(diff);
      return start.toDateString();
    };
    return getStartOfWeek(d1) === getStartOfWeek(d2);
  };

  const isSameMonth = (dateStr1: string, dateStr2: string) => {
    if (!dateStr1 || !dateStr2) return false;
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
  };

  const activeTasks = tasks.filter((t: any) => !t.completed);

  // Deployed goals that are not fully completed, and are due according to timeline/schedule
  const activeGoals = goals.filter((g: any) => {
    if (g.current >= g.target) return false; // Fully achieved
    if (!g.lastDoneTime) return true; // Never done, so it is due

    const timePassed = Date.now() - g.lastDoneTime;
    const timelineLower = g.timeline.toLowerCase();

    if (timelineLower.includes('hour')) {
      return timePassed >= 3600000; // 1 hour
    }
    if (timelineLower.includes('year')) {
      const lastYear = new Date(g.lastDoneTime).getFullYear();
      const curYear = new Date().getFullYear();
      return lastYear !== curYear;
    }
    if (timelineLower.includes('month')) {
      const lastMonth = new Date(g.lastDoneTime).getMonth();
      const curMonth = new Date().getMonth();
      const lastYear = new Date(g.lastDoneTime).getFullYear();
      const curYear = new Date().getFullYear();
      return lastMonth !== curMonth || lastYear !== curYear;
    }
    if (timelineLower.includes('week')) {
      return !isSameWeek(new Date(g.lastDoneTime).toLocaleDateString(), new Date().toLocaleDateString());
    }
    if (timelineLower.includes('daily') || timelineLower.includes('day')) {
      return new Date(g.lastDoneTime).toLocaleDateString() !== new Date().toLocaleDateString();
    }
    return new Date(g.lastDoneTime).toLocaleDateString() !== new Date().toLocaleDateString(); // Default to Daily reset
  });

  // Map into unified Action Queue items list
  const queueItems = [
    ...activeTasks.map((t: any) => ({
      id: `task-${t.id}`,
      title: t.title,
      type: 'task',
      priority: t.priority,
      original: t
    })),
    ...activeGoals.map((g: any) => ({
      id: `goal-${g.id}`,
      title: `${g.title} (${g.timeline})`,
      type: 'goal',
      priority: 'medium', // Default priority for goals
      original: g
    }))
  ];


  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-magenta-600 flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-2xl text-white drop-shadow-md">{userData.codename?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white leading-none tracking-tight">{userData.codename}</h1>
            <p className="text-[10px] font-display text-blue-400 uppercase tracking-widest mt-1.5 font-bold">{userData.directive || 'Survive one more day'}</p>
          </div>
        </div>
        <div className="glass-recessed px-5 py-3 rounded-[1.5rem] border border-blue-500/20 shadow-md text-center min-w-[80px]">
          <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-magenta-400 drop-shadow-sm">{userData.score}</span>
          <p className="text-[9px] text-zinc-500 font-display font-bold tracking-widest uppercase mt-1">Total XP</p>
        </div>
      </header>

      <SpatialCard padding="p-8" showOrbs={true}>
        <div className="flex justify-around items-center relative z-10">
          <ProgressRing progress={timeBurn.day.pct} label="Day" gradientId="ringGradAccent" />
          <div className="relative">
            <ProgressRing progress={timeBurn.month.pct} label="Month" size={100} stroke={8} gradientId="ringGradPrimary" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full animate-pulse border-2 border-magenta-500" />
          </div>
          <ProgressRing progress={timeBurn.year.pct} label="Year" gradientId="ringGradLime" />
        </div>
      </SpatialCard>

      <div className="glass-card p-6 border-t border-t-blue-500/30 hover:scale-[1.01] transition-transform">
        <div className="flex justify-between text-[11px] font-display font-bold tracking-widest text-zinc-400 uppercase mb-4">
          <div className="flex items-center gap-2"><Zap size={16} className="text-blue-400"/> Execution Protocol</div>
          <span className="text-white bg-white/10 px-2.5 py-1 rounded-lg shadow-inner">{Math.round(dailyProgressPct)}%</span>
        </div>
        <div className="h-4 rounded-full bg-black shadow-[inset_0_4px_8px_rgba(0,0,0,1)] relative overflow-hidden border border-white/[0.05]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-magenta-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${dailyProgressPct}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] opacity-60" />
          </div>
        </div>
      </div>

      {/* Reintroduced Custom Buffs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'buff1', data: buff1, icon: Flame, color: 'text-orange-400' },
          { key: 'buff2', data: buff2, icon: Sparkles, color: 'text-violet-400' }
        ].map((b, idx) => {
          const isClaimed = b.data?.lastClaimed === curDateStr;
          return (
            <SpatialCard key={b.key} padding="p-4" className="flex flex-col justify-between min-h-[140px] border-t border-t-zinc-800">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center bg-black/40 border border-white/10`}>
                   <b.icon size={18} className={isClaimed ? 'text-zinc-600' : b.color} />
                </div>
                {!isClaimed && <span className="text-xs font-display font-bold text-zinc-400">+{b.data?.xp || 100} XP</span>}
              </div>
              <div>
                 <h4 className="font-display text-[14px] font-bold text-white mb-2 leading-tight">{b.data?.title || 'Daily Buff'}</h4>
                 <button 
                   type="button"
                   disabled={isClaimed}
                   onClick={(e) => claimCustomBuff(b.key, b.data, e)} 
                   className={`w-full py-2 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest transition-all ${
                     isClaimed 
                       ? 'bg-white/5 text-zinc-600 cursor-not-allowed' 
                       : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                   }`}
                 >
                   {isClaimed ? 'Claimed' : 'Activate'}
                 </button>
              </div>
            </SpatialCard>
          );
        })}
      </div>

      <div>
        <h2 className="text-[12px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mb-4">Action Queue</h2>
        {queueItems.length === 0 ? (
          <div className="glass-recessed p-10 rounded-[2rem] text-center text-zinc-500 font-body text-sm border border-white/[0.02]">
            Queue is clear. Rest or deploy.
          </div>
        ) : (
          <div className="space-y-4">
            {queueItems.sort((a: any, b: any) => getTaskWeight(b.priority) - getTaskWeight(a.priority)).slice(0, 3).map((item: any) => (
              <div key={item.id} className="glass-card p-5 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/[0.05] border-l-4" style={{borderLeftColor: item.type === 'goal' ? '#a855f7' : item.priority === 'high' ? '#ff00ff' : item.priority === 'medium' ? '#00f0ff' : 'transparent'}}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  if (item.type === 'task') {
                    executeTask(item.original, e);
                  } else {
                    setGoals(goals.map((g: any) => g.id === item.original.id ? { ...g, current: g.current + 1, lastDone: curDateStr, lastDoneTime: Date.now() } : g));
                    playSound('streak');
                    addXP(25);
                    showToast(`Milestone progress: ${item.original.current + 1}/${item.original.target}`);
                  }
                }}>
                  <Circle className="text-zinc-500 group-hover:text-blue-400 transition-colors w-7 h-7" />
                </button>
                <div className="flex-1">
                  <p className="text-white font-body text-[16px] font-medium leading-tight">{item.title}</p>
                </div>
              </div>
            ))}
            {queueItems.length > 3 && (
              <p className="text-center text-[10px] font-display text-zinc-500 mt-4 uppercase tracking-widest bg-black/40 rounded-full py-2.5 w-max mx-auto px-5 border border-white/5">+{queueItems.length - 3} more actions</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TasksTab = ({ tasks, setTasks, addXP, goals, executeTask }: any) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [taskGoalId, setTaskGoalId] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(getLocalDateStr());
  const [taskTime, setTaskTime] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([{ 
      id: Date.now(), 
      title: newTask, 
      priority, 
      goalId: taskGoalId || null,
      deadline: taskDeadline,
      time: taskTime,
      completed: false 
    }, ...tasks]);
    setNewTask('');
    setTaskGoalId('');
    setTaskDeadline(getLocalDateStr());
    setTaskTime('');
  };

  const activeTasks = tasks.filter((t: any) => !t.completed);
  const completedTasks = tasks.filter((t: any) => t.completed);

  return (
    <div className="space-y-6 pb-32 animate-cinematic h-full flex flex-col">
      <div className="flex justify-between items-end px-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">Tasks</h1>
        <Badge text="PROTOCOL" colorClass="bg-blue-500/20 text-blue-300 border-blue-500/30" />
      </div>
      
      <SpatialCard padding="p-6" className="shrink-0 border-t border-t-blue-500/30">
        <div className="glass-recessed rounded-[1.25rem] p-4 mb-4 border border-white/[0.02] focus-within:border-blue-500/40 transition-colors shadow-inner">
          <input 
            className="w-full bg-transparent text-white font-body text-[16px] outline-none placeholder:text-zinc-500"
            placeholder="Define next action..."
            value={newTask} onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex gap-2 items-center">
            <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-zinc-300 text-xs font-display outline-none focus:border-blue-500/40" />
            <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-zinc-300 text-xs font-display outline-none focus:border-blue-500/40" />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            <button type="button" onClick={() => setTaskGoalId('')} className={`px-3 py-2 rounded-[12px] text-[10px] font-display font-bold whitespace-nowrap shrink-0 transition-all border ${taskGoalId === '' ? 'bg-white/10 text-white border-blue-500/40' : 'bg-black/30 text-zinc-500 border-transparent hover:text-zinc-300'}`}>No Objective</button>
            {goals.map((g: any) => (
              <button key={g.id} type="button" onClick={() => setTaskGoalId(g.id)} className={`px-3 py-2 rounded-[12px] text-[10px] font-display font-bold whitespace-nowrap shrink-0 transition-all border ${taskGoalId === g.id ? 'bg-white/10 text-white border-blue-500/40' : 'bg-black/30 text-zinc-500 border-transparent hover:text-zinc-300'}`}>
                {g.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SegmentedControl3D 
              options={[
                { id: 'low', label: 'Low' },
                { id: 'medium', label: 'Med' },
                { id: 'high', label: 'High' }
              ]}
              selected={priority}
              onChange={setPriority}
            />
          </div>
          <button type="button" className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-magenta-600 flex items-center justify-center shadow-lg text-white hover:scale-105 active:scale-95 transition-transform border border-white/20" onClick={handleAddTask}>
            <Plus size={20} />
          </button>
        </div>
      </SpatialCard>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        <div className="space-y-4">
          <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2">Active Targets</h2>
          {activeTasks.length === 0 && <p className="text-zinc-600 text-[14px] px-2 font-body">No tasks deployed.</p>}
          {activeTasks.map((task: any) => (
            <div key={task.id} className="glass-card p-5 rounded-[1.5rem] flex items-center gap-4 group">
              <button type="button" onClick={(e) => executeTask(task, e)}>
                <Circle className="text-zinc-600 group-hover:text-blue-400 transition-colors w-7 h-7" />
              </button>
              <div className="flex-1">
                <p className="text-white font-body text-[16px] font-medium leading-tight">{task.title}</p>
                <span className="text-[9px] font-display font-bold text-zinc-500 uppercase tracking-wider block mt-1">
                  {task.deadline === getLocalDateStr() ? 'Due Today' : `Due: ${task.deadline}`}
                  {task.time ? ` at ${format12Hour(task.time)}` : ''}
                </span>
              </div>
              <Badge text={task.priority} colorClass={
                task.priority === 'high' ? 'bg-magenta-500/20 text-magenta-300 border-magenta-500/30' : 
                task.priority === 'medium' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 
                'bg-zinc-800 text-zinc-400 border-white/5'
              } />
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="space-y-4 opacity-50">
            <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2">Cleared</h2>
            {completedTasks.map((task: any) => (
              <div key={task.id} className="glass-recessed p-5 rounded-[1.5rem] flex items-center gap-4">
                <CheckCircle2 className="text-blue-400/40 w-6 h-6" />
                <p className="text-zinc-500 font-body text-[15px] line-through leading-tight">{task.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GoalsTab = ({ goals, setGoals, addXP }: any) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState<any>(30);
  const [timeline, setTimeline] = useState('Daily');
  const [customValue, setCustomValue] = useState<number>(3);
  const [customUnit, setCustomUnit] = useState<string>('Hours');
  const [isCustomTimeline, setIsCustomTimeline] = useState(false);

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    let finalTimeline = timeline;
    let frequencyValue = 1;
    let frequencyUnit = 'day';

    if (isCustomTimeline) {
      const unitSingular = customUnit === 'Hours' ? 'hour' : 'day';
      frequencyValue = customValue;
      frequencyUnit = unitSingular;
      finalTimeline = `Every ${customValue} ${customUnit}`;
    } else {
      if (timeline === 'Daily') {
        frequencyValue = 1;
        frequencyUnit = 'day';
      } else if (timeline === 'Weekly') {
        frequencyValue = 1;
        frequencyUnit = 'week';
      } else if (timeline === 'Monthly') {
        frequencyValue = 1;
        frequencyUnit = 'month';
      }
    }

    const safeTarget = Math.max(1, parseInt(goalTarget) || 1);
    setGoals([{
      id: Date.now(),
      title: newGoalTitle,
      timeline: finalTimeline,
      target: safeTarget,
      current: 0,
      createdAt: Date.now(),
      frequencyValue,
      frequencyUnit
    }, ...goals]);
    setNewGoalTitle('');
    setGoalTarget(30);
    setTimeline('Daily');
    setIsCustomTimeline(false);
    setCustomValue(3);
    setCustomUnit('Hours');
  };

  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <div className="px-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2">Milestones</h1>
        <p className="text-zinc-400 text-[14px] font-body">Automated recurring missions.</p>
      </div>

      <SpatialCard padding="p-6" className="shrink-0 border-t border-t-magenta-500/30">
        <h3 className="font-display font-bold text-[16px] text-white mb-4">Deploy Milestone</h3>
        <div className="glass-recessed rounded-[1.25rem] p-4 mb-4 border border-white/[0.02] focus-within:border-magenta-500/40 transition-colors shadow-inner">
          <input 
            className="w-full bg-transparent text-white font-body text-[16px] outline-none placeholder:text-zinc-500"
            placeholder="Objective..."
            value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
          />
        </div>
        <div className="flex gap-2 mb-4">
          {['Daily', 'Weekly', 'Monthly'].map(t => (
            <button 
              key={t} 
              type="button" 
              onClick={() => { setTimeline(t); setIsCustomTimeline(false); }} 
              className={`flex-1 py-2.5 rounded-[12px] text-[10px] font-display font-bold uppercase tracking-widest border transition-colors ${!isCustomTimeline && timeline === t ? 'bg-white/10 text-white border-magenta-500/40' : 'bg-black/30 border-transparent text-zinc-500'}`}
            >
              {t}
            </button>
          ))}
          <button 
            type="button" 
            onClick={() => setIsCustomTimeline(true)} 
            className={`flex-1 py-2.5 rounded-[12px] text-[10px] font-display font-bold uppercase tracking-widest border transition-colors ${isCustomTimeline ? 'bg-white/10 text-white border-magenta-500/40' : 'bg-black/30 border-transparent text-zinc-500'}`}
          >
            Custom...
          </button>
        </div>

        {isCustomTimeline && (
          <div className="mb-4 space-y-3 animate-cinematic">
            <span className="text-[10px] font-display font-bold text-[#A1A1AA] uppercase tracking-widest block">Custom Frequency</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-body">Every</span>
              <input 
                type="number" 
                min="1" 
                className="w-16 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-bold text-center outline-none focus:border-magenta-500/40"
                value={customValue}
                onChange={(e) => setCustomValue(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
                {['Hours', 'Days'].map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setCustomUnit(unit)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase transition-colors ${
                      customUnit === unit 
                        ? 'bg-magenta-500 text-white' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="space-y-1.5 pt-1 mb-4">
          <span className="text-[10px] font-display font-bold text-[#A1A1AA] uppercase tracking-widest">Deployment Count</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[10, 20, 30, 40, 50].map(num => (
              <button key={num} type="button" onClick={() => setGoalTarget(num)} className={`px-4 py-2.5 rounded-[12px] text-[11px] font-display font-bold shrink-0 transition-all border ${goalTarget == num ? 'bg-white/10 text-white border-magenta-500/40' : 'bg-black/30 border-transparent text-zinc-500'}`}>{num}</button>
            ))}
            <input type="number" min="1" value={goalTarget} onChange={(e: any) => setGoalTarget(e.target.value)} placeholder="Custom" className="w-20 px-3 py-2.5 rounded-[12px] bg-black/40 border border-white/10 text-white text-[11px] font-bold outline-none focus:border-magenta-500/40 shrink-0" />
          </div>
        </div>
        <Primary3DButton onClick={handleAddGoal}>
          <Target size={18} /> Deploy Goal
        </Primary3DButton>
      </SpatialCard>

      {goals.length === 0 && (
        <div className="text-center py-16 glass-recessed rounded-[2rem] text-zinc-500 font-body text-[15px] border border-white/[0.02]">
          No active milestones.
        </div>
      )}

      <div className="space-y-6">
        {goals.map((goal: any) => {
          const progress = (goal.current / goal.target) * 100;
          const isComplete = goal.current >= goal.target;
          return (
            <SpatialCard key={goal.id} padding="p-8" className="border-t border-t-magenta-500/30">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-white font-display font-bold text-2xl leading-tight mb-2">{goal.title}</h3>
                  <Badge text={goal.timeline} colorClass="bg-magenta-500/10 text-magenta-300 border-magenta-500/20" />
                </div>
                <div className="glass-recessed px-5 py-3 rounded-2xl border border-white/5 text-center shadow-lg">
                  <span className="text-3xl font-display font-bold text-white leading-none">{goal.current}</span>
                  <div className="text-[11px] font-display text-zinc-500 uppercase tracking-widest mt-1">/ {goal.target}</div>
                </div>
              </div>
              
              <div className="h-4 glass-recessed rounded-full overflow-hidden p-[1px] mb-8 shadow-[inset_0_4px_8px_rgba(0,0,0,1)]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 relative ${isComplete ? 'bg-magenta-500' : 'bg-gradient-to-r from-blue-500 to-magenta-500'}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] opacity-60" />
                </div>
              </div>

              <Primary3DButton 
                disabled={isComplete}
                onClick={() => {
                  if (!isComplete) {
                    setGoals(goals.map((g: any) => g.id === goal.id ? { ...g, current: g.current + 1, lastDone: getLocalDateStr(), lastDoneTime: Date.now() } : g));
                    addXP(25);
                  }
                }}
              >
                {isComplete ? "Milestone Cleared" : "Deploy Action"}
              </Primary3DButton>
            </SpatialCard>
          )
        })}
      </div>
    </div>
  );
};

const NotesTab = ({ notes, setNotes, showToast }: any) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const saveNote = () => {
    if (!newNote.content.trim()) return;
    setNotes([{ id: Date.now(), ...newNote, date: new Date().toLocaleDateString() }, ...notes]);
    setNewNote({ title: '', content: '' });
    showToast("Record preserved.");
  };

  return (
    <div className="space-y-6 pb-32 animate-cinematic h-full flex flex-col">
      <div className="px-2 flex justify-between items-end">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">Vault</h1>
        <Badge text="PRIVATE" icon={Shield} colorClass="bg-white/10 text-white border-white/20" />
      </div>
      
      {/* Sleek Frosted Glass Editor */}
      <div className="glass-card rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-blue-500/20 relative shrink-0">
        <h3 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
          <Sparkles className="text-blue-400" size={20} /> New Reflection
        </h3>
        <div className="space-y-4 mb-6">
          <input 
            className="w-full bg-transparent text-white font-display font-bold text-2xl outline-none placeholder:text-zinc-600 border-b border-white/10 pb-3"
            placeholder="Title (Optional)"
            value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})}
          />
          <textarea 
            className="w-full bg-transparent text-zinc-300 font-body text-[16px] outline-none placeholder:text-zinc-600 min-h-[120px] resize-none leading-relaxed pt-2"
            placeholder="Capture thoughts, ideas, or rules..."
            value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})}
          />
        </div>
        <Primary3DButton onClick={saveNote}>Preserve Record</Primary3DButton>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pt-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2">Archived</h2>
        {notes.length === 0 && <p className="text-zinc-600 text-[14px] px-2 font-body">Vault is empty.</p>}
        {notes.map((note: any) => (
          <div key={note.id} className="glass-card p-6 border-t border-t-amber-500/30 hover:scale-[1.02] transition-transform">
            {note.title && <h3 className="text-white font-display font-bold text-xl mb-3">{note.title}</h3>}
            <p className="text-zinc-300 text-[15px] font-body leading-relaxed whitespace-pre-wrap">{note.content}</p>
            <div className="mt-6 text-[10px] font-display font-bold text-amber-500/80 uppercase tracking-widest bg-amber-500/10 w-max px-3 py-1 rounded-md">{note.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsTab = ({ userData, habits, showToast, handleExport, fileInputRef, handleImport, currentTheme, changeTheme, yieldRange, setYieldRange, yieldData, maxYieldXP, rgbTheme, updateProfile }: any) => {
  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <h1 className="text-4xl font-display font-bold text-white px-2 tracking-tighter">System</h1>
      
      <SpatialCard padding="p-8" className="flex flex-col items-center text-center gap-6 border-t border-t-lime-500/40">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 via-green-500 to-blue-600 shadow-xl relative" style={{ borderColor: currentTheme }}>
          <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center overflow-hidden">
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-lime-400 to-blue-500 leading-none select-none">{userData.codename?.charAt(0) || 'U'}</span>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white drop-shadow-md leading-tight">{userData.codename}</h2>
          <div className="mt-3 flex justify-center">
            <Badge text={`Level ${Math.floor(userData.score / 100) + 1} Operator`} colorClass="bg-lime-500/15 text-lime-400 border-lime-500/30 px-4 py-2 text-sm" />
          </div>
        </div>
      </SpatialCard>

      {/* Reintroduced Theme Color Picker */}
      <div className="glass-card p-6 border-t border-t-zinc-800">
         <span className="text-[11px] font-display font-bold text-[#A1A1AA] uppercase tracking-widest block mb-4">Core Theme Color</span>
         <div className="flex gap-3 justify-start">
           {['#00f0ff', '#6366f1', '#ff00ff', '#ccff00', '#ffaa00'].map(color => (
              <button 
                key={color} 
                type="button"
                onClick={() => changeTheme(color)} 
                className={`w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95 ${currentTheme === color ? 'ring-2 ring-white ring-offset-4 ring-offset-[#030303] scale-105' : ''}`} 
                style={{ backgroundColor: color }} 
              />
           ))}
         </div>
      </div>

      {/* Profile Settings */}
      <div className="glass-card p-6 border-t border-t-zinc-800 space-y-4">
         <span className="text-[11px] font-display font-bold text-[#A1A1AA] uppercase tracking-widest block">Profile Settings</span>
         <div className="space-y-4">
           {/* Edit Core Goal */}
           <div className="space-y-1.5">
             <label className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-widest block">Core Goal / Directive</label>
             <div className="glass-recessed rounded-xl p-3 border border-white/[0.02]">
               <input 
                 type="text" 
                 className="w-full bg-transparent text-white text-sm outline-none font-body placeholder:text-zinc-600"
                 placeholder="Survive one more day..."
                 value={userData.directive || ''}
                 onChange={(e) => updateProfile({ directive: e.target.value })}
               />
             </div>
           </div>

           {/* Edit Profile Pic */}
           <div className="space-y-1.5">
             <label className="text-[10px] font-display font-bold text-zinc-500 uppercase tracking-widest block">Profile Picture</label>
             <div className="flex gap-3 items-center">
               <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all">
                 Upload Image
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={(e: any) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       const reader = new FileReader();
                       reader.onload = (event: any) => {
                         updateProfile({ avatarUrl: event.target.result });
                         showToast("Profile picture updated");
                       };
                       reader.readAsDataURL(file);
                     }
                   }}
                 />
               </label>
               {userData.avatarUrl && (
                 <button 
                   type="button" 
                   onClick={() => {
                     updateProfile({ avatarUrl: '' });
                     showToast("Profile picture removed");
                   }}
                   className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all"
                 >
                   Remove
                 </button>
               )}
             </div>
           </div>
         </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mt-8">Data Protection</h2>
        <div className="glass-card p-5 space-y-3">
          <div className="p-4 flex items-center justify-between bg-black/40 rounded-2xl hover:bg-black/60 transition-colors border border-white/[0.02]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Download size={20} />
              </div>
              <div>
                <p className="text-[16px] font-display font-bold text-white">System Backup</p>
                <p className="text-[12px] font-body text-zinc-500 mt-1">Save local data securely</p>
              </div>
            </div>
            <button type="button" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform" onClick={handleExport}>Export</button>
          </div>

          <div className="p-4 flex items-center justify-between bg-black/40 rounded-2xl hover:bg-black/60 transition-colors border border-white/[0.02]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1rem] bg-magenta-500/10 border border-magenta-500/30 flex items-center justify-center text-magenta-400">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-[16px] font-display font-bold text-white">Restore Data</p>
                <p className="text-[12px] font-body text-zinc-500 mt-1">Load previous .json file</p>
              </div>
            </div>
            <button type="button" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform" onClick={() => fileInputRef.current.click()}>Import</button>
            <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImport} />
          </div>
        </div>
      </div>

      {/* Reintroduced Analytics Yield Charts */}
      <div className="space-y-4">
         <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mt-8">Analytics Yield</h2>
         <SpatialCard padding="p-6" className="border-t border-t-zinc-800">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-[16px] text-white">Action Matrix</h3>
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                 {['7d', '30d', '1y'].map(r => (
                   <button key={r} type="button" onClick={() => setYieldRange(r)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase transition-colors ${yieldRange === r ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>{r}</button>
                 ))}
              </div>
            </div>
            
            {yieldRange === '7d' && (
              <div className="flex items-end justify-between h-28 gap-2 pt-2">
                {yieldData.map((d: any, i: number) => {
                  const pct = Math.min((d.xp / Math.max(1, maxYieldXP)) * 100, 100);
                  const isToday = i === yieldData.length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 justify-end h-full">
                       <div className="w-full rounded-lg relative overflow-hidden bg-white/5" style={{ height: '100%' }}>
                         <div className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-1000 ease-out" 
                              style={{ height: `${Math.max(pct, 6)}%`, background: `linear-gradient(to top, var(--theme-color, #00f0ff), #6366f1)` }} />
                       </div>
                       <span className={`text-[9px] font-display font-bold ${isToday ? 'text-white' : 'text-zinc-500'}`}>{d.date.toLocaleDateString('en-US', { weekday: 'short' })[0]}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {yieldRange === '30d' && (
              <div className="flex items-end justify-between h-28 gap-[3px] pt-2">
                {yieldData.map((d: any, i: number) => {
                  const pct = Math.min((d.xp / Math.max(1, maxYieldXP)) * 100, 100);
                  const isToday = i === yieldData.length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                       <div className="w-full rounded-sm relative overflow-hidden bg-white/5" style={{ height: '100%' }}>
                         <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-1000" 
                              style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: isToday ? 'var(--theme-color, #00f0ff)' : '#6366f1' }} />
                       </div>
                    </div>
                  );
                })}
              </div>
            )}

            {yieldRange === '1y' && (
              <div className="flex flex-col gap-1 overflow-x-auto no-scrollbar flex-row-reverse pb-1" dir="rtl">
                 <div className="grid grid-rows-7 grid-flow-col gap-1.5" dir="ltr">
                    {yieldData.map((d: any, i: number) => {
                       const intensity = d.xp === 0 ? 0 : Math.max(0.15, d.xp / Math.max(1, maxYieldXP));
                       return (
                         <div key={i} className="w-[10px] h-[10px] rounded-sm transition-all" 
                              style={{ backgroundColor: d.xp === 0 ? 'rgba(255,255,255,0.03)' : `rgba(${rgbTheme}, ${intensity})` }} 
                              title={`${d.xp} XP on ${getLocalDateStr(d.date)}`}
                         />
                       );
                    })}
                 </div>
              </div>
            )}
         </SpatialCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mt-8">Active Shadows</h2>
        <div className="glass-card p-4 space-y-3">
          {habits.length === 0 && <p className="text-zinc-500 text-[14px] px-4 py-3 font-body">No shadows recorded.</p>}
          {habits.map((h: any, i: number) => (
            <div key={i} className="px-5 py-4 glass-recessed rounded-[1.5rem] text-zinc-300 text-[15px] font-body flex items-center gap-4 border border-white/[0.02]">
              <Pickaxe size={18} className="text-zinc-500 shrink-0" />
              <span className="leading-relaxed font-medium">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP WRAPPER
// ============================================================================
export default function App() {
  const [appData, setAppData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [toast, setToast] = useState<string | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [processingTasks, setProcessingTasks] = useState(new Set());
  
  const [timeBurn, setTimeBurn] = useState({
    day: { pct: 0, main: '0%', sub: '00:00' },
    month: { pct: 0, main: '0%', sub: '1st' },
    year: { pct: 0, main: '0%', sub: '1d' }
  });

  const [yieldRange, setYieldRange] = useState('7d');
  const fileInputRef = useRef<any>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const data = loadData();
    if (data) {
      if (!data.habits) data.habits = [];
      if (!data.notes) data.notes = [];
      if (!data.goals) data.goals = [];
      if (!data.tasks) data.tasks = [];
      if (data.profile && !data.profile.customBuffs) {
        data.profile.customBuffs = {
          buff1: { title: 'Extra Effort', xp: 100, lastClaimed: '' },
          buff2: { title: 'Perfect Day', xp: 100, lastClaimed: '' }
        };
      }
      setAppData(data);
    } else {
      const fresh = {
        version: 1,
        profile: {
          booted: false,
          codename: '',
          directive: '',
          score: 0,
          xpLogs: {},
          theme: '#00f0ff',
          joinedAt: 0,
          customBuffs: {
            buff1: { title: 'Extra Effort', xp: 100, lastClaimed: '' },
            buff2: { title: 'Perfect Day', xp: 100, lastClaimed: '' }
          }
        },
        habits: [],
        tasks: [],
        goals: [],
        notes: []
      };
      setAppData(fresh);
      saveData(fresh);
    }
    setIsLoading(false);
  }, []);

  const updateAppData = (updater: any) => {
    setAppData((prev: any) => {
      if (!prev) return prev;
      const updated = structuredClone(prev);
      updater(updated);
      saveData(updated);
      return updated;
    });
  };

  // Dynamic Progress Updates Hook (Runs every minute)
  useEffect(() => {
    let timerId: any;
    const scheduleUpdate = () => {
      const now = new Date();
      const curMin = now.getHours() * 60 + now.getMinutes();
      const dayPct = (curMin / 1440) * 100;
      const daysInMo = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const moPct = ((now.getDate() - 1 + curMin/1440) / daysInMo) * 100;
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - startOfYear.getTime();
      const exactDaysPassed = Math.floor(diff / (1000 * 60 * 60 * 24)) + (curMin / 1440);
      const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
      const yrPct = (exactDaysPassed / (isLeap ? 366 : 365)) * 100;

      setTimeBurn({ 
        day: { pct: dayPct, main: `${Math.floor(dayPct)}%`, sub: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }, 
        month: { pct: moPct, main: `${Math.floor(moPct)}%`, sub: getOrdinal(now.getDate()) }, 
        year: { pct: yrPct, main: `${Math.floor(yrPct)}%`, sub: Math.floor(exactDaysPassed) + 'd' } 
      });
      timerId = setTimeout(scheduleUpdate, 60000);
    };
    scheduleUpdate();
    return () => clearTimeout(timerId);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addXP = (amount: number) => {
    const curDateStr = getLocalDateStr();
    updateAppData((draft: any) => {
      draft.profile.score += amount;
      draft.profile.xpLogs[curDateStr] = (draft.profile.xpLogs[curDateStr] || 0) + amount;
    });
    showToast(`+${amount} XP Earned`);
  };

  const claimCustomBuff = (buffKey: string, buffObj: any, e: React.MouseEvent) => {
    const curDateStr = getLocalDateStr();
    if (buffObj.lastClaimed === curDateStr) return;
    
    playSound('streak');
    spawnParticles(e, 'High');
    
    updateAppData((draft: any) => {
      const buff = draft.profile.customBuffs[buffKey];
      if (buff.lastClaimed === curDateStr) return;
      buff.lastClaimed = curDateStr;
      draft.profile.score += buff.xp;
      draft.profile.xpLogs[curDateStr] = (draft.profile.xpLogs[curDateStr] || 0) + buff.xp;
    });
    showToast(`Claimed: ${buffObj.title}`);
  };

  const spawnParticles = (e: React.MouseEvent, priorityLevel: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const level = priorityLevel === 'High' || priorityLevel === 'high' ? 3 : priorityLevel === 'Medium' || priorityLevel === 'medium' ? 2 : 1;
    const count = level * 8 + 8; 
    
    const themeColor = appData?.profile?.theme || '#00f0ff';

    const newParticles = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * (90 * level);
      return {
        id: Math.random() + Date.now(), x, y,
        tx: `${Math.cos(angle) * dist}px`, ty: `${Math.sin(angle) * dist}px`,
        rot: `${Math.random() * 360}deg`, life: `${0.5 + Math.random() * 0.5}s`,
        icon: [Zap, Sparkles, Flame, Target][Math.floor(Math.random() * 4)],
        color: [themeColor, '#6366f1', '#ff00ff', '#FFFFFF'][Math.floor(Math.random() * 4)],
        size: 10 + Math.random() * 12
      };
    });
    setParticles(prev => [...prev, ...newParticles].slice(-40));
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 1200);
  };

  const executeTask = (p: any, e: React.MouseEvent) => {
    if (p.completed || processingTasks.has(p.id)) return;
    setProcessingTasks(prev => new Set(prev).add(p.id)); 
    playSound('complete');
    spawnParticles(e, p.priority);
    
    const xp = getTaskWeight(p.priority) * 10;
    
    updateAppData((draft: any) => {
      const task = draft.tasks.find((t: any) => t.id === p.id);
      if (!task || task.completed) return;
      task.completed = true;
      task.completedAt = Date.now();
      draft.profile.score += xp;
      draft.profile.xpLogs[getLocalDateStr()] = (draft.profile.xpLogs[getLocalDateStr()] || 0) + xp;

      if (task.goalId) {
        const goal = draft.goals.find((g: any) => g.id == task.goalId);
        if (goal && goal.current < goal.target) {
          goal.current += 1;
          goal.lastDone = getLocalDateStr();
          goal.lastDoneTime = Date.now();
        }
      }
    });

    setProcessingTasks(prev => { const s = new Set(prev); s.delete(p.id); return s; });
    showToast(`Task complete (+${xp} XP)`);
  };

  const changeTheme = (color: string) => {
    updateAppData((draft: any) => {
      draft.profile.theme = color;
    });
    showToast("Theme recalibrated.");
  };

  const handleExport = () => {
    if (!appData) return;
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FocusFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast("Data exported securely.");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (typeof reader.result === 'string') {
          const data = JSON.parse(reader.result);
          if (data.profile) {
            setAppData(data);
            saveData(data);
            showToast("Identity Restored.");
          } else {
            showToast("Invalid backup file.");
          }
        }
      } catch (err) {
        showToast("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const getYieldData = (range: string) => {
    const daysToMap = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    return Array.from({length: daysToMap}).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - ((daysToMap - 1) - i));
      const xp = appData?.profile?.xpLogs?.[getLocalDateStr(d)] || 0;
      return { date: d, xp };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="text-[#00f0ff] animate-spin" size={32} />
      </div>
    );
  }

  if (appData && !appData.profile.booted) {
    return (
      <div className="min-h-screen bg-[#030303] text-white font-body flex justify-center overflow-hidden antialiased selection:bg-blue-500/30 relative">
        <InjectedStyles />
        <div className="absolute inset-0 pointer-events-none bg-grid opacity-20 z-0" />
        <div className="w-full max-w-[428px] h-[100dvh] relative z-10 bg-[#030303]/80 shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.02)] border-x border-white/[0.04]">
          <Onboarding onComplete={(data: any) => {
            playSound('boot');
            updateAppData((draft: any) => {
              draft.profile.booted = true;
              draft.profile.codename = data.name || 'User';
              draft.profile.directive = data.directive || 'Survive one more day';
              draft.profile.avatarUrl = data.avatarUrl || '';
              draft.profile.joinedAt = Date.now();
              draft.habits = data.habits || [];
              draft.goals = (data.goals || []).map((g: any) => ({
                id: g.id,
                title: g.text,
                timeline: 'Daily',
                target: 30,
                current: 0,
                createdAt: Date.now()
              }));
              if (data.deepDiveNote) {
                draft.notes.unshift({
                  id: Date.now(),
                  title: data.deepDiveNote.title,
                  content: data.deepDiveNote.content,
                  createdAt: Date.now(),
                  date: new Date().toLocaleDateString()
                });
              }
            });
          }} />
        </div>
      </div>
    );
  }

  const currentTheme = appData?.profile?.theme || '#00f0ff';
  const yieldData = getYieldData(yieldRange);
  const maxYieldXP = Math.max(...Object.values(appData?.profile?.xpLogs || {}).map(v => Number(v)), 100);
  const rgbTheme = hexToRgb(currentTheme);

  // Compute execution progress for today
  const curDateStr = getLocalDateStr();
  const todayTasks = (appData?.tasks || []).filter((t: any) => t.deadline === curDateStr || (!t.completed && t.deadline < curDateStr));
  const totalWeight = todayTasks.reduce((sum: number, t: any) => sum + getTaskWeight(t.priority), 0);
  const completedWeight = todayTasks.filter((t: any) => t.completed).reduce((sum: number, t: any) => sum + getTaskWeight(t.priority), 0);
  const dailyProgressPct = totalWeight === 0 ? 0 : (completedWeight / totalWeight) * 100;

  const buff1 = appData?.profile?.customBuffs?.buff1 || { title: 'Extra Effort', xp: 100, lastClaimed: '' };
  const buff2 = appData?.profile?.customBuffs?.buff2 || { title: 'Perfect Day', xp: 100, lastClaimed: '' };

  const tabs = [
    { id: 'Dashboard', icon: BarChart2 },
    { id: 'Tasks', icon: CheckCircle2 },
    { id: 'Goals', icon: Target },
    { id: 'Notes', icon: FileText },
    { id: 'Stats', icon: Sliders },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#030303] text-white font-body flex justify-center overflow-hidden antialiased selection:bg-blue-500/30 relative" style={{ '--theme-color': currentTheme } as any}>
        <InjectedStyles />
        
        {/* Universal Background Setup */}
        <div className="absolute inset-0 z-0 bg-grid opacity-10 pointer-events-none" />

        {/* Main Mobile/App Container */}
        <div className="w-full max-w-[428px] h-[100dvh] relative flex flex-col z-10 bg-[#050505]/40 backdrop-blur-[80px] shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)] border-x border-white/[0.05] transform-gpu">
          
          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-14">
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                userData={appData.profile} 
                tasks={appData.tasks} 
                setTasks={(tasks: any) => updateAppData((draft: any) => { draft.tasks = typeof tasks === 'function' ? tasks(draft.tasks) : tasks; })} 
                addXP={addXP} 
                buff1={buff1}
                buff2={buff2}
                claimCustomBuff={claimCustomBuff}
                timeBurn={timeBurn}
                dailyProgressPct={dailyProgressPct}
                goals={appData.goals}
                setGoals={(goals: any) => updateAppData((draft: any) => { draft.goals = typeof goals === 'function' ? goals(draft.goals) : goals; })}
                showToast={showToast}
                executeTask={executeTask}
              />
            )}
            {activeTab === 'Tasks' && (
              <TasksTab 
                tasks={appData.tasks} 
                setTasks={(tasks: any) => updateAppData((draft: any) => { draft.tasks = typeof tasks === 'function' ? tasks(draft.tasks) : tasks; })} 
                addXP={addXP} 
                goals={appData.goals}
                executeTask={executeTask}
              />
            )}
            {activeTab === 'Goals' && (
              <GoalsTab 
                goals={appData.goals} 
                setGoals={(goals: any) => updateAppData((draft: any) => { draft.goals = typeof goals === 'function' ? goals(draft.goals) : goals; })} 
                addXP={addXP} 
              />
            )}
            {activeTab === 'Notes' && (
              <NotesTab 
                notes={appData.notes} 
                setNotes={(notes: any) => updateAppData((draft: any) => { draft.notes = typeof notes === 'function' ? notes(draft.notes) : notes; })} 
                showToast={showToast} 
              />
            )}
            {activeTab === 'Stats' && (
              <StatsTab 
                userData={appData.profile} 
                habits={appData.habits} 
                showToast={showToast}
                handleExport={handleExport} 
                fileInputRef={fileInputRef} 
                handleImport={handleImport}
                currentTheme={currentTheme}
                changeTheme={changeTheme}
                yieldRange={yieldRange}
                setYieldRange={setYieldRange}
                yieldData={yieldData}
                maxYieldXP={maxYieldXP}
                rgbTheme={rgbTheme}
                updateProfile={(fields: any) => updateAppData((draft: any) => { draft.profile = { ...draft.profile, ...fields }; })}
              />
            )}
          </main>

          {/* Dynamic Island Floating Bottom Navigation Dock */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] z-40">
            <nav className="pointer-events-auto glass-card rounded-[2.5rem] p-2.5 shadow-[0_30px_60px_-12px_rgba(0,0,0,1)] border border-white/[0.1] bg-[#0a0a0a]/90">
              <div className="flex justify-between items-center px-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  // Make the middle item (Goals/Target) the prominent CTA button
                  if (tab.id === 'Goals') {
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-magenta-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] mx-2 hover:scale-110 active:scale-95 transition-all relative z-20 border border-white/30"
                      >
                        <Icon size={28} />
                      </button>
                    )
                  }

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-full transition-all duration-400 relative overflow-hidden group ${
                        isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 rounded-full" />
                      )}
                      <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-400 z-10`}>
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* 3D Toast Notification */}
          {toast && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 glass-card px-7 py-4 rounded-full flex items-center gap-4 z-50 animate-cinematic shadow-[0_20px_40px_rgba(0,0,0,0.9)] border border-blue-500/30 border-t-blue-400/50 bg-[#0a0a0a]/95 w-max">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-white font-display font-bold text-[14px] tracking-wide">{toast}</span>
            </div>
          )}
        </div>

        {/* Reintroduced Completion Particle Rendering */}
        {particles.map(p => {
          const Icon = p.icon;
          return <div key={p.id} className="particle" style={{ left: p.x, top: p.y, '--tx': p.tx, '--ty': p.ty, '--rot': p.rot, '--life': p.life, color: p.color } as any}><Icon size={p.size} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" /></div>;
        })}
      </div>
    </ErrorBoundary>
  );
}