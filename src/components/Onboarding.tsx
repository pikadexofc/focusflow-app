import React, { useState } from 'react';
import { 
  Shield, Plus, Zap, ChevronRight, Moon, Layers, CheckCircle2, Target, FileText, BarChart2 
} from 'lucide-react';
import { Badge, TactileButton, Primary3DButton } from './CommonUI';

export const Onboarding = ({ onComplete }: any) => {
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1500">The outside world can feel very loud.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-3500">Here, there’s no judgment and no hurry.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-12 animate-cinematic delay-5500">Take off your mask and relax. This is your space, you control it.</p>
            <p className="text-sm font-body text-blue-400/80 animate-cinematic delay-8500">Feel free to pause or step away anytime.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-10000 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 2: The Shift */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Change often starts quietly.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">It doesn’t need to be loud or sudden.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-12 animate-cinematic delay-4000">First, let’s take a moment to be here now.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-6000">We’ll slow down and breathe.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-8000">
              <TactileButton onClick={handleNext}>Take a breath</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 3: Identity */}
        {step === 2 && (
          <div className="flex-1 flex flex-col pt-6 overflow-y-auto no-scrollbar pb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 animate-cinematic">Identity Setup</h2>
            <p className="text-sm font-body text-zinc-400 mb-8 animate-cinematic delay-1000">Establish your profile within FocusFlow.</p>
            
            <div className="animate-cinematic delay-2000 space-y-6">
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">This is your private space, you’re in complete control.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-4500">Everything you write stays on this device.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-7000">Nothing is ever sent to the cloud or shared. Your privacy is protected.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-9500 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 5: Metaphor */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">Let’s try a different perspective.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Think of your mind as a hidden cave filled with treasures, ideas and strengths you haven’t discovered yet.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-5000">It might feel a little dark or unfamiliar. That’s okay.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-7500">Together we’ll turn on a light and explore gently.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-9500">
              <TactileButton onClick={handleNext}>Turn on the light</TactileButton>
            </div>
          </div>
        )}

        {/* Screen 6: The Setup */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-6 animate-cinematic">Let’s begin by noting anything you’d like to change or let go of, without judging yourself.</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2500">It could be a habit, a feeling, or something you avoid (procrastination, anger, worry, etc.).</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-5000">Don’t feel ashamed; everyone struggles with something.</p>
            <p className="text-lg font-body font-medium text-amber-400/90 animate-cinematic delay-7500">Naming these things can actually make them feel lighter. Write quickly and honestly, without overthinking.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-10500 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
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
                <p className="text-xs font-body text-zinc-500 animate-cinematic delay-1500">Write short bullet points. Don’t edit yourself, just get it out.</p>
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Try not to judge yourself, just observe.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-4000">Notice if any item jumps out as particularly strong or important.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-magenta-orange animate-cinematic delay-6000">That might be a good one to explore first. (We’ll focus on one thing at a time.)</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-8500">
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Everything you wrote is human and understandable.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-4500">These thoughts and feelings are real parts of you, and bringing them into the light is a brave act.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-lime-emerald animate-cinematic delay-7500">There’s nothing wrong or disgusting here, it just shows you care about improving. Treat yourself with the same kindness you’d offer a friend.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-10500 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 12: Realization */}
        {step === 11 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6 animate-cinematic">How do you feel right now?</h2>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-1500">Maybe a little lighter or proud?</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-3000">Confronting this is powerful, it takes courage.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-10 animate-cinematic delay-4500">It often feels more satisfying than trying to avoid the issue.</p>
            <p className="text-xl font-display font-medium text-gradient gradient-cyan-blue animate-cinematic delay-6500">You’re doing the hard work now, and you have everything you need to keep going.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-8500">
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
            <h2 className="text-2xl font-display font-bold text-white mb-3 animate-cinematic delay-1500">Now imagine yourself years from today.</h2>
            <p className="text-[14px] font-body font-light text-zinc-400 mb-3 animate-cinematic delay-3500 leading-relaxed max-w-[320px]">If things stay the same, those habits will still be running your life, what might that life look like?</p>
            <p className="text-[14px] font-body font-light text-zinc-400 mb-4 animate-cinematic delay-6000 leading-relaxed max-w-[320px]">Remember, big changes come from small steps over time.</p>
            <p className="text-[15px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500 mb-20 animate-cinematic delay-8500 drop-shadow-lg leading-relaxed max-w-[300px] mx-auto">The door isn’t closed on you: you can start changing course today. You’re exactly where you need to be.</p>
            <div className="absolute bottom-6 w-full animate-cinematic delay-11000">
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
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-2000">Like moving a mountain one stone at a time, every small action adds up.</p>
            <p className="text-lg font-body font-light text-zinc-400 mb-6 animate-cinematic delay-4500">One day of effort can become a habit. Habits shape who we are.</p>
            <p className="text-2xl font-display font-bold text-gradient gradient-magenta-orange mb-12 animate-cinematic delay-7000">So remember: even the tiniest repeatable step is a real beginning.</p>
            <p className="text-[10px] font-display text-zinc-500 animate-cinematic delay-9500 absolute bottom-6 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={handleNext}>Tap to continue</p>
          </div>
        )}

        {/* Screen 16: Launch / System */}
        {step === 15 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 glass-card rounded-[1.5rem] flex items-center justify-center animate-float mb-6 animate-cinematic">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-magenta-500/20" />
              <Layers size={32} className="text-white relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4 animate-cinematic delay-1000">Welcome to your personal toolkit.</h2>
            <p className="text-sm font-body font-light text-zinc-400 mb-8 animate-cinematic delay-2500">Here’s how to use it:</p>
            
            <div className="space-y-4 w-full mb-10 animate-cinematic delay-4000">
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

            <p className="text-xs font-display text-blue-300/80 uppercase tracking-widest animate-cinematic delay-7000 mb-2">Everything is stored only on your device (no internet needed).</p>
            <p className="text-lg font-display font-bold text-white animate-cinematic delay-9000 mb-8">You’re ready to start, go at your own pace.</p>
            
            <div className="absolute bottom-6 w-full animate-cinematic delay-11000">
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
