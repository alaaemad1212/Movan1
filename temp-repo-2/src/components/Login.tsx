import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { User as UserType } from '../data';

interface LoginProps {
  onLogin: (user: UserType) => void;
  users: UserType[];
}

export default function Login({ onLogin, users }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      if (!user.isActive) {
        setError('Account is deactivated. Contact admin.');
      } else {
        onLogin(user);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-900"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Lock className="text-slate-900" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Strategic Portal</h1>
              <p className="text-slate-400 text-sm">Restricted Access • Due Diligence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                  {error}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
              >
                Access Portal
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
