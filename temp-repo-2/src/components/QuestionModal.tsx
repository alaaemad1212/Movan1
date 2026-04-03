import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ExternalLink, MessageSquare, Send } from 'lucide-react';
import { Question, Comment, User } from '../data';
import { useState } from 'react';

interface QuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onAddComment: (qId: string, comment: Omit<Comment, 'id' | 'date'>) => void;
}

export default function QuestionModal({ question, isOpen, currentUser, onClose, onAddComment }: QuestionModalProps) {
  const [text, setText] = useState('');

  const handleSubmitComment = () => {
    if (question && currentUser && text) {
      onAddComment(question.id, { author: currentUser.name, text });
      setText('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && question && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/5 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
              <div className="pr-8">
                <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-3 border border-emerald-500/20">
                  {question.category || 'Strategic Analysis'}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                  {question.text}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-900">
              
              {/* Answer Section */}
              <div className="prose prose-invert max-w-none">
                <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Strategic Answer
                </h3>
                <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-line bg-slate-800/30 p-6 rounded-xl border border-white/5 shadow-inner">
                  {question.answer}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expert Notes */}
                <div className="bg-emerald-900/10 rounded-xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <BookOpen size={18} />
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Expert Notes</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {question.expertNotes}
                  </p>
                </div>

                {/* Sources */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-3 text-slate-300">
                    <ExternalLink size={18} />
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Official Sources</h3>
                  </div>
                  <ul className="space-y-2">
                    {question.sources.map((source, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 flex-shrink-0" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-8 border-t border-white/5">
                 <div className="flex items-center gap-2 mb-6 text-slate-200">
                    <MessageSquare size={20} />
                    <h3 className="font-semibold">Discussion & Feedback</h3>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{question.comments.length}</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {question.comments.length === 0 ? (
                      <p className="text-slate-500 text-sm italic text-center py-4">No comments yet. Be the first to add insight.</p>
                    ) : (
                      question.comments.map(c => (
                        <div key={c.id} className="bg-slate-950 p-4 rounded-lg border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                                {c.author.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-emerald-400 text-sm font-medium">{c.author}</span>
                            </div>
                            <span className="text-slate-600 text-xs">{c.date}</span>
                          </div>
                          <p className="text-slate-300 text-sm pl-8">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-white/10">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                          {currentUser?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-400 text-sm">Posting as <span className="text-emerald-400 font-medium">{currentUser?.name}</span></span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add your strategic insight..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-slate-600"
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                        />
                        <button
                          onClick={handleSubmitComment}
                          disabled={!text}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                        >
                          <Send size={16} />
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
