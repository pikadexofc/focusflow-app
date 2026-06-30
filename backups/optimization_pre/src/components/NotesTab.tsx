import React, { useState } from 'react';
import { Shield, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge, Primary3DButton } from './CommonUI';

export const NotesTab = ({ notes, setNotes, showToast }: any) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const saveNote = () => {
    if (!newNote.content.trim()) return;
    setNotes([{ id: Date.now(), ...newNote, date: new Date().toLocaleDateString() }, ...notes]);
    setNewNote({ title: '', content: '' });
    showToast("Record preserved.");
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((n: any) => n.id !== id));
    showToast("Record removed.");
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

      <motion.div layout className="flex-1 overflow-y-auto no-scrollbar space-y-5 pt-4">
        <h2 className="text-[11px] font-display font-bold tracking-widest text-zinc-500 uppercase px-2">Archived</h2>
        {notes.length === 0 && <p className="text-zinc-600 text-[14px] px-2 font-body">Vault is empty.</p>}
        <AnimatePresence initial={false}>
          {notes.map((note: any) => (
            <motion.div 
              layout
              key={note.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 border-t border-t-amber-500/30 hover:scale-[1.02] transition-transform relative group"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => deleteNote(note.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-red-500/0 group-hover:bg-red-500/10 flex items-center justify-center text-zinc-600 group-hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </motion.button>
              {note.title && <h3 className="text-white font-display font-bold text-xl mb-3 pr-10">{note.title}</h3>}
              <p className="text-zinc-300 text-[15px] font-body leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="mt-6 text-[10px] font-display font-bold text-amber-500/80 uppercase tracking-widest bg-amber-500/10 w-max px-3 py-1 rounded-md">{note.date}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
