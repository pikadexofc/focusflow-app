import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, Circle, Plus, 
  Target, FileText, BarChart2, Download, Upload,
  Shield, ArrowRight, Moon, Pickaxe, Heart, Sliders,
  Sparkles, Zap, Layers, ChevronRight
} from 'lucide-react';

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
      background: linear-gradient(180deg, var(--glow-blue) 0%, var(--glow-violet) 100%);
      color: #ffffff;
      border-top: 1px solid rgba(255,255,255,0.6);
      border-bottom: 2px solid rgba(0,0,0,0.4);
      box-shadow: 
        0 15px 35px -5px rgba(99, 102, 241, 0.5),
        0 5px 15px rgba(0, 0, 0, 0.6),
        inset 0 -2px 5px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .btn-primary-3d:hover:not(:disabled) {
      background: linear-gradient(180deg, #4ade80 0%, var(--glow-lime) 100%);
      color: #000;
      border-top: 1px solid #d9f99d;
      box-shadow: 
        0 20px 40px -5px rgba(132, 204, 22, 0.4),
        0 8px 20px rgba(0, 0, 0, 0.6);
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

interface GlowingOrbProps {
  color: string;
  size: string;
  className?: string;
  style?: React.CSSProperties;
}

const GlowingOrb = ({ color, size, className = '', style }: GlowingOrbProps) => (
  <div 
    className={`absolute rounded-full mix-blend-screen pointer-events-none animate-drift ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: 'blur(70px)',
      ...style
    }}
  />
);

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

const SpatialCard = ({ children, className = '', padding = 'p-6', showOrbs = false }: SpatialCardProps) => (
  <div className={`glass-card ${className}`}>
    {showOrbs && (
      <>
        <GlowingOrb color="rgba(0, 240, 255, 0.05)" size="150px" className="top-0 -left-10" />
        <GlowingOrb color="rgba(255, 0, 255, 0.03)" size="200px" className="bottom-0 -right-10" />
      </>
    )}
    <div className={`relative z-10 ${padding}`}>
      {children}
    </div>
  </div>
);

const TactileButton = ({ children, onClick, className = '', disabled = false }) => (
  <button disabled={disabled} onClick={onClick} className={`btn-tactile rounded-[1.25rem] py-3.5 px-4 font-display font-medium text-[14px] flex justify-center items-center gap-2 text-white/90 w-full ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}>
    {children}
  </button>
);

const Primary3DButton = ({ children, onClick, className = '', disabled = false }) => (
  <button disabled={disabled} onClick={onClick} className={`btn-primary-3d rounded-[1.25rem] py-4 px-4 font-display font-bold text-[15px] flex justify-center items-center gap-2 w-full tracking-wide ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${className}`}>
    {children}
  </button>
);

const SegmentedControl3D = ({ options, selected, onChange }) => (
  <div className="flex p-1 glass-recessed rounded-[1.25rem] relative w-full">
    {options.map(opt => (
      <button
        key={opt.id} onClick={() => onChange(opt.id)}
        className={`flex-1 py-2.5 text-[12px] font-display font-semibold rounded-xl transition-all duration-400 z-10 relative ${
          selected === opt.id ? 'text-black drop-shadow-sm' : 'text-zinc-500 hover:text-white'
        }`}
      >
        {opt.label}
      </button>
    ))}
    <div 
      className="absolute top-1 bottom-1 bg-gradient-to-r from-[#00f0ff] to-[#6366f1] rounded-xl shadow-[0_2px_10px_rgba(99,102,241,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all duration-500 z-0"
      style={{
        width: `calc(${100 / options.length}% - 4px)`,
        left: `calc(${options.findIndex(o => o.id === selected) * (100 / options.length)}% + 2px)`
      }}
    />
  </div>
);

const ProgressRing = ({ progress, size = 60, stroke = 6, label, gradientId = "ringGradPrimary" }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
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
// 3. CINEMATIC ONBOARDING (16-Step Psychological Ritual from Document)
// ============================================================================
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [name, setName] = useState('');
  const [inputText, setInputText] = useState('');
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [deepDiveText, setDeepDiveText] = useState('');

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setIsTransitioning(false);
    }, 1000); 
  };

  const addItem = (listSetter, list) => {
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
      onComplete({ name: name || 'User', habits, goals, deepDiveNote });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col px-8 pt-20 pb-16 relative z-10 overflow-hidden">
      
      {/* Ambient Onboarding Backgrounds */}
      <GlowingOrb color="rgba(0, 240, 255, 0.15)" size="400px" className="top-0 -left-20" />
      <GlowingOrb color="rgba(255, 0, 255, 0.1)" size="500px" className="bottom-0 -right-20 animate-drift" style={{ animationDelay: '-3s' }} />

      <div key={step} className={`flex-1 flex flex-col relative z-10 ${isTransitioning ? 'animate-cinematic-out pointer-events-none' : ''}`}>
        
        {/* Screen 1: Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Hello, and welcome.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">The outside world can feel very loud.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Here, there’s no judgment and no hurry.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-12 animate-cinematic delay-3000">Take off your mask and relax. This is your space – you control it.</p>
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
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-3000">We’ll slow down and breathe together.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-4000">
              <TactileButton onClick={handleNext}>Take a breath</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 3: Identity */}
        {step === 2 && (
          <div className="flex-1 flex flex-col pt-10">
            <h2 className="text-3xl font-display font-bold text-white mb-4 animate-cinematic">What would you like to be called here?</h2>
            <p className="text-sm font-body text-zinc-400 mb-10 animate-cinematic delay-500">(You can use your name, a nickname, or anything you like.)</p>
            <div className="animate-cinematic delay-1000">
              <div className="glass-card p-2 mb-8 group border border-white/[0.05] focus-within:border-blue-500/30 transition-colors">
                <div className="bg-black/40 rounded-[1.5rem] p-4 relative overflow-hidden">
                  <input 
                    type="text" placeholder="Your name..."
                    className="w-full bg-transparent text-white text-2xl outline-none font-display placeholder:text-zinc-700 relative z-10"
                    value={name} onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
              </div>
              <Primary3DButton onClick={handleNext}>Continue</Primary3DButton>
              <p className="text-center text-xs text-zinc-500 mt-6 font-body animate-cinematic delay-1500">This space is yours, and you can always change it later.</p>
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">This is your private space – you’re in complete control.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-2000">Everything you write stays on this device.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-3000">Nothing is ever sent to the cloud or shared. Your privacy is protected.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 5: Metaphor */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Let’s try a different perspective.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Think of your mind as a hidden cave filled with treasures – ideas and strengths you haven’t discovered yet.</p>
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
            <h2 className="text-2xl font-display font-bold text-white mb-6 animate-cinematic">Let’s begin by noting anything you’d like to change or let go of – without judging yourself.</h2>
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
                  onKeyDown={(e) => e.key === 'Enter' && addItem(setHabits, habits)}
                />
                <button className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:scale-105 transition-transform" onClick={() => addItem(setHabits, habits)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {habits.length === 0 ? (
              <div className="text-center mt-4">
                <p className="text-xs font-body text-zinc-500 animate-cinematic delay-1000">Write short bullet points. Don’t edit yourself – just get it out.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
                {habits.map((h) => (
                  <div key={h.id} className="glass-card p-4 rounded-[1.25rem] flex items-center gap-4 animate-cinematic">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-magenta-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                    <span className="font-body text-sm text-zinc-200">{h.text}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 mt-auto">
              <Primary3DButton onClick={handleNext} disabled={habits.length === 0 && inputText.length === 0}>
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
                  key={h.id} onClick={() => { setSelectedHabitId(h.id); handleNext(); }}
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
              <p>Let your thoughts pour out naturally – don’t worry about editing.</p>
              <p>You might ask yourself: 'Why does this happen? What is it protecting me from? Am I angry or afraid of something?'</p>
            </div>
            
            <div className="pt-6 mt-auto">
              <Primary3DButton onClick={handleNext}>Save Story</Primary3DButton>
            </div>
          </div>
        )}

        {/* Screen 11: Reflection */}
        {step === 10 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Take a breath and read over what you wrote.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Everything you wrote is human and understandable.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">These thoughts and feelings are real parts of you, and bringing them into the light is a brave act.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-3000">There’s nothing ‘wrong’ or disgusting here – it just shows you care about improving. Treat yourself with the same kindness you’d offer a friend.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-4000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 12: Realization */}
        {step === 11 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">How do you feel right now?</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1000">Maybe a little lighter or proud?</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Confronting this is powerful—it takes courage.</p>
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
            <div className="w-24 h-24 glass-card rounded-[2rem] flex items-center justify-center animate-float mb-8 animate-cinematic">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-magenta-500/20" />
              <Moon size={40} className="text-white relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic delay-1000">Now imagine yourself years from today.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">If things stay the same, those habits will still be running your life – what might that life look like?</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-3000">Remember, big changes come from small steps over time.</p>
            <p className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500 mb-12 animate-cinematic delay-4000 drop-shadow-lg">The door isn’t closed on you: you can start changing course today. You’re exactly where you need to be.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-5000">
              <TactileButton onClick={handleNext}>Step Forward</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 14: Goals Input */}
        {step === 13 && (
          <div className="flex-1 flex flex-col h-full animate-cinematic pt-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">What would you do differently from now on?</h2>
            <p className="text-sm font-body text-zinc-400 mb-6">List the goals or changes you want in your life – even small ones. (They don’t all have to happen, just focus on enough to move in a better direction.)</p>
            
            <div className="glass-card p-[1px] mb-6">
              <div className="bg-black/50 rounded-[2rem] p-2 flex items-center">
                <input 
                  className="bg-transparent flex-1 px-4 outline-none text-white font-body text-sm placeholder:text-zinc-600"
                  placeholder="e.g. Read 10 pages, sleep earlier..."
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem(setGoals, goals)}
                />
                <button className="bg-gradient-to-r from-lime-400 to-green-500 text-black p-3 rounded-xl shadow-[0_0_15px_rgba(132,204,22,0.5)] hover:scale-105 transition-transform" onClick={() => addItem(setGoals, goals)}>
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
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-lime-400 to-green-500 shadow-[0_0_8px_rgba(132,204,22,0.8)]" />
                  <span className="font-body text-sm text-zinc-200">{g.text}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 mt-auto">
              <Primary3DButton onClick={handleNext} disabled={goals.length === 0 && inputText.length === 0}>{goals.length > 0 ? "Continue" : "Skip for now"}</Primary3DButton>
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
                  <span className="text-xs font-body text-zinc-400">are your daily actions – the little stones you move.</span>
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
            <p className="text-lg font-display font-bold text-white animate-cinematic delay-4000 mb-8">You’re ready to start—go at your own pace.</p>
            
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

const DashboardTab = ({ userData, tasks, setTasks, addXP }) => {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  const weightMap = { low: 1, medium: 2, high: 3 };
  const totalWeight = tasks.reduce((sum, t) => sum + weightMap[t.priority], 0) || 1;
  const completedWeight = completedTasks.reduce((sum, t) => sum + weightMap[t.priority], 0);
  const executionPercent = Math.min(100, Math.round((completedWeight / totalWeight) * 100));

  const now = new Date();
  const dayProgress = (now.getHours() / 24) * 100;
  const monthProgress = (now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100;
  const yearProgress = (now.getMonth() / 12) * 100;

  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-magenta-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)] border border-white/20">
            <span className="font-display font-bold text-2xl text-white drop-shadow-md">{userData.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white leading-none tracking-tight">Agent {userData.name}</h1>
            <p className="text-[10px] font-display text-blue-400 uppercase tracking-widest mt-1.5 font-bold">Survive one more day</p>
          </div>
        </div>
        <div className="glass-recessed px-5 py-3 rounded-[1.5rem] border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] text-center min-w-[80px]">
          <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-magenta-400 drop-shadow-sm">{userData.xp}</span>
          <p className="text-[9px] text-zinc-500 font-display font-bold tracking-widest uppercase mt-1">Total XP</p>
        </div>
      </header>

      <SpatialCard padding="p-8" showOrbs={true}>
        <div className="flex justify-around items-center relative z-10">
          <ProgressRing progress={dayProgress} label="Day" gradientId="ringGradAccent" />
          <div className="relative">
            <ProgressRing progress={monthProgress} label="Month" size={100} stroke={8} gradientId="ringGradPrimary" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse border-2 border-magenta-500" />
          </div>
          <ProgressRing progress={yearProgress} label="Year" gradientId="ringGradLime" />
        </div>
      </SpatialCard>

      <div className="glass-card p-6 border-t border-t-blue-500/30 hover:scale-[1.01] transition-transform">
        <div className="flex justify-between text-[11px] font-display font-bold tracking-widest text-zinc-400 uppercase mb-4">
          <div className="flex items-center gap-2"><Zap size={16} className="text-blue-400"/> Execution Protocol</div>
          <span className="text-white bg-white/10 px-2.5 py-1 rounded-lg shadow-inner">{executionPercent}%</span>
        </div>
        <div className="h-4 rounded-full bg-black shadow-[inset_0_4px_8px_rgba(0,0,0,1)] relative overflow-hidden border border-white/[0.05]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-magenta-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] transition-all duration-1000 ease-out relative"
            style={{ width: `${executionPercent}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] opacity-60" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-[12px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mb-4">Action Queue</h2>
        {activeTasks.length === 0 ? (
          <div className="glass-recessed p-10 rounded-[2rem] text-center text-zinc-500 font-body text-sm border border-white/[0.02]">
            Queue is clear. Rest or deploy.
          </div>
        ) : (
          <div className="space-y-4">
            {activeTasks.sort((a,b) => weightMap[b.priority] - weightMap[a.priority]).slice(0, 3).map(task => (
              <div key={task.id} className="glass-card p-5 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/[0.05] border-l-4" style={{borderLeftColor: task.priority === 'high' ? '#ff00ff' : task.priority === 'medium' ? '#00f0ff' : 'transparent'}}>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: true } : t));
                  addXP(weightMap[task.priority] * 10);
                }}>
                  <Circle className="text-zinc-500 group-hover:text-blue-400 transition-colors w-7 h-7" />
                </button>
                <div className="flex-1">
                  <p className="text-white font-body text-[16px] font-medium leading-tight">{task.title}</p>
                </div>
              </div>
            ))}
            {activeTasks.length > 3 && (
              <p className="text-center text-[10px] font-display text-zinc-500 mt-4 uppercase tracking-widest bg-black/40 rounded-full py-2.5 w-max mx-auto px-5 border border-white/5">+{activeTasks.length - 3} more tasks</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TasksTab = ({ tasks, setTasks, addXP }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), title: newTask, priority, completed: false }, ...tasks]);
    setNewTask('');
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 pb-32 animate-cinematic h-full flex flex-col">
      <div className="flex justify-between items-end px-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">Tasks</h1>
        <Badge text="PROTOCOL" colorClass="bg-blue-500/20 text-blue-300 border-blue-500/30" />
      </div>
      
      <SpatialCard padding="p-6" className="shrink-0 border-t border-t-blue-500/30">
        <div className="glass-recessed rounded-[1.25rem] p-4 mb-5 border border-white/[0.02] focus-within:border-blue-500/40 transition-colors shadow-inner">
          <input 
            className="w-full bg-transparent text-white font-body text-[16px] outline-none placeholder:text-zinc-500"
            placeholder="Define next action..."
            value={newTask} onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
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
          <button className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-magenta-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)] text-white hover:scale-105 active:scale-95 transition-transform border border-white/20" onClick={handleAddTask}>
            <Plus size={24} />
          </button>
        </div>
      </SpatialCard>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        <div className="space-y-4">
          <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2">Active Targets</h2>
          {activeTasks.length === 0 && <p className="text-zinc-600 text-[14px] px-2 font-body">No tasks deployed.</p>}
          {activeTasks.map(task => (
            <div key={task.id} className="glass-card p-5 rounded-[1.5rem] flex items-center gap-4 group">
              <button onClick={() => {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: true } : t));
                const weightMap = { low: 1, medium: 2, high: 3 };
                addXP(weightMap[task.priority] * 10);
              }}>
                <Circle className="text-zinc-600 group-hover:text-blue-400 transition-colors w-7 h-7" />
              </button>
              <div className="flex-1">
                <p className="text-white font-body text-[16px] font-medium leading-tight">{task.title}</p>
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
            {completedTasks.map(task => (
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

const GoalsTab = ({ goals, setGoals, addXP }) => {
  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <div className="px-2">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2">Milestones</h1>
        <p className="text-zinc-400 text-[14px] font-body">Automated recurring missions.</p>
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16 glass-recessed rounded-[2rem] text-zinc-500 font-body text-[15px] border border-white/[0.02]">
          No active milestones.
        </div>
      )}

      <div className="space-y-6">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const isComplete = goal.current >= goal.target;
          return (
            <SpatialCard key={goal.id} padding="p-8" className="border-t border-t-magenta-500/30">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-white font-display font-bold text-2xl leading-tight mb-2">{goal.title}</h3>
                  <Badge text={goal.frequency} colorClass="bg-magenta-500/10 text-magenta-300 border-magenta-500/20" />
                </div>
                <div className="glass-recessed px-5 py-3 rounded-2xl border border-white/5 text-center shadow-lg">
                  <span className="text-3xl font-display font-bold text-white leading-none">{goal.current}</span>
                  <div className="text-[11px] font-display text-zinc-500 uppercase tracking-widest mt-1">/ {goal.target}</div>
                </div>
              </div>
              
              <div className="h-4 glass-recessed rounded-full overflow-hidden p-[1px] mb-8 shadow-[inset_0_4px_8px_rgba(0,0,0,1)]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 relative ${isComplete ? 'bg-magenta-500 shadow-[0_0_15px_rgba(217,70,239,0.9)]' : 'bg-gradient-to-r from-blue-500 to-magenta-500 shadow-[0_0_10px_rgba(217,70,239,0.6)]'}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] opacity-60" />
                </div>
              </div>

              <Primary3DButton 
                disabled={isComplete}
                onClick={() => {
                  if (!isComplete) {
                    setGoals(goals.map(g => g.id === goal.id ? { ...g, current: g.current + 1 } : g));
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

const NotesTab = ({ notes, setNotes, showToast }) => {
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
      
      {/* Sleek Frosted Glass Editor (Upgraded from Paper) */}
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
        {notes.map(note => (
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

const StatsTab = ({ userData, habits, showToast, handleExport, fileInputRef, handleImport }) => {
  return (
    <div className="space-y-6 pb-32 animate-cinematic">
      <h1 className="text-4xl font-display font-bold text-white px-2 tracking-tighter">System</h1>
      
      <SpatialCard padding="p-8" className="flex flex-col items-center text-center gap-6 border-t border-t-lime-500/40">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 via-green-500 to-blue-600 p-[3px] shadow-[0_0_30px_rgba(132,204,22,0.5)]">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-lime-400 to-blue-500">{userData.name.charAt(0) || 'S'}</span>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white drop-shadow-md leading-tight">{userData.name}</h2>
          <div className="mt-3 flex justify-center">
            <Badge text={`Level ${Math.floor(userData.xp / 100) + 1} Cleanser`} colorClass="bg-lime-500/15 text-lime-400 border-lime-500/30 px-4 py-2 text-sm" />
          </div>
        </div>
      </SpatialCard>

      <div className="space-y-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mt-8">Data Protection</h2>
        <div className="glass-card p-3 space-y-2">
          <div className="p-5 flex items-center justify-between bg-black/40 rounded-2xl hover:bg-black/60 transition-colors border border-white/[0.02]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Download size={20} />
              </div>
              <div>
                <p className="text-[16px] font-display font-bold text-white">System Backup</p>
                <p className="text-[12px] font-body text-zinc-500 mt-1">Save local data securely</p>
              </div>
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform" onClick={handleExport}>Export</button>
          </div>

          <div className="p-5 flex items-center justify-between bg-black/40 rounded-2xl hover:bg-black/60 transition-colors border border-white/[0.02]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1rem] bg-magenta-500/10 border border-magenta-500/30 flex items-center justify-center text-magenta-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-[16px] font-display font-bold text-white">Restore Data</p>
                <p className="text-[12px] font-body text-zinc-500 mt-1">Load previous .json file</p>
              </div>
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform" onClick={() => fileInputRef.current.click()}>Import</button>
            <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImport} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2 mt-8">Active Shadows</h2>
        <div className="glass-card p-4 space-y-3">
          {habits.length === 0 && <p className="text-zinc-500 text-[14px] px-4 py-3 font-body">No shadows recorded.</p>}
          {habits.map((h, i) => (
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
  const [appState, setAppState] = useState('onboarding'); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [toast, setToast] = useState(null);

  // Core Data State (In-Memory for strict local-first compliance)
  const [userData, setUserData] = useState({ name: '', xp: 0 });
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addXP = (amount) => {
    setUserData(prev => ({ ...prev, xp: prev.xp + amount }));
    showToast(`+${amount} XP Earned`);
  };

  const handleExport = () => {
    const data = { userData, habits, tasks, goals, notes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShadowCleanser_Backup_${new Date().toISOString().split('T')[0]}.json`;
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
          if (data.userData) setUserData(data.userData);
          if (data.habits) setHabits(data.habits);
          if (data.tasks) setTasks(data.tasks);
          if (data.goals) setGoals(data.goals);
          if (data.notes) setNotes(data.notes);
          showToast("Identity Restored.");
        }
      } catch (err) {
        showToast("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#030303] text-white font-body flex justify-center overflow-hidden antialiased selection:bg-blue-500/30 relative">
        <InjectedStyles />
        <div className="absolute inset-0 pointer-events-none bg-grid opacity-20 z-0" />
        <div className="w-full max-w-[428px] h-[100dvh] relative z-10 bg-[#030303]/80 shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.02)] border-x border-white/[0.04]">
          <Onboarding onComplete={(data) => {
            setUserData({ name: data.name, xp: 0 });
            setHabits(data.habits);
            setGoals(data.goals.map(g => ({ id: g.id, title: g.text, target: 30, current: 0, frequency: 'daily' })));
            
            // Integrate Deep Dive into Notes Vault
            if (data.deepDiveNote) {
              setNotes([{ id: Date.now(), ...data.deepDiveNote, date: new Date().toLocaleDateString() }]);
            }
            
            setAppState('main');
          }} />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'Dashboard', icon: BarChart2 },
    { id: 'Tasks', icon: CheckCircle2 },
    { id: 'Goals', icon: Target },
    { id: 'Notes', icon: FileText },
    { id: 'Stats', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-body flex justify-center overflow-hidden antialiased selection:bg-blue-500/30 relative">
      <InjectedStyles />
      
      {/* Universal Background Setup */}
      <div className="absolute inset-0 z-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <GlowingOrb color="rgba(0, 240, 255, 0.15)" size="600px" className="top-0 -left-40" />
         <GlowingOrb color="rgba(255, 0, 255, 0.1)" size="500px" className="bottom-0 -right-20 animate-drift" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Main Mobile/App Container */}
      <div className="w-full max-w-[428px] h-[100dvh] relative flex flex-col z-10 bg-[#050505]/40 backdrop-blur-[80px] shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)] border-x border-white/[0.05] transform-gpu">
        
        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-14">
          {activeTab === 'Dashboard' && <DashboardTab userData={userData} tasks={tasks} setTasks={setTasks} addXP={addXP} />}
          {activeTab === 'Tasks' && <TasksTab tasks={tasks} setTasks={setTasks} addXP={addXP} />}
          {activeTab === 'Goals' && <GoalsTab goals={goals} setGoals={setGoals} addXP={addXP} />}
          {activeTab === 'Notes' && <NotesTab notes={notes} setNotes={setNotes} showToast={showToast} />}
          {activeTab === 'Stats' && <StatsTab 
            userData={userData} habits={habits} showToast={showToast}
            handleExport={handleExport} handleImport={handleImport} fileInputRef={fileInputRef}
          />}
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
                      onClick={() => setActiveTab(tab.id)}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-magenta-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(217,70,239,0.5)] mx-2 hover:scale-110 active:scale-95 transition-all relative z-20 border border-white/30"
                    >
                      <Icon size={28} />
                    </button>
                  )
                }

                return (
                  <button
                    key={tab.id}
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
                      {isActive && (
                        <div className="absolute inset-0 bg-blue-500/40 blur-[10px] rounded-full pointer-events-none" />
                      )}
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
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse" />
            <span className="text-white font-display font-bold text-[14px] tracking-wide">{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}