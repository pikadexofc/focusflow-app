/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Zap, Target, Database, BarChart3, CheckCircle2, Circle, 
  Lock, LayoutGrid, Calendar, User, Flame, Loader2, Sparkles, Check, ArrowRight, Shield, Plus, Edit2, Save, X, Download, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'focusflow_v1';

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// --- CORE DESIGN TOKENS ---
const TOKENS = {
  bgBase: '#050508', 
  solarOrange: '#FF5A00',
  royalAmethyst: '#8B5CF6',
  cyanGlow: '#00E5FF',
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
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 text-white text-center font-heading">
          <Shield size={48} className="text-[#FF5A00] mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">System Interruption</h1>
          <p className="text-[#A1A1AA] text-sm mb-6 max-w-xs">An unexpected anomaly occurred in the atmospheric engine. Please reboot the environment.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Reboot Core</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- UTILITIES ---
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
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'streak') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(440, now + 0.1); 
      osc.frequency.setValueAtTime(880, now + 0.2); 
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    }
  } catch (e) { console.error("Audio error skipped"); }
};

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const format12Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${m} ${suffix}`;
};

const getLocalDateStr = (d = new Date()) => {
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 90, 0';
};

// --- COMPONENTS ---

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const end = Number(value) || 0;
    const duration = 2000;

    let frameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeProgress * end));
      if (progress < 1) frameId = window.requestAnimationFrame(step);
      else setDisplayValue(end);
    };
    frameId = window.requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
};

const RayCard = ({ children, className = "", onClick = undefined }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void, key?: any }) => (
  <div 
    onClick={onClick}
    className={`group relative rounded-[24px] overflow-hidden z-0 transition-transform duration-300 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
  >
    <div 
      className="absolute inset-0 rounded-[24px] pointer-events-none z-0 overflow-hidden"
      style={{
        padding: '1.5px',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      } as any}
    >
      <div className="absolute inset-[-100%] ray-slow"
           style={{ background: 'conic-gradient(from 0deg, transparent 40%, var(--theme-color) 85%, transparent 100%)' }} />
      <div className="absolute inset-[-100%] ray-fast"
           style={{ background: 'conic-gradient(from 0deg, transparent 40%, var(--theme-color) 85%, transparent 100%)' }} />
    </div>

    <div 
      className="absolute inset-[1.5px] rounded-[22.5px] z-10 backdrop-blur-[24px]"
      style={{ 
        backgroundColor: 'rgba(18, 18, 22, 0.65)',
        boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.05), inset 0 -10px 20px 0 rgba(0,0,0,0.5)',
      }} 
    />
    
    <div className="absolute inset-[1.5px] rounded-[22.5px] z-10 pointer-events-none mix-blend-screen opacity-[0.03] bg-gradient-to-br from-white/40 via-transparent to-[var(--theme-color)]" />

    <div className={`relative z-20 h-full w-full flex flex-col ${className.includes('!p-') || className.includes('p-') ? '' : 'p-4'}`}>
      {children}
    </div>
  </div>
);

const SpatialButton = ({ children, onClick, type="button", icon: Icon = ArrowRight, className="" }: any) => (
  <button type={type} onClick={onClick} className={`spatial-pill group ${className}`}>
     <span className="spatial-pill-text">{children}</span>
     <div className="spatial-pill-knob">
        <Icon size={18} className="text-white" />
     </div>
  </button>
);

const AnimatedProgressBar = ({ progress, label, val }: any) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] text-[#A1A1AA] font-semibold tracking-wider uppercase">{label}</span>
      <span className="text-[11px] font-heading text-white font-bold">{val}</span>
    </div>
    <div className="h-[6px] w-full bg-[rgba(0,0,0,0.4)] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.05)] relative">
      <div 
        className="h-full relative rounded-full animate-draw-w" 
        style={{ 
          '--target-w': `${Math.max(0, Math.min(progress || 0, 100))}%`,
          background: `linear-gradient(90deg, ${TOKENS.royalAmethyst}, var(--theme-color))`
        } as any}
      >
         {progress > 0 && (
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md z-10" />
         )}
      </div>
    </div>
  </div>
);

const HeroRing = ({ progress, label, mainText, subText, size = 100 }: any) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, Math.min(progress || 0, 100)) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id={`ringGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={TOKENS.royalAmethyst} />
              <stop offset="100%" stopColor="var(--theme-color)" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(0,0,0,0.5)" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} fill="none" />
          
          <circle
            cx={size / 2} cy={size / 2} r={radius} 
            stroke={`url(#ringGrad-${label})`} strokeWidth={strokeWidth}
            fill="none" strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-black text-[24px] text-white leading-none tracking-tight">{mainText}</span>
          <span className="font-heading text-[11px] text-[var(--theme-color)] font-bold mt-1 tracking-wider">{subText}</span>
        </div>
      </div>
      <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-widest mt-3">{label}</span>
    </div>
  );
};

