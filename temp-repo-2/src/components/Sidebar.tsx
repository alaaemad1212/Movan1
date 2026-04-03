import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, BookOpen, MessageSquare, Send } from 'lucide-react';
import { Question, Comment } from '../data';

interface SidebarProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ question, isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && question && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full lg:w-96 bg-slate-900 border-l border-emerald-500/20 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-emerald-400 font-mono text-sm uppercase tracking-widest">
                  Deep Dive Context
                </h2>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Expert Notes Section */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <BookOpen size={18} />
                    <h3 className="font-semibold">Expert Notes</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {question.expertNotes}
                  </p>
                </div>

                {/* Sources Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <ExternalLink size={18} />
                    <h3 className="font-semibold">Official Sources</h3>
                  </div>
                  <ul className="space-y-2">
                    {question.sources.map((source, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-400 text-sm hover:text-emerald-300 transition-colors cursor-pointer">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Category</span>
                      <span className="text-slate-200 text-sm font-medium">{question.category || 'General'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">ID Reference</span>
                      <span className="font-mono text-emerald-500/80 text-sm">#{question.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
