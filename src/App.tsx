import { useState, useEffect } from 'react';
import type { ResumeData } from './types';
import { MultiStepForm } from './components/MultiStepForm';
import { ResumePreview } from './components/ResumePreview';
import { ResumeHistoryDashboard } from './components/ResumeHistoryDashboard';
import { AuthModal } from './components/AuthModal';
import { FileText, Sun, Moon, Sparkles, LogOut, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { ModernCreativeTemplate } from './templates/ModernCreativeTemplate';
import { pdf } from '@react-pdf/renderer';

const initialData: ResumeData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Rivers',
    email: 'alex.rivers@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Architect',
    summary: 'Passionate and detail-oriented Frontend Architect with over 8 years of experience building highly interactive web applications. Expertise in React, TypeScript, and modern CSS frameworks like Tailwind.',
    linkedin: 'linkedin.com/in/alexrivers',
    github: 'github.com/alexrivers',
    portfolio: 'alexrivers.dev'
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Solutions',
      position: 'Lead UI Developer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: 'Led a team of 5 developers to rebuild the core dashboard platform, improving load times by 40% and increasing user engagement.'
    },
    {
      id: '2',
      company: 'Creative Studios',
      position: 'Frontend Engineer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      description: 'Developed highly responsive, interactive components using React and Framer Motion for high-profile client projects.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      graduationDate: 'May 2017'
    }
  ],
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'GraphQL', 'UX/UI Design'],
};

export default function App() {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<'classic' | 'modern'>('modern');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to Dark Luxury for maximum initial WOW factor

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Loaded Resume tracking
  const [loadedResumeId, setLoadedResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [history, setHistory] = useState<any[]>([]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const { data: dbData, error } = await supabase
        .from('resumes')
        .select('id, title, data, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (dbData) setHistory(dbData);
    } catch (err) {
      console.error('Error fetching resumes list:', err);
    }
  };

  // Fetch saved resume on sign-in, reset on sign-out
  useEffect(() => {
    if (user) {
      const loadInitial = async () => {
        try {
          const { data: dbData, error } = await supabase
            .from('resumes')
            .select('id, title, data, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) throw error;
          if (dbData && dbData.length > 0) {
            setHistory(dbData);
            // Load the most recent one by default into the editor
            setData(dbData[0].data as ResumeData);
            setLoadedResumeId(dbData[0].id);
            setResumeTitle(dbData[0].title);
          } else {
            setHistory([]);
          }
        } catch (err) {
          console.error('Error loading initial user data:', err);
        }
      };
      loadInitial();
    } else {
      setData(initialData);
      setLoadedResumeId(null);
      setResumeTitle('My Resume');
      setHistory([]);
      setActiveTab('create');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-[#0f172a] dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden selection:bg-blue-500 selection:text-white dark:selection:bg-luxury-gold dark:selection:text-slate-950">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent dark:from-luxury-gold/5 pointer-events-none z-0 blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-luxury-bronze/5 pointer-events-none z-0 blur-[100px] rounded-full" />
      
      {/* Header */}
      <header className="relative bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-luxury-gold/15 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 dark:from-luxury-gold dark:to-luxury-bronze rounded-xl shadow-md">
              <FileText className="h-5 w-5 text-white dark:text-[#090d16]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Dual-Mode Resume Builder
              </h1>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-luxury-gold/70 font-semibold tracking-wider uppercase">
                Hybrid Modern Architecture
              </span>
            </div>
          </div>

          {/* Theme Toggler & Header Actions */}
          <div className="flex items-center gap-3">
            {/* User status and sign out */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/60 dark:bg-slate-900/40 text-xs font-semibold shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 max-w-[120px] truncate animate-fade-in" title={user.email ?? ''}>
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/20 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 group shadow-sm flex items-center gap-2 cursor-pointer"
              title={darkMode ? 'Switch to Bright Modern' : 'Switch to Dark Luxury'}
            >
              <div className="relative h-5 w-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.6, rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5 text-luxury-gold group-hover:rotate-45 transition-transform" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0.6, rotate: 90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.6, rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5 text-blue-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-xs font-semibold tracking-wide hidden md:inline-block">
                {darkMode ? 'Dark Luxury' : 'Bright Modern'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation Switcher */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 z-10">
        <div className="flex bg-white/70 dark:bg-slate-950/40 p-1 rounded-2xl border border-slate-200/50 dark:border-luxury-gold/10 w-fit backdrop-blur-md shadow-sm">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 dark:bg-luxury-gold dark:text-slate-950 dark:shadow-luxury-gold/5'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Create Resume
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 dark:bg-luxury-gold dark:text-slate-950 dark:shadow-luxury-gold/5'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            My Resumes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="create-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Side: Form */}
              <div className="lg:col-span-6 xl:col-span-5 w-full">
                <MultiStepForm 
                  data={data} 
                  setData={setData}
                  loadedResumeId={loadedResumeId}
                  setLoadedResumeId={setLoadedResumeId}
                  resumeTitle={resumeTitle}
                  setResumeTitle={setResumeTitle}
                  fetchHistory={fetchHistory}
                />
              </div>
              
              {/* Right Side: Preview */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-3 w-full lg:sticky lg:top-20">
                <div className="glass-card p-3 rounded-2xl flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-luxury-gold flex items-center gap-1.5 px-2">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-luxury-gold animate-pulse" />
                    Select PDF Layout
                  </span>
                  <div className="flex bg-slate-100/80 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200/50 dark:border-luxury-gold/10">
                    <button
                      onClick={() => setTemplate('classic')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-300 ${
                        template === 'classic'
                          ? 'bg-white text-slate-900 shadow-md border border-slate-200/20 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      The Classic
                    </button>
                    <button
                      onClick={() => setTemplate('modern')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-300 ${
                        template === 'modern'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 dark:bg-luxury-gold dark:text-slate-950 dark:shadow-luxury-gold/5'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      Modern Creative
                    </button>
                  </div>
                </div>
                
                <ResumePreview data={data} template={template} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full font-sans"
            >
              <ResumeHistoryDashboard
                history={history}
                loadedResumeId={loadedResumeId}
                onLoadResume={(item) => {
                  setData(item.data);
                  setLoadedResumeId(item.id);
                  setResumeTitle(item.title);
                  setActiveTab('create');
                }}
                onDeleteResume={async (id) => {
                  if (!confirm('Are you sure you want to delete this resume?')) return;
                  try {
                    const { error } = await supabase
                      .from('resumes')
                      .delete()
                      .eq('id', id);

                    if (error) throw error;
                    if (loadedResumeId === id) {
                      setLoadedResumeId(null);
                      setResumeTitle('My Resume');
                    }
                    fetchHistory();
                  } catch (err) {
                    console.error('Error deleting resume:', err);
                  }
                }}
                onDownloadPdf={async (item) => {
                  try {
                    const DocumentTemplate = <ModernCreativeTemplate data={item.data} />;
                    const blob = await pdf(DocumentTemplate).toBlob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `resume_${item.title.replace(/\s+/g, '_')}.pdf`;
                    link.click();
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error('Error exporting historical PDF:', err);
                  }
                }}
                onSignInClick={() => setIsAuthOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Auth Modal rendered at App root */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
