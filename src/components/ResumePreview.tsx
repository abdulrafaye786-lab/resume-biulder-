import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { supabase } from '../lib/supabase';
import type { ResumeData } from '../types';
import { ClassicResumeTemplate } from '../templates/ClassicResumeTemplate';
import { ModernCreativeTemplate } from '../templates/ModernCreativeTemplate';
import { Download, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface Props {
  data: ResumeData;
  template: 'classic' | 'modern';
}

export const ResumePreview: React.FC<Props> = ({ data, template }) => {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const DocumentTemplate = template === 'classic' 
    ? <ClassicResumeTemplate data={data} /> 
    : <ModernCreativeTemplate data={data} />;

  const handleDownload = async () => {
    if (!user) return;
    try {
      // 1. Save data to DB
      const { error: dbError } = await supabase
        .from('resumes')
        .upsert({
          user_id: user.id,
          data: data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      // 2. Generate PDF blob and upload to Storage
      const blob = await pdf(DocumentTemplate).toBlob();
      const filePath = `${user.id}/resume.pdf`;
      
      const { error: storageError } = await supabase
        .storage
        .from('resumes')
        .upload(filePath, blob, { 
          upsert: true,
          contentType: 'application/pdf'
        });

      if (storageError) throw storageError;

      console.log('Saved data and PDF to Supabase successfully.');
    } catch (err) {
      console.error('Error saving download data to Supabase:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-end">
        {!user ? (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow hover:scale-[1.02] active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark cursor-pointer text-sm"
          >
            <Lock className="h-4 w-4" />
            <span>Sign In to Download</span>
          </button>
        ) : (
          <PDFDownloadLink
            document={DocumentTemplate}
            fileName={`resume_${template}.pdf`}
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow hover:scale-[1.02] active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white dark:bg-luxury-gold dark:text-slate-950 dark:hover:bg-luxury-gold-dark cursor-pointer text-sm"
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {({ loading }) => (
              <>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Preparing Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>
      
      <div className="w-full h-[580px] md:h-[630px] glass-card rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200/50 dark:border-luxury-gold/15 bg-white/50 dark:bg-slate-950/20">
        <PDFViewer width="100%" height="100%" className="border-none opacity-90 dark:opacity-95">
          {DocumentTemplate}
        </PDFViewer>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

