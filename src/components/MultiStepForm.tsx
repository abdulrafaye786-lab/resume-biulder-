import React, { useState } from 'react';
import type { ResumeData, Experience, Education } from '../types';
import { 
  PlusCircle, 
  Trash2, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Plus,
  CloudUpload,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  loadedResumeId: string | null;
  setLoadedResumeId: (id: string | null) => void;
  resumeTitle: string;
  setResumeTitle: (title: string) => void;
  fetchHistory: () => Promise<void>;
}

export const MultiStepForm: React.FC<Props> = ({ 
  data, 
  setData,
  loadedResumeId,
  setLoadedResumeId,
  resumeTitle,
  setResumeTitle,
  fetchHistory
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(0);
  const [newSkill, setNewSkill] = useState<string>('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async (forceNewCopy = false) => {
    if (!user) return;
    setSaveLoading(true);
    setSaveStatus('idle');

    try {
      const isUpdating = loadedResumeId !== null && !forceNewCopy;
      
      const payload: any = {
        user_id: user.id,
        title: resumeTitle || 'Resume',
        data: data,
        updated_at: new Date().toISOString()
      };

      if (isUpdating) {
        // Update existing row
        const { error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', loadedResumeId);

        if (error) throw error;
      } else {
        // Insert new row
        const { data: insertData, error } = await supabase
          .from('resumes')
          .insert(payload)
          .select('id')
          .single();

        if (error) throw error;
        if (insertData) {
          setLoadedResumeId(insertData.id);
        }
      }

      setSaveStatus('success');
      await fetchHistory();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving resume:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const steps = [
    { label: 'Personal', icon: User },
    { label: 'Summary', icon: FileText },
    { label: 'Experience', icon: Briefcase },
    { label: 'Education', icon: GraduationCap },
    { label: 'Skills', icon: Wrench },
  ];

  const updatePersonalInfo = (field: string, value: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience, 
        { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    const newExp = [...data.experience];
    newExp.splice(index, 1);
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData((prev) => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education, 
        { id: Date.now().toString(), institution: '', degree: '', graduationDate: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    const newEdu = [...data.education];
    newEdu.splice(index, 1);
    setData((prev) => ({ ...prev, education: newEdu }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...data.skills];
    updatedSkills.splice(index, 1);
    setData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(newSkill);
      setNewSkill('');
    }
  };

  const quickSkills = [
    'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 
    'Node.js', 'Next.js', 'UI/UX Design', 'Figma', 'REST APIs', 'Git'
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Stepper Component
  const renderStepper = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          
          {/* Active progress bar line */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 dark:bg-luxury-gold -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isCompleted = step > idx;
            const isActive = step === idx;
            return (
              <div key={idx} className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-sm shadow-md ${
                    isActive 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 dark:bg-luxury-gold dark:text-slate-950 dark:ring-luxury-gold/20' 
                      : isCompleted
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                        : 'bg-white text-slate-400 border border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </button>
                <span className={`text-[10px] sm:text-xs font-bold mt-2 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-luxury-gold' 
                    : isCompleted 
                      ? 'text-slate-600 dark:text-slate-400' 
                      : 'text-slate-400 dark:text-slate-600'
                }`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 flex flex-col h-[580px] md:h-[630px] transition-all duration-300">
      {/* Header & Stepper */}
      {renderStepper()}

      {/* Dynamic Form Area */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-luxury-gold/10 pb-3">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Personal Details
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Let's start with your basic contact credentials.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={data.personalInfo.firstName} 
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={data.personalInfo.lastName} 
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={data.personalInfo.email} 
                      onChange={(e) => updatePersonalInfo('email', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      value={data.personalInfo.phone} 
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={data.personalInfo.location} 
                      onChange={(e) => updatePersonalInfo('location', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Professional Title</label>
                    <input 
                      type="text" 
                      value={data.personalInfo.title} 
                      onChange={(e) => updatePersonalInfo('title', e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                      placeholder="e.g. Lead Frontend Architect"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-luxury-gold/10 pt-4 mt-2">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-luxury-gold mb-3 uppercase tracking-wider">Social Profiles</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">LinkedIn Profile</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.linkedin || ''} 
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-xs font-medium" 
                        placeholder="e.g. linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">GitHub Portfolio</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.github || ''} 
                        onChange={(e) => updatePersonalInfo('github', e.target.value)} 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-xs font-medium" 
                        placeholder="e.g. github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Portfolio Link</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.portfolio || ''} 
                        onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-xs font-medium" 
                        placeholder="e.g. portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL SUMMARY */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-luxury-gold/10 pb-3">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pitch yourself in a few sentences. Highlight your key strengths and goals.</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Bio / Summary</label>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {data.personalInfo.summary.length} characters
                    </span>
                  </div>
                  <textarea 
                    value={data.personalInfo.summary} 
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)} 
                    rows={8} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium resize-none custom-scrollbar" 
                    placeholder="Describe your career highlights, technical skills, and achievements in 3-5 lines..."
                  />
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-luxury-gold/5 border border-blue-200/20 dark:border-luxury-gold/10 space-y-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-luxury-gold uppercase tracking-wider block">Writing Tips:</span>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1">
                    <li>Start with your title and years of experience (e.g. "Senior Architect with 8+ years...").</li>
                    <li>Highlight your top 2 or 3 skill domains or major achievements.</li>
                    <li>Keep it professional, action-oriented, and focused.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 3: WORK HISTORY */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-luxury-gold/10 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Work Experience
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Add your professional career history.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={addExperience} 
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-luxury-gold/10 text-blue-600 dark:text-luxury-gold hover:opacity-85 font-semibold transition-all shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Job
                  </button>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {data.experience.map((exp: Experience, index: number) => (
                      <motion.div 
                        key={exp.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 border border-slate-200/60 dark:border-luxury-gold/10 rounded-2xl relative bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm group"
                      >
                        <button 
                          type="button"
                          onClick={() => removeExperience(index)} 
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
                          title="Remove Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-3 pr-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Company</label>
                              <input 
                                type="text" 
                                value={exp.company} 
                                onChange={(e) => updateExperience(index, 'company', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Position</label>
                              <input 
                                type="text" 
                                value={exp.position} 
                                onChange={(e) => updateExperience(index, 'position', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
                              <input 
                                type="text" 
                                value={exp.startDate} 
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                                placeholder="e.g. Jan 2021" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">End Date</label>
                              <input 
                                type="text" 
                                value={exp.endDate} 
                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                                placeholder="e.g. Present or Dec 2023" 
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description / Key Accomplishments</label>
                            <textarea 
                              value={exp.description} 
                              onChange={(e) => updateExperience(index, 'description', e.target.value)} 
                              rows={3} 
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none resize-none custom-scrollbar" 
                              placeholder="Detail your responsibilities and positive impact..."
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {data.experience.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-200 dark:border-luxury-gold/10 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mb-2">No work history added yet.</p>
                      <button 
                        type="button"
                        onClick={addExperience} 
                        className="px-4 py-2 bg-blue-600 text-white dark:bg-luxury-gold dark:text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 shadow"
                      >
                        Add Your First Job
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-luxury-gold/10 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Education Credentials
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Input your degrees, certificates or courses.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={addEducation} 
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-luxury-gold/10 text-blue-600 dark:text-luxury-gold hover:opacity-85 font-semibold transition-all shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Degree
                  </button>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {data.education.map((edu: Education, index: number) => (
                      <motion.div 
                        key={edu.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 border border-slate-200/60 dark:border-luxury-gold/10 rounded-2xl relative bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm"
                      >
                        <button 
                          type="button"
                          onClick={() => removeEducation(index)} 
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-3 pr-6">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Institution / School</label>
                            <input 
                              type="text" 
                              value={edu.institution} 
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)} 
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Degree / Course</label>
                              <input 
                                type="text" 
                                value={edu.degree} 
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                                placeholder="e.g. B.S. Computer Science"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Graduation Date</label>
                              <input 
                                type="text" 
                                value={edu.graduationDate} 
                                onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)} 
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/10 bg-white/60 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none" 
                                placeholder="e.g. May 2017" 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {data.education.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-200 dark:border-luxury-gold/10 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mb-2">No education added yet.</p>
                      <button 
                        type="button"
                        onClick={addEducation} 
                        className="px-4 py-2 bg-blue-600 text-white dark:bg-luxury-gold dark:text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 shadow"
                      >
                        Add Your First Degree
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: SKILLS */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-luxury-gold/10 pb-3">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Skills & Technical Expertise
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Add tags that highlight your primary talents.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Add Technical Skills</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)} 
                      onKeyDown={handleSkillKeyDown}
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:ring-luxury-gold/20 dark:focus:border-luxury-gold outline-none transition-all duration-300 text-sm font-medium" 
                      placeholder="Type skill & press Enter or Comma..."
                    />
                    <button 
                      type="button"
                      onClick={() => { addSkill(newSkill); setNewSkill(''); }}
                      className="p-2.5 bg-blue-600 text-white dark:bg-luxury-gold dark:text-[#090d16] rounded-xl hover:opacity-90 font-bold transition-opacity flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Added Skills (Click to delete)</label>
                  <div className="flex flex-wrap gap-2 p-4 border border-slate-200/50 dark:border-luxury-gold/10 rounded-2xl bg-white/30 dark:bg-slate-950/30 min-h-[100px] align-content-start">
                    <AnimatePresence>
                      {data.skills.map((skill: string, index: number) => (
                        <motion.button
                          type="button"
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => removeSkill(index)}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:bg-luxury-gold/10 dark:text-luxury-gold dark:border-luxury-gold/10 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/30 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm group"
                        >
                          {skill}
                          <span className="text-[10px] opacity-60 group-hover:text-red-500">×</span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    {data.skills.length === 0 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold self-center mx-auto">No skills added yet.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quick Add Suggestions</label>
                  <div className="flex flex-wrap gap-2">
                    {quickSkills.map((skill) => {
                      const exists = data.skills.includes(skill);
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => !exists && addSkill(skill)}
                          disabled={exists}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                            exists 
                              ? 'bg-slate-100 text-slate-300 border-slate-200 dark:bg-slate-900/40 dark:text-slate-700 dark:border-slate-800/40 cursor-not-allowed'
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-800'
                          }`}
                        >
                          + {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="border-t border-slate-100 dark:border-luxury-gold/10 pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
            step === 0 
              ? 'text-slate-300 cursor-not-allowed dark:text-slate-800'
              : 'text-slate-600 hover:bg-slate-100 dark:text-luxury-gold dark:hover:bg-luxury-gold/10'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Save to Cloud Controls */}
        {user && (
          <div className="flex items-center gap-1.5">
            <input 
              type="text" 
              value={resumeTitle} 
              onChange={(e) => setResumeTitle(e.target.value)} 
              className="w-24 sm:w-32 px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/40 outline-none text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-luxury-gold/30 font-medium"
              placeholder="Resume Title..."
            />
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saveLoading}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] sm:text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  saveStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                    : saveStatus === 'error'
                      ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                      : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 dark:bg-luxury-gold/10 dark:text-luxury-gold dark:border-luxury-gold/10 dark:hover:bg-luxury-gold/20'
                }`}
                title={loadedResumeId ? "Overwrite existing resume" : "Save as new resume"}
              >
                {saveLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : saveStatus === 'success' ? (
                  <Check className="w-3 h-3" />
                ) : saveStatus === 'error' ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <CloudUpload className="w-3 h-3" />
                )}
                <span>
                  {saveLoading 
                    ? 'Saving...' 
                    : saveStatus === 'success' 
                      ? 'Saved!' 
                      : loadedResumeId 
                        ? 'Update' 
                        : 'Save'}
                </span>
              </button>

              {loadedResumeId && (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saveLoading}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] sm:text-xs font-bold tracking-wide transition-all cursor-pointer bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Save as a new copy"
                >
                  <Plus className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              )}
            </div>
          </div>
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md dark:shadow-luxury-gold/5"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Finished editing
          </div>
        )}
      </div>
    </div>
  );
};

