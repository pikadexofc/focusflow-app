import React from 'react';
import { Zap, Flame, Sparkles, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialCard, ProgressRing, Badge } from './CommonUI';
import { getLocalDateStr, getTaskWeight, playSound } from '../utils';

export const DashboardTab = ({ userData, tasks, setTasks, addXP, buff1, buff2, claimCustomBuff, timeBurn, dailyProgressPct, goals = [], setGoals, showToast, executeTask }: any) => {
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
          <motion.div layout className="space-y-4">
            <AnimatePresence initial={false}>
              {queueItems.sort((a: any, b: any) => getTaskWeight(b.priority) - getTaskWeight(a.priority)).slice(0, 3).map((item: any) => (
                <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="glass-card p-5 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/[0.05] border-l-4" 
                  style={{borderLeftColor: item.type === 'goal' ? '#a855f7' : item.priority === 'high' ? '#ff00ff' : item.priority === 'medium' ? '#00f0ff' : 'transparent'}}
                >
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'task') {
                        executeTask(item.original, e);
                      } else {
                        setGoals(goals.map((g: any) => g.id === item.original.id ? { ...g, current: g.current + 1, lastDone: curDateStr, lastDoneTime: Date.now() } : g));
                        playSound('streak');
                        addXP(25);
                        showToast(`Milestone progress: ${item.original.current + 1}/${item.original.target}`);
                      }
                    }}
                  >
                    <Circle className="text-zinc-500 group-hover:text-blue-400 transition-colors w-7 h-7" />
                  </motion.button>
                  <div className="flex-1">
                    <p className="text-white font-body text-[16px] font-medium leading-tight">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {queueItems.length > 3 && (
              <p className="text-center text-[10px] font-display text-zinc-500 mt-4 uppercase tracking-widest bg-black/40 rounded-full py-2.5 w-max mx-auto px-5 border border-white/5">+{queueItems.length - 3} more actions</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
