import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Target, FileText, BarChart2,
  Shield, Sliders, Sparkles, Zap, Flame, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Subcomponents
import { Onboarding } from './components/Onboarding';
import { DashboardTab } from './components/DashboardTab';
import { TasksTab } from './components/TasksTab';
import { GoalsTab } from './components/GoalsTab';
import { NotesTab } from './components/NotesTab';
import { StatsTab } from './components/StatsTab';
import { springPresets } from './components/CommonUI';

// Shared Utilities
import { 
  loadData, saveData, playSound, getOrdinal, getLocalDateStr, hexToRgb, getTaskWeight 
} from './utils';

import { NotificationEngine } from './NotificationEngine';
import { ErrorBoundary } from './ErrorBoundary';
import { InjectedStyles } from './styles/GlobalStyles';



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
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  
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
    
    // Initialize notifications
    NotificationEngine.init().then(() => {
      NotificationEngine.requestPermissions().then((granted) => {
        setNotificationsEnabled(granted);
        if (granted) {
          NotificationEngine.scheduleDailyBriefing();
        }
      });
    });

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
    
    playSound('complete');
    try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
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
    try { Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
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

    NotificationEngine.cancelTaskNotification(p.id);

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

  const currentTheme = appData?.profile?.theme || '#00f0ff';
  const yieldData = React.useMemo(() => getYieldData(yieldRange), [appData?.profile?.xpLogs, yieldRange]);
  const maxYieldXP = React.useMemo(() => Math.max(...Object.values(appData?.profile?.xpLogs || {}).map(v => Number(v)), 100), [appData?.profile?.xpLogs]);
  const rgbTheme = React.useMemo(() => hexToRgb(currentTheme), [currentTheme]);

  // Compute execution progress for today
  const curDateStr = getLocalDateStr();
  const todayTasks = React.useMemo(() => (appData?.tasks || []).filter((t: any) => t.deadline === curDateStr || (!t.completed && t.deadline < curDateStr)), [appData?.tasks, curDateStr]);
  const dailyProgressPct = React.useMemo(() => {
    const totalWeight = todayTasks.reduce((sum: number, t: any) => sum + getTaskWeight(t.priority), 0);
    const completedWeight = todayTasks.filter((t: any) => t.completed).reduce((sum: number, t: any) => sum + getTaskWeight(t.priority), 0);
    return totalWeight === 0 ? 0 : (completedWeight / totalWeight) * 100;
  }, [todayTasks]);

  const buff1 = React.useMemo(() => appData?.profile?.customBuffs?.buff1 || { title: 'Extra Effort', xp: 100, lastClaimed: '' }, [appData?.profile?.customBuffs?.buff1]);
  const buff2 = React.useMemo(() => appData?.profile?.customBuffs?.buff2 || { title: 'Perfect Day', xp: 100, lastClaimed: '' }, [appData?.profile?.customBuffs?.buff2]);

  const tabs = [
    { id: 'Dashboard', icon: BarChart2 },
    { id: 'Tasks', icon: CheckCircle2 },
    { id: 'Goals', icon: Target },
    { id: 'Notes', icon: FileText },
    { id: 'Stats', icon: Sliders },
  ];

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#030303] text-white font-body flex justify-center overflow-hidden antialiased selection:bg-blue-500/30 relative" style={{ '--theme-color': currentTheme } as any}>
        <InjectedStyles />
        
        {/* Universal Background Setup */}
        <div className="absolute inset-0 z-0 bg-grid opacity-10 pointer-events-none" />

        {/* Main Mobile/App Container */}
        <div className="w-full max-w-[428px] h-[100dvh] relative flex flex-col z-10 bg-[#0a0a0a]/90 shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)] border-x border-white/[0.05] transform-gpu">
          
          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-14">
            {notificationsEnabled === false && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center justify-between text-red-200">
                <span className="text-xs font-display font-bold uppercase tracking-widest">Alarms Disabled</span>
                <span className="text-[10px] font-body opacity-80">Check OS settings to enable.</span>
              </div>
            )}
            <AnimatePresence mode="wait">
              {activeTab === 'Dashboard' && (
                <motion.div
                  key="Dashboard"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
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
                </motion.div>
              )}
              {activeTab === 'Tasks' && (
                <motion.div
                  key="Tasks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="h-full flex flex-col"
                >
                  <TasksTab 
                    tasks={appData.tasks} 
                    setTasks={(tasks: any) => updateAppData((draft: any) => { draft.tasks = typeof tasks === 'function' ? tasks(draft.tasks) : tasks; })} 
                    addXP={addXP} 
                    goals={appData.goals}
                    executeTask={executeTask}
                  />
                </motion.div>
              )}
              {activeTab === 'Goals' && (
                <motion.div
                  key="Goals"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <GoalsTab 
                    goals={appData.goals} 
                    setGoals={(goals: any) => updateAppData((draft: any) => { draft.goals = typeof goals === 'function' ? goals(draft.goals) : goals; })} 
                    addXP={addXP} 
                  />
                </motion.div>
              )}
              {activeTab === 'Notes' && (
                <motion.div
                  key="Notes"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="h-full flex flex-col"
                >
                  <NotesTab 
                    notes={appData.notes} 
                    setNotes={(notes: any) => updateAppData((draft: any) => { draft.notes = typeof notes === 'function' ? notes(draft.notes) : notes; })} 
                    showToast={showToast} 
                  />
                </motion.div>
              )}
              {activeTab === 'Stats' && (
                <motion.div
                  key="Stats"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Dynamic Island Floating Bottom Navigation Dock */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] z-40">
            <nav className="pointer-events-auto glass-card rounded-[2.5rem] p-2.5 shadow-[0_30px_60px_-12px_rgba(0,0,0,1)] border border-white/[0.1] bg-[#0a0a0a]/90">
              <div className="flex justify-between items-center px-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  if (tab.id === 'Goals') {
                    return (
                      <motion.button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springPresets.interactive}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-magenta-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] mx-2 relative z-20 border border-white/30"
                      >
                        <Icon size={28} />
                      </motion.button>
                    )
                  }

                  return (
                    <motion.button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={springPresets.interactive}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-full relative overflow-hidden group ${
                        isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabBackground"
                          className="absolute inset-0 bg-white/10 rounded-full" 
                          transition={springPresets.fluid}
                        />
                      )}
                      <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-400 z-10`}>
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                    </motion.button>
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