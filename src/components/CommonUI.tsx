import React from 'react';
import { motion } from 'motion/react';

interface BadgeProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  colorClass?: string;
}

export const Badge = ({ icon: Icon, text, colorClass = "from-zinc-800 to-zinc-900 text-zinc-300 border-white/10" }: BadgeProps) => (
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

export const SpatialCard = ({ children, className = '', padding = 'p-6' }: SpatialCardProps) => (
  <motion.div 
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className={`glass-card ${className}`}
  >
    <div className={`relative z-10 ${padding}`}>
      {children}
    </div>
  </motion.div>
);

export const TactileButton = ({ children, onClick, className = '', disabled = false }: any) => (
  <motion.button 
    whileHover={disabled ? {} : { scale: 1.01 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    disabled={disabled} 
    onClick={onClick} 
    className={`btn-tactile rounded-[1.25rem] py-3.5 px-4 font-display font-medium text-[14px] flex justify-center items-center gap-2 text-white/90 w-full ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </motion.button>
);

export const Primary3DButton = ({ children, onClick, className = '', disabled = false }: any) => (
  <motion.button 
    whileHover={disabled ? {} : { scale: 1.01 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    disabled={disabled} 
    onClick={onClick} 
    className={`btn-primary-3d rounded-[1.25rem] py-4 px-4 font-display font-bold text-[15px] flex justify-center items-center gap-2 w-full tracking-wide ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </motion.button>
);

export const SegmentedControl3D = ({ options, selected, onChange }: any) => (
  <div className="flex p-1 glass-recessed rounded-[1.25rem] relative w-full">
    {options.map((opt: any) => {
      const isActive = selected === opt.id;
      return (
        <button
          key={opt.id} type="button" onClick={() => onChange(opt.id)}
          className={`flex-1 py-2.5 text-[12px] font-display font-semibold rounded-xl transition-all duration-400 z-10 relative ${
            isActive ? 'text-black drop-shadow-sm' : 'text-zinc-500 hover:text-white'
          }`}
        >
          {isActive && (
            <motion.div 
              layoutId="activeSegment"
              className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#6366f1] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.15)] z-0" 
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

export const ProgressRing = ({ progress, size = 60, stroke = 6, label, gradientId = "ringGradPrimary" }: any) => {
  const radius = React.useMemo(() => (size - stroke) / 2, [size, stroke]);
  const circumference = React.useMemo(() => radius * 2 * Math.PI, [radius]);
  const offset = React.useMemo(() => circumference - (progress / 100) * circumference, [circumference, progress]);

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
