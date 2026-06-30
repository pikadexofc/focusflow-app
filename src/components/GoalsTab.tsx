import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialCard, Badge, Primary3DButton, springPresets } from './CommonUI';
import { getLocalDateStr } from '../utils';

export const GoalsTab = ({ goals, setGoals, addXP }: any) => {
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

        <AnimatePresence>
          {isCustomTimeline && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 space-y-3 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
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

      <motion.div layout className="space-y-6">
        <AnimatePresence initial={false}>
          {goals.map((goal: any) => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            return (
              <motion.div
                layout
                key={goal.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={springPresets.fluid}
              >
                <SpatialCard padding="p-8" className="border-t border-t-magenta-500/30">
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
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
