import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Loader2, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        if (data.session) {
          setMessage("Account created and signed in successfully!");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        } else {
          setMessage("Registration successful! Please check your email inbox to confirm.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        setMessage("Signed in successfully!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/60 dark:border-luxury-gold/20 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md shadow-2xl p-6 sm:p-8 text-[#0f172a] dark:text-slate-100 z-10"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-luxury-gold transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="p-3 bg-blue-50 dark:bg-luxury-gold/10 rounded-2xl mb-3 border border-blue-100/50 dark:border-luxury-gold/15">
                <KeyRound className="w-6 h-6 text-blue-600 dark:text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent text-center">
                Authentication Required
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center max-w-[280px]">
                Please sign in or sign up to download your print-ready resume PDF.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100/80 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200/50 dark:border-luxury-gold/10 mb-6">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); setMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                  !isSignUp
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); setMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                  isSignUp
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/20 dark:border-red-900/30 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/20 dark:border-emerald-900/30 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark text-white font-bold rounded-xl text-sm transition-all duration-300 shadow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};