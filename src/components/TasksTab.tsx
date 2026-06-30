import React, { useState } from 'react';
import { Plus, Circle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialCard, Badge, SegmentedControl3D } from './CommonUI';
import { getLocalDateStr, format12Hour } from '../utils';

export const TasksTab = ({ tasks, setTasks, addXP, goals, executeTask }: any) => {
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

  const activeTasks = React.useMemo(() => tasks.filter((t: any) => !t.completed), [tasks]);
  const completedTasks = React.useMemo(() => tasks.filter((t: any) => t.completed), [tasks]);

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
            <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="flex-1 px-3 py-3 bg-black/40 border border-white/10 rounded-xl text-zinc-300 text-xs font-display outline-none focus:border-blue-500/40 h-11" />
            <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} className="flex-1 px-3 py-3 bg-black/40 border border-white/10 rounded-xl text-zinc-300 text-xs font-display outline-none focus:border-blue-500/40 h-11" />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            <button type="button" onClick={() => setTaskGoalId('')} className={`px-4 py-2.5 rounded-[12px] text-[10px] font-display font-bold whitespace-nowrap shrink-0 transition-all border h-9 flex items-center ${taskGoalId === '' ? 'bg-white/10 text-white border-blue-500/40' : 'bg-black/30 text-zinc-500 border-transparent hover:text-zinc-300'}`}>No Objective</button>
            {goals.map((g: any) => (
              <button key={g.id} type="button" onClick={() => setTaskGoalId(g.id)} className={`px-4 py-2.5 rounded-[12px] text-[10px] font-display font-bold whitespace-nowrap shrink-0 transition-all border h-9 flex items-center ${taskGoalId === g.id ? 'bg-white/10 text-white border-blue-500/40' : 'bg-black/30 text-zinc-500 border-transparent hover:text-zinc-300'}`}>
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
          <motion.div layout className="space-y-4">
            <AnimatePresence initial={false}>
              {activeTasks.map((task: any) => (
                <motion.div 
                  layout
                  key={task.id} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="glass-card p-5 rounded-[1.5rem] flex items-center gap-4 group"
                >
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button" 
                    onClick={(e) => executeTask(task, e)}
                    className="w-11 h-11 flex items-center justify-center -ml-2 -my-2"
                  >
                    <Circle className="text-zinc-600 group-hover:text-blue-400 transition-colors w-7 h-7" />
                  </motion.button>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {completedTasks.length > 0 && (
          <div className="space-y-4 opacity-50">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase">Cleared</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setTasks(tasks.filter((t: any) => !t.completed))}
                className="text-[10px] font-display font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors bg-red-500/0 hover:bg-red-500/10 px-4 py-2.5 rounded-xl h-9 flex items-center"
              >
                Clear All
              </motion.button>
            </div>
            <motion.div layout className="space-y-4">
              <AnimatePresence initial={false}>
                {completedTasks.map((task: any) => (
                  <motion.div 
                    layout
                    key={task.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="glass-recessed p-5 rounded-[1.5rem] flex items-center gap-4"
                  >
                    <CheckCircle2 className="text-blue-400/40 w-6 h-6" />
                    <p className="text-zinc-500 font-body text-[15px] line-through leading-tight">{task.title}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
