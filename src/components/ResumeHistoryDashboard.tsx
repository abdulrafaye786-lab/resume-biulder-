import React from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  Lock, 
  Calendar, 
  Mail, 
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  history: any[];
  loadedResumeId: string | null;
  onLoadResume: (item: any) => void;
  onDeleteResume: (id: string) => void;
  onDownloadPdf: (item: any) => void;
  onSignInClick: () => void;
}

export const ResumeHistoryDashboard: React.FC<Props> = ({
  history,
  loadedResumeId,
  onLoadResume,
  onDeleteResume,
  onDownloadPdf,
  onSignInClick
}) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center animate-fade-in">
        <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/20 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-blue-50 dark:bg-luxury-gold/5 text-blue-600 dark:text-luxury-gold rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-luxury-gold/25">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
            Cloud Resume History
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-6 leading-relaxed">
            Sign up or sign in to save your resumes in the cloud, access them from anywhere, and track your downloads.
          </p>
          <button
            onClick={onSignInClick}
            className="w-full py-3 px-6 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark transition-all duration-300 shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm tracking-wide"
          >
            Access My Resumes
          </button>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center animate-fade-in">
        <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/20 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-luxury-gold/45 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-luxury-gold/10">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
            No Saved Resumes
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-6 leading-relaxed">
            You haven't saved any resumes yet. Swap to the **Create Resume** tab to design, name, and save your progress!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            My Cloud Resumes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage, load, and download your cloud-saved resumes.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-luxury-gold/70 bg-white/80 dark:bg-slate-950/40 px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-luxury-gold/10 shadow-sm">
          Total Resumes: {history.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => {
          const personal = item.data?.personalInfo;
          const skills = item.data?.skills || [];
          const isCurrentActive = loadedResumeId === item.id;

          return (
            <div
              key={item.id}
              className={`group glass-card rounded-3xl overflow-hidden border transition-all duration-300 relative flex flex-col ${
                isCurrentActive
                  ? 'border-blue-500 bg-blue-500/5 shadow-blue-500/5 dark:border-luxury-gold/80 dark:bg-luxury-gold/5 dark:shadow-luxury-gold/5'
                  : 'border-slate-200/60 bg-white/50 dark:border-luxury-gold/15 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-luxury-gold/30 hover:-translate-y-1'
              }`}
            >
              {/* Colored header gradient band */}
              <div className={`h-2.5 w-full bg-gradient-to-r ${
                isCurrentActive
                  ? 'from-blue-600 to-indigo-600 dark:from-luxury-gold dark:to-luxury-bronze'
                  : 'from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800 group-hover:from-blue-500/40 group-hover:to-indigo-500/40 dark:group-hover:from-luxury-gold/40 dark:group-hover:to-luxury-bronze/40'
              }`} />

              <div className="p-5 flex flex-col flex-1">
                {/* Active Indicator Pin */}
                {isCurrentActive && (
                  <span className="absolute top-5 right-5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-luxury-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 dark:bg-luxury-gold"></span>
                  </span>
                )}

                {/* Resume Title */}
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 truncate pr-6 mb-1">
                  {item.title}
                </h3>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  Saved {new Date(item.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>

                {/* Profile Preview Block */}
                <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900/60 rounded-2xl p-3.5 space-y-2 mb-4">
                  <div className="font-extrabold text-xs text-slate-700 dark:text-slate-300 truncate">
                    {personal?.firstName || 'Unnamed'} {personal?.lastName || ''}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-luxury-gold/70 truncate">
                    {personal?.title || 'No Title'}
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200/20 dark:border-slate-800/40 space-y-1.5">
                    {personal?.email && (
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 dark:text-slate-400 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-300 dark:text-slate-500 shrink-0" />
                        {personal.email}
                      </div>
                    )}
                    {personal?.location && (
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 dark:text-slate-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 dark:text-slate-500 shrink-0" />
                        {personal.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Pills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-6">
                    {skills.slice(0, 3).map((skill: string) => (
                      <span 
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100/40 dark:bg-luxury-gold/5 dark:text-luxury-gold dark:border-luxury-gold/10"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[8px] font-extrabold text-slate-400 dark:text-slate-500">
                        +{skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Footer Buttons */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => onLoadResume(item)}
                    className="flex-1 py-2 px-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isCurrentActive ? 'Active Editor' : 'Load Resume'}</span>
                  </button>

                  <button
                    onClick={() => onDownloadPdf(item)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-luxury-gold rounded-xl transition-all border border-slate-200/50 dark:border-luxury-gold/15 cursor-pointer flex items-center justify-center active:scale-[0.95]"
                    title="Download PDF"
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>

                  <button
                    onClick={() => onDeleteResume(item.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 rounded-xl transition-all border border-slate-200/50 dark:border-luxury-gold/15 cursor-pointer flex items-center justify-center active:scale-[0.95]"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