const GlassInput = (props: any) => (
  <input
    {...props}
    className={`w-full px-5 py-4 rounded-[20px] bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] focus:border-[var(--theme-color)] outline-none text-white text-[12px] font-medium transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-[#71717A] ${props.className || ''}`}
  />
);

const CleanDateInput = ({ value, onChange }: any) => (
  <input 
    type="date" 
    value={value} 
    onChange={onChange} 
    className="bg-white/5 border border-white/10 rounded-[12px] px-3 py-2.5 text-[11px] font-semibold text-white outline-none focus:border-[var(--theme-color)] transition-all cursor-pointer"
  />
);

const CleanTimeInput = ({ value, onChange }: any) => (
  <input 
    type="time" 
    value={value} 
    onChange={onChange} 
    className="bg-white/5 border border-white/10 rounded-[12px] px-3 py-2.5 text-[11px] font-semibold text-white outline-none focus:border-[var(--theme-color)] transition-all cursor-pointer"
  />
);

const GlassSelect = (props: any) => (
  <select
    {...props}
    className={`w-full px-5 py-4 rounded-[20px] bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] focus:border-[var(--theme-color)] outline-none text-white text-[12px] font-semibold uppercase tracking-wider transition-all appearance-none cursor-pointer shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] ${props.className || ''}`}
  >
    {props.children}
  </select>
);

