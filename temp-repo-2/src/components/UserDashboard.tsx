import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ChevronRight, Eye, Info, Maximize2 } from 'lucide-react';
import { Question, Comment, User } from '../data';

interface UserDashboardProps {
  questions: Question[];
  currentUser: User | null;
  onSelectQuestion: (q: Question) => void;
  onLogout: () => void;
}

export default function UserDashboard({ questions, currentUser, onSelectQuestion, onLogout }: UserDashboardProps) {
  const visibleQuestions = questions.filter(q => q.isVisible);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/5 sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-slate-900">SD</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight leading-none">Strategic Due Diligence <span className="text-emerald-500">Portal</span></h1>
              {currentUser && <p className="text-xs text-slate-400">Welcome, {currentUser.name}</p>}
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-slate-900 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4 border border-emerald-500/20">
            CONFIDENTIAL REPORT
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Movan: Women's Football <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Growth & Vision 2030
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Strategic analysis of market opportunities, AI integration, and infrastructure development in the Saudi sports ecosystem.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectQuestion(q)}
              className="group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 flex flex-col cursor-pointer relative"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
                <Maximize2 size={20} />
              </div>

              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-xs font-mono text-emerald-500/70 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                      #{questions.indexOf(q) + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-500/70 bg-slate-800/50 px-2 py-1 rounded border border-white/5">
                      {q.category || 'Analysis'}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
                  {q.text}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {q.answer}
                </p>
              </div>
              
              <div className="bg-slate-800/30 p-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <MessageSquare size={14} />
                  <span>{q.comments.length} Comments</span>
                </div>
                <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  Read Full Analysis <ChevronRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
