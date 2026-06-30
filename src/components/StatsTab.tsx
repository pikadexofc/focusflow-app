import React from 'react';
import { Download, Upload, Pickaxe, Heart, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialCard, Badge, springPresets } from './CommonUI';
import { getLocalDateStr } from '../utils';

export const StatsTab = ({ userData, habits, showToast, handleExport, fileInputRef, handleImport, currentTheme, changeTheme, yieldRange, setYieldRange, yieldData, maxYieldXP, rgbTheme, updateProfile }: any) => {
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

      {/* Support Action Section */}
      <div className="pt-6 flex flex-col items-center justify-center gap-3 text-zinc-400 text-sm font-display font-semibold tracking-wider border-t border-white/5 select-none">
        <div className="flex items-center gap-2">
          <span>MADE WITH</span>
          <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
          <span>BY PICKKO</span>
          <motion.a 
            href="https://www.supportkori.com/mdzobaedislamshanto"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={springPresets.interactive}
            className="flex items-center justify-center w-10 h-10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl ml-1"
          >
            <Coffee size={18} className="shrink-0" />
          </motion.a>
        </div>
      </div>
    </div>
  );
};