function AppContent() {
  const [appData, setAppData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<any[]>([]);
  
  const [timeBurn, setTimeBurn] = useState({
    day: { pct: 0, main: '0%', sub: '00:00' },
    month: { pct: 0, main: '0%', sub: '1st' },
    year: { pct: 0, main: '0%', sub: '1d' }
  });
  
  const [isBoosted, setIsBoosted] = useState(false);
  const boostTimeout = useRef<any>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [processingTasks, setProcessingTasks] = useState(new Set());

  const curDateStr = getLocalDateStr();
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskDeadline, setTaskDeadline] = useState(curDateStr);
  const [taskTime, setTaskTime] = useState('');
  const [taskGoalId, setTaskGoalId] = useState('');
  
  const [goalTimeline, setGoalTimeline] = useState('Daily');
  const [goalTarget, setGoalTarget] = useState<any>(30);
  const [yieldRange, setYieldRange] = useState('7d');
  const [editingBuff, setEditingBuff] = useState<string | null>(null);
  const [buffForm, setBuffForm] = useState({ title: '', xp: 100 });

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = getLocalDateStr(nextDate);

  useEffect(() => {
    const data = loadData();

    if (data) {
      setAppData(data);
    } else {
      const fresh = {
        version: 1,
        profile: { booted: false },
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
      const updated = structuredClone(prev);
      updater(updated);
      saveData(updated);
      return updated;
    });
  };

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

  const dashboardTasks = (appData?.tasks || []).filter((t: any) => 
    (t.deadline <= curDateStr && t.status !== 'completed') || 
    (t.status === 'completed' && t.completedDateStr === curDateStr)
  );
  
  const pendingToday = (appData?.tasks || []).filter((t: any) => t.deadline <= curDateStr && t.status !== 'completed');
  const pendingUpcoming = (appData?.tasks || []).filter((t: any) => t.deadline > curDateStr && t.status !== 'completed');
  const completedTasks = (appData?.tasks || []).filter((t: any) => t.status === 'completed');

  const getWeight = (prio: string) => ({ High: 50, Medium: 20, Low: 10 }[prio] || 10);
  const totalWeight = dashboardTasks.reduce((sum: number, t: any) => sum + getWeight(t.priority), 0);
  const completedWeight = dashboardTasks.filter((t: any) => t.status === 'completed').reduce((sum: number, t: any) => sum + getWeight(t.priority), 0);
  const dailyProgressPct = totalWeight === 0 ? 0 : (completedWeight / totalWeight) * 100;

  const buff1 = appData?.profile?.customBuffs?.buff1 || { title: 'Extra Effort', xp: 100, lastClaimed: '' };
  const buff2 = appData?.profile?.customBuffs?.buff2 || { title: 'Perfect Day', xp: 100, lastClaimed: '' };

  const triggerBoost = () => {
    setIsBoosted(true);
    if (boostTimeout.current) clearTimeout(boostTimeout.current);
    boostTimeout.current = setTimeout(() => setIsBoosted(false), 2000);
  };

  const spawnParticles = (e: React.MouseEvent, priorityLevel: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const level = priorityLevel === 'High' ? 3 : priorityLevel === 'Medium' ? 2 : 1;
    const count = level * 8 + 8; 
    
    const newParticles = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * (90 * level);
      return {
        id: Math.random() + Date.now(), x, y,
        tx: `${Math.cos(angle) * dist}px`, ty: `${Math.sin(angle) * dist}px`,
        rot: `${Math.random() * 360}deg`, life: `${0.5 + Math.random() * 0.5}s`,
        icon: [Zap, Sparkles, Flame, Target][Math.floor(Math.random() * 4)],
        color: [TOKENS.solarOrange, TOKENS.royalAmethyst, TOKENS.cyanGlow, '#FFFFFF'][Math.floor(Math.random() * 4)],
        size: 10 + Math.random() * 12
      };
    });
    setParticles(prev => [...prev, ...newParticles].slice(-40));
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 1200);
  };

  const executeTask = (p: any, e: React.MouseEvent) => {
    if (p.status === 'completed' || processingTasks.has(p.id)) return;
    setProcessingTasks(prev => new Set(prev).add(p.id)); 
    triggerBoost(); 
    playSound('complete');
    spawnParticles(e, p.priority);
    
    updateAppData((data: any) => {
      const task = data.tasks.find((t: any) => t.id === p.id);
      if (!task || task.status === 'completed') return;

      task.status = 'completed';
      task.completedAt = Date.now();
      task.completedDateStr = curDateStr;

      const xp = p.priority === 'High' ? 50 : p.priority === 'Medium' ? 20 : 10;

      data.profile.score += xp;
      data.profile.xpLogs[curDateStr] = (data.profile.xpLogs[curDateStr] || 0) + xp;
    });
    
    setProcessingTasks(prev => { const s = new Set(prev); s.delete(p.id); return s; });
  };

  const claimCustomBuff = (buffKey: string, buffObj: any, e: React.MouseEvent) => {
    if (buffObj.lastClaimed === curDateStr || processingTasks.has(buffKey)) return;
    setProcessingTasks(prev => new Set(prev).add(buffKey)); 
    triggerBoost();
    playSound('streak');
    spawnParticles(e, 'High');
    
    updateAppData((data: any) => {
      const buff = data.profile.customBuffs[buffKey];
      if (buff.lastClaimed === curDateStr) return;

      buff.lastClaimed = curDateStr;

      data.profile.score += buff.xp;
      data.profile.xpLogs[curDateStr] = (data.profile.xpLogs[curDateStr] || 0) + buff.xp;
    });
    
    setProcessingTasks(prev => { const s = new Set(prev); s.delete(buffKey); return s; });
  };

  const saveBuffEdit = (buffKey: string) => {
    const title = buffForm.title.trim();
    if (!title) { addToast("Title cannot be empty"); return; }
    const xp = Math.max(0, parseInt(buffForm.xp as any) || 0);

    updateAppData((data: any) => {
      data.profile.customBuffs[buffKey].title = title;
      data.profile.customBuffs[buffKey].xp = xp;
    });
    setEditingBuff(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(appData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `backup.json`;
    a.click();
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: any) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.profile) throw new Error();

        setAppData(data);
        saveData(data);
        addToast("Data Restored");
      } catch {
        addToast("Invalid file");
      }
    };

    reader.readAsText(file);
  };

  const changeTheme = (color: string) => {
    updateAppData((data: any) => {
      data.profile.theme = color;
    });
  };

  const addToast = (msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }].slice(-3));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleBoot = (e: any) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const focus = e.target.focus.value.trim();

    if (!name || !focus) return;

    playSound('boot');

    updateAppData((data: any) => {
      data.profile = {
        booted: true,
        codename: name,
        directive: focus,
        score: 0,
        xpLogs: {},
        theme: TOKENS.solarOrange,
        joinedAt: Date.now(),
        customBuffs: {
          buff1: { title: 'Extra Effort', xp: 100, lastClaimed: '' },
          buff2: { title: 'Perfect Day', xp: 100, lastClaimed: '' }
        }
      };
    });
  };

  const getYieldData = (range: string) => {
    const daysToMap = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    return Array.from({length: daysToMap}).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - ((daysToMap - 1) - i));
      const xp = appData?.profile?.xpLogs?.[getLocalDateStr(d)] || 0;
      return { date: d, xp };
    });
  };

  if (isLoading) return <div className="min-h-screen bg-[#050508] flex items-center justify-center"><Loader2 className="text-[var(--theme-color)] animate-spin" /></div>;

  const currentTheme = appData?.profile?.theme || TOKENS.solarOrange;
  const yieldData = getYieldData(yieldRange);
  const maxYieldXP = Math.max(...Object.values(appData?.profile?.xpLogs || {}).map(v => Number(v)), 100);
  const rgbTheme = hexToRgb(currentTheme);

  if (!appData?.profile?.booted) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden bg-[#050508]`} style={{ '--theme-color': currentTheme } as any}>
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
          <RayCard className="!w-24 !h-24 mb-8">
             <div className="w-full h-full flex items-center justify-center">
                <Shield size={36} className="text-[var(--theme-color)]" />
             </div>
          </RayCard>
          <h1 className="font-heading text-[32px] mb-2 tracking-tight">Initialize Flow</h1>
          <form className="w-full space-y-4" onSubmit={handleBoot}>
            <GlassInput name="name" placeholder="Your Name" required />
            <GlassInput name="focus" placeholder="Main Focus" required />
            <div className="pt-4">
              <SpatialButton type="submit" icon={Zap}>Start Journey</SpatialButton>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative pb-28 bg-[#050508] ${isBoosted ? 'app-boosted' : ''}`} style={{ '--theme-color': currentTheme } as any}>
      <header className="w-full pt-10 pb-6 px-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <div className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-widest flex items-center gap-2 mb-1">
               <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--theme-color)]" /> 
               {appData?.profile?.codename}
            </div>
            <h2 className="font-heading text-lg tracking-tight text-white truncate max-w-[180px]">{appData?.profile?.directive}</h2>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-widest mb-0.5">Total XP</div>
             <div className="text-4xl font-heading font-black text-[var(--theme-color)]">
               <AnimatedNumber value={appData?.profile?.score || 0} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-2 w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-3">
            <RayCard className="py-7">
               <div className="flex flex-row justify-between px-1 items-center w-full">
                 <HeroRing progress={timeBurn.day.pct} mainText={timeBurn.day.main} subText={timeBurn.day.sub} label="Day" />
                 <HeroRing progress={timeBurn.month.pct} mainText={timeBurn.month.main} subText={timeBurn.month.sub} label="Month" />
                 <HeroRing progress={timeBurn.year.pct} mainText={timeBurn.year.main} subText={timeBurn.year.sub} label="Year" />
               </div>
            </RayCard>

            <RayCard>
               <AnimatedProgressBar progress={dailyProgressPct} label="Execution Progress" val={`${Math.round(dailyProgressPct)}%`} />
            </RayCard>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'buff1', data: buff1, icon: Flame },
                { key: 'buff2', data: buff2, icon: Sparkles }
              ].map((b, idx) => {
                const isClaimed = b.data.lastClaimed === curDateStr;
                return (
                  <RayCard key={b.key} className="flex flex-col justify-between !p-4 min-h-[140px]">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors ${isClaimed ? 'bg-[rgba(255,255,255,0.03)]' : 'bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] shadow-[0_5px_15px_rgba(0,0,0,0.5)]'}`}>
                         <b.icon size={18} className={isClaimed ? 'text-[#71717A]' : idx === 0 ? 'text-[var(--theme-color)]' : 'text-[#8B5CF6]'} />
                      </div>
                      {!isClaimed && <span className={`text-[11px] font-bold ${idx===0 ? 'text-[var(--theme-color)]' : 'text-[#8B5CF6]'}`}>+{b.data.xp}</span>}
                    </div>
                    <div>
                       <h4 className="font-heading text-[14px] text-white mb-2 leading-tight">{b.data.title}</h4>
                       <button onClick={(e) => claimCustomBuff(b.key, b.data, e)} className="w-full py-2 rounded-[10px] text-[9px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.03)] text-[#71717A] transition-all hover:bg-white/5 active:scale-95">{isClaimed ? 'Claimed' : 'Activate'}</button>
                    </div>
                  </RayCard>
                )
              })}
            </div>

            <RayCard>
               <div className="flex justify-between items-center mb-3 px-1">
                 <h3 className="font-heading text-[15px] text-white">Action Queue</h3>
                 <button onClick={() => setActiveTab('tasks')} className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest hover:text-white transition-colors">View All</button>
               </div>
               <div className="space-y-2.5 mt-3">
                  {dashboardTasks.length === 0 ? (
                     <div className="py-5 text-center text-[#71717A] text-[10px] font-semibold uppercase tracking-widest border border-[rgba(255,255,255,0.05)] border-dashed rounded-[14px]">Queue clear</div>
                  ) : dashboardTasks.slice(0, 4).map(t => (
                    <div key={t.id} onClick={(e) => executeTask(t, e)} className={`p-3 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)] rounded-[14px] flex items-center justify-between transition-all ${t.status === 'completed' ? 'opacity-30' : 'cursor-pointer hover:bg-[rgba(255,255,255,0.04)]'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${t.status === 'completed' ? 'bg-[var(--theme-color)]' : 'border border-white/10'}`}>
                             {t.status === 'completed' ? <CheckCircle2 size={14} className="text-white" /> : <Circle size={14} className="text-[#A1A1AA]" />}
                          </div>
                          <div>
                             <p className={`font-medium text-[13px] leading-tight ${t.status==='completed'?'line-through text-[#A1A1AA]':'text-white'}`}>{t.title}</p>
                             <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: t.priority === 'High' ? 'var(--theme-color)' : '#A1A1AA' }}>
                               {t.priority} {t.time ? `• ${format12Hour(t.time)}` : ''}
                             </span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </RayCard>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <RayCard className="stagger-1">
                <form className="space-y-3" onSubmit={(e: any) => {
                   e.preventDefault();
                   const title = e.target.title.value.trim();
                   if (!title) { addToast("Task needs a title"); return; }
                   
                   updateAppData((data: any) => {
                     data.tasks.unshift({
                       id: crypto.randomUUID(),
                       title: title.substring(0, 100),
                       priority: taskPriority,
                       goalId: taskGoalId || null,
                       deadline: taskDeadline,
                       time: taskTime,
                       status: 'pending',
                       createdAt: Date.now()
                     });
                   });
                   e.target.reset();
                   setTaskPriority('High'); setTaskDeadline(curDateStr); setTaskTime(''); setTaskGoalId('');
                }}>
                   <h3 className="font-heading text-[16px] text-white">Add Protocol</h3>
                   <GlassInput name="title" placeholder="Execute..." maxLength={100} required />
                   
                   <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">Priority Weight</span>
                      <div className="flex gap-2">
                        {['High', 'Medium', 'Low'].map(prio => (
                           <button key={prio} type="button" onClick={() => setTaskPriority(prio)} className={`flex-1 py-3 rounded-[14px] text-[11px] font-semibold uppercase tracking-widest transition-all border ${taskPriority === prio ? 'bg-[rgba(255,255,255,0.08)] text-white border-[var(--theme-color)]' : 'bg-[rgba(255,255,255,0.03)] text-[#A1A1AA] border-transparent hover:bg-[rgba(255,255,255,0.06)]'}`}>{prio}</button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">Target Deadline & Time</span>
                      <div className="flex gap-2 items-center">
                         <CleanDateInput value={taskDeadline} onChange={(e: any) => setTaskDeadline(e.target.value)} />
                         <CleanTimeInput value={taskTime} onChange={(e: any) => setTaskTime(e.target.value)} />
                      </div>
                      <div className="text-[10px] font-semibold text-white ml-1 mt-1 opacity-80">
                        {taskDeadline === curDateStr && !taskTime ? 'Due Today' : 
                         taskDeadline === nextDateStr && !taskTime ? 'Due Tomorrow' : 
                         `${new Date(taskDeadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}${taskTime ? ` at ${format12Hour(taskTime)}` : ''}`}
                      </div>
                   </div>

                   <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">Link Objective</span>
                      <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar snap-x">
                         <button type="button" onClick={() => setTaskGoalId('')} className={`px-3 py-2 rounded-[12px] text-[10px] font-medium whitespace-nowrap shrink-0 snap-center transition-all border ${taskGoalId === '' ? 'bg-[rgba(255,255,255,0.08)] text-white border-[var(--theme-color)]' : 'bg-[rgba(255,255,255,0.03)] text-[#A1A1AA] border-transparent hover:bg-white/5'}`}>None</button>
                         {(appData?.goals || []).map((g: any) => (
                            <button key={g.id} type="button" onClick={() => setTaskGoalId(g.id)} className={`px-3 py-2 rounded-[12px] text-[10px] font-medium whitespace-nowrap shrink-0 snap-center transition-all border ${taskGoalId === g.id ? 'bg-[rgba(255,255,255,0.08)] text-white border-[var(--theme-color)]' : 'bg-[rgba(255,255,255,0.03)] text-[#A1A1AA] border-transparent hover:bg-white/5'}`}>
                              {g.title}
                            </button>
                         ))}
                      </div>
                   </div>

                   <SpatialButton type="submit" icon={Plus}>Queue Task</SpatialButton>
                </form>
             </RayCard>
             
             <div className="space-y-4 stagger-2">
                {pendingToday.length > 0 && (
                   <div className="space-y-2.5">
                      <h4 className="text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-widest px-1">Today & Overdue</h4>
                      {pendingToday.map(t => (
                         <RayCard key={t.id} onClick={(e) => executeTask(t, e)} className="!p-3.5 flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)]">
                                  {processingTasks.has(t.id) ? <Loader2 size={16} className="text-[#A1A1AA] animate-spin"/> : <Circle size={18} className="text-[#A1A1AA]" />}
                               </div>
                               <div>
                                  <p className="font-medium text-[14px] mb-0.5 text-white truncate max-w-[200px]">{t.title}</p>
                                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">
                                    {t.priority} Priority • {t.deadline === curDateStr ? 'Due Today' : `Overdue: ${new Date(t.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}`}
                                    {t.time ? ` at ${format12Hour(t.time)}` : ''}
                                  </span>
                               </div>
                            </div>
                         </RayCard>
                      ))}
                   </div>
                )}

                {pendingUpcoming.length > 0 && (
                   <div className="space-y-2.5">
                      <h4 className="text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-widest px-1">Scheduled Upcoming</h4>
                      {pendingUpcoming.map(t => (
                         <RayCard key={t.id} onClick={(e) => executeTask(t, e)} className="!p-3.5 flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)]">
                                  {processingTasks.has(t.id) ? <Loader2 size={16} className="text-[#A1A1AA] animate-spin"/> : <Circle size={18} className="text-[#A1A1AA]" />}
                               </div>
                               <div>
                                  <p className="font-medium text-[14px] mb-0.5 text-white truncate max-w-[200px]">{t.title}</p>
                                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">
                                    {t.priority} Priority • Due {t.deadline === nextDateStr ? 'Tomorrow' : new Date(t.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    {t.time ? ` at ${format12Hour(t.time)}` : ''}
                                  </span>
                               </div>
                            </div>
                         </RayCard>
                      ))}
                   </div>
                )}

                {completedTasks.length > 0 && (
                   <div className="space-y-2.5">
                      <h4 className="text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-widest px-1">Completed</h4>
                      {completedTasks.map(t => (
                         <RayCard key={t.id} className="!p-3.5 flex items-center justify-between opacity-40 grayscale">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-[var(--theme-color)] border-none">
                                  <CheckCircle2 size={18} className="text-white" />
                               </div>
                               <div>
                                  <p className="font-medium text-[14px] mb-0.5 line-through text-[#A1A1AA] truncate max-w-[200px]">{t.title}</p>
                                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">{t.priority} Priority</span>
                               </div>
                            </div>
                         </RayCard>
                      ))}
                   </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <RayCard className="stagger-1">
                <form className="space-y-3" onSubmit={(e: any) => {
                   e.preventDefault();
                   const title = e.target.title.value.trim();
                   if (!title) { addToast("Objective needs a title"); return; }
                   const safeTarget = Math.max(1, parseInt(goalTarget) || 1);

                   updateAppData((data: any) => {
                     data.goals.unshift({
                       id: crypto.randomUUID(),
                       title: title.substring(0, 100),
                       timeline: goalTimeline,
                       target: safeTarget,
                       createdAt: Date.now()
                     });
                   });
                   e.target.reset(); setGoalTimeline('Daily'); setGoalTarget(30);
                }}>
                   <h3 className="font-heading text-[16px] text-white">Deploy Milestone</h3>
                   <GlassInput name="title" placeholder="Objective..." maxLength={100} required />
                   <div className="flex gap-2">
                     {['Daily', 'Weekly', 'Monthly'].map(t => (
                       <button key={t} type="button" onClick={() => setGoalTimeline(t)} className={`flex-1 py-2.5 rounded-[12px] text-[10px] font-semibold uppercase tracking-widest border ${goalTimeline === t ? 'bg-[rgba(255,255,255,0.08)] text-white border-[var(--theme-color)]' : 'bg-[rgba(255,255,255,0.03)] border-transparent text-[#A1A1AA]'}`}>{t}</button>
                     ))}
                   </div>
                   <div className="space-y-1.5 pt-1">
                     <span className="text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-widest">Deployment Count</span>
                     <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                       {[10, 20, 30, 40, 50].map(num => (
                         <button key={num} type="button" onClick={() => setGoalTarget(num)} className={`px-4 py-2.5 rounded-[12px] text-[11px] font-bold shrink-0 transition-all border ${goalTarget == num ? 'bg-[rgba(255,255,255,0.08)] text-white border-[var(--theme-color)]' : 'bg-[rgba(255,255,255,0.03)] border-transparent text-[#A1A1AA]'}`}>{num}</button>
                       ))}
                       <input type="number" min="1" value={goalTarget} onChange={(e: any) => setGoalTarget(e.target.value)} placeholder="Custom" className="w-20 px-3 py-2.5 rounded-[12px] bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] text-white text-[11px] font-bold outline-none focus:border-[var(--theme-color)] shrink-0" />
                     </div>
                   </div>
                   <SpatialButton type="submit" icon={Target}>Deploy Goal</SpatialButton>
                </form>
             </RayCard>
             {(appData?.goals || []).length === 0 ? (
                <div className="py-8 text-center text-[#71717A] text-[11px] font-heading font-semibold uppercase tracking-widest border border-[rgba(255,255,255,0.05)] border-dashed rounded-[16px]">No Active Milestones</div>
             ) : (appData?.goals || []).map((g: any) => {
               const linkedCompleted = (appData?.tasks || []).filter((t: any) => t.goalId === g.id && t.status === 'completed').length;
               const pct = g.target > 0 ? Math.min((linkedCompleted / g.target) * 100, 100) : 0;
               return (
                 <RayCard key={g.id} className="stagger-2">
                    <div className="flex justify-between items-start mb-5">
                       <div>
                          <span className="text-[10px] font-heading font-semibold text-[#A1A1AA] uppercase tracking-widest mb-1.5 block">{g.timeline}</span>
                          <h4 className="font-heading text-[18px] text-white leading-tight">{g.title}</h4>
                       </div>
                       <div className="font-heading text-2xl text-[var(--theme-color)]">{linkedCompleted}<span className="text-[#71717A] text-[14px]">/{g.target}</span></div>
                    </div>
                    <AnimatedProgressBar progress={pct} label="Milestone Progress" val={`${Math.round(pct)}%`} />
                 </RayCard>
               );
             })}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <RayCard className="stagger-1">
                <form className="space-y-3" onSubmit={(e: any) => {
                   e.preventDefault();
                   const title = e.target.title.value.trim();
                   const content = e.target.content.value.trim();
                   if (!title || !content) { addToast("Note needs title and content"); return; }
                   updateAppData((data: any) => {
                     data.notes.unshift({
                       id: crypto.randomUUID(),
                       title: title.substring(0, 100),
                       content: content.substring(0, 2000),
                       createdAt: Date.now()
                     });
                   });
                   e.target.reset();
                }}>
                   <h3 className="font-heading text-[16px] text-white">Log Record</h3>
                   <GlassInput name="title" placeholder="Title" maxLength={100} required />
                   <textarea name="content" placeholder="Content..." rows={4} maxLength={2000} className="w-full p-4 rounded-[16px] bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] outline-none text-white text-[12px] font-medium" />
                   <SpatialButton type="submit" icon={Database}>Archive</SpatialButton>
                </form>
             </RayCard>
             {(appData?.notes || []).length === 0 ? (
                <div className="py-8 text-center text-[#71717A] text-[11px] font-heading font-semibold uppercase tracking-widest border border-[rgba(255,255,255,0.05)] border-dashed rounded-[16px]">Vault Empty</div>
             ) : (
               <div className="columns-2 gap-3 space-y-3 stagger-2">
                 {(appData?.notes || []).map((n: any) => (
                    <div key={n.id} className="break-inside-avoid">
                      <RayCard className="!p-4">
                         <h4 className="font-heading text-[14px] text-white mb-2">{n.title}</h4>
                         <p className="text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-6">{n.content}</p>
                      </RayCard>
                    </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <RayCard className="stagger-1">
                <div className="flex items-center gap-4">
                   <div className="w-[56px] h-[56px] bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] flex items-center justify-center">
                      <User size={24} className="text-[var(--theme-color)]" />
                   </div>
                   <div><h3 className="font-heading text-[22px] text-white">{appData?.profile?.codename}</h3><span className="text-[10px] font-heading uppercase text-[#A1A1AA] tracking-widest font-semibold">Active Status</span></div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                   <span className="text-[10px] font-heading text-[#A1A1AA] uppercase tracking-widest block mb-3 font-semibold">Core Theme Color</span>
                   <div className="flex gap-2">
                     {[TOKENS.solarOrange, TOKENS.royalAmethyst, '#10B981', '#EC4899', '#00E5FF'].map(color => (
                        <button key={color} onClick={() => changeTheme(color)} className={`w-9 h-9 rounded-full ${appData?.profile?.theme === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#050508]' : ''}`} style={{ backgroundColor: color }} />
                     ))}
                   </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                   <button onClick={handleExport} className="flex-1 py-2.5 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white flex items-center justify-center gap-2 transition-all">
                      <Download size={14}/> Export Data
                   </button>
                   <label className="flex-1 py-2.5 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <Upload size={14}/> Import Data
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                   </label>
                </div>
             </RayCard>
             <RayCard className="stagger-2">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-heading text-[16px] text-white">Analytics Yield</h3>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-[10px]">
                     {['7d', '30d', '1y'].map(r => (
                       <button key={r} onClick={() => setYieldRange(r)} className={`px-2 py-1 rounded-[8px] text-[10px] font-bold uppercase transition-colors ${yieldRange === r ? 'bg-[rgba(255,255,255,0.1)] text-white' : 'text-[#71717A]'}`}>{r}</button>
                     ))}
                  </div>
                </div>
                
                {yieldRange === '7d' && (
                  <div className="flex items-end justify-between h-28 gap-2">
                    {yieldData.map((d, i) => {
                      const pct = Math.min((d.xp / Math.max(1, maxYieldXP)) * 100, 100);
                      const isToday = i === yieldData.length - 1;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 justify-end h-full group">
                           <div className={`w-full rounded-[6px] relative animate-draw-h ${isToday ? '' : 'bg-white/5'}`} 
                                style={{ '--target-h': `${Math.max(pct, 4)}%`, background: isToday ? `linear-gradient(to top, var(--theme-color), ${TOKENS.royalAmethyst})` : '' } as any} />
                           <span className={`text-[9px] font-bold ${isToday ? 'text-white' : 'text-[#71717A]'}`}>{d.date.toLocaleDateString('en-US', { weekday: 'short' })[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {yieldRange === '30d' && (
                  <div className="flex items-end justify-between h-28 gap-[2px]">
                    {yieldData.map((d, i) => {
                      const pct = Math.min((d.xp / Math.max(1, maxYieldXP)) * 100, 100);
                      const isToday = i === yieldData.length - 1;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                           <div className={`w-full rounded-[2px] relative animate-draw-h ${isToday ? 'bg-[var(--theme-color)]' : 'bg-white/10'}`} style={{ '--target-h': `${Math.max(pct, 2)}%` } as any} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {yieldRange === '1y' && (
                  <div className="flex flex-col gap-1 overflow-x-auto hide-scrollbar flex-row-reverse pb-1" dir="rtl">
                     <div className="grid grid-rows-7 grid-flow-col gap-1" dir="ltr">
                        {yieldData.map((d, i) => {
                           const intensity = d.xp === 0 ? 0 : Math.max(0.2, d.xp / Math.max(1, maxYieldXP));
                           return (
                             <div key={i} className="w-[10px] h-[10px] rounded-[2px]" 
                                  style={{ backgroundColor: d.xp === 0 ? 'rgba(255,255,255,0.03)' : `rgba(${rgbTheme}, ${intensity})` }} 
                                  title={`${d.xp} XP on ${getLocalDateStr(d.date)}`}
                             />
                           );
                        })}
                     </div>
                  </div>
                )}
             </RayCard>
          </div>
        )}
      </main>

      <nav className="fixed bottom-8 left-0 right-0 z-[100] px-6 flex justify-center pointer-events-none">
        <div className="h-[72px] w-full max-w-sm !rounded-[36px] flex items-center px-2 pointer-events-auto bg-[rgba(15,15,18,0.85)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.08)] shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
          {[
            { id: 'dashboard', icon: LayoutGrid },
            { id: 'tasks', icon: Calendar },
            { id: 'goals', icon: Target },
            { id: 'notes', icon: Database },
            { id: 'stats', icon: BarChart3 },
          ].map(item => (
            <button key={item.id} onClick={() => { playSound('complete'); setActiveTab(item.id); }} className="flex-1 flex flex-col items-center justify-center h-full transition-all relative group">
              <item.icon size={22} className={`z-10 transition-all ${activeTab === item.id ? 'text-white scale-110' : 'text-[#71717A]'}`} />
              {activeTab === item.id && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-[var(--theme-color)] shadow-md shadow-[var(--theme-color)]/50" />}
            </button>
          ))}
        </div>
      </nav>

      <div className="fixed top-8 left-0 right-0 z-[110] flex flex-col items-center gap-2 pointer-events-none px-6">
        {toasts.map(t => (
          <div key={t.id} className="bg-[rgba(15,15,18,0.95)] backdrop-blur-[24px] rounded-full py-3.5 px-5 border border-white/10 flex items-center gap-3 animate-in slide-in-from-top-6 font-bold text-[10px] max-w-xs w-full text-white uppercase shadow-2xl">
             <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--theme-color)]"><Zap size={12} className="text-white fill-white" /></div>
             {t.msg}
          </div>
        ))}
      </div>

      {particles.map(p => {
        const Icon = p.icon;
        return <div key={p.id} className="particle" style={{ left: p.x, top: p.y, '--tx': p.tx, '--ty': p.ty, '--rot': p.rot, '--life': p.life, color: p.color } as any}><Icon size={p.size} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" /></div>;
      })}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
