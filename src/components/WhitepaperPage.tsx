import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, AlertTriangle, FileText, Download } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface WhitepaperPageProps {
  onBack: () => void;
}

const WhitepaperPage = ({ onBack }: WhitepaperPageProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchWhitepaper = async () => {
      try {
        const response = await fetch('/Whitepaper.md');
        if (!response.ok) throw new Error('Failed to load whitepaper content');
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchWhitepaper();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="pt-32 pb-20 max-w-4xl mx-auto px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gold-500 font-bold uppercase tracking-widest text-xs mb-12 hover:text-gold-400 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Home
      </button>

      <div className="glass-card p-8 md:p-16 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />

        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Decrypting Records...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-500/50" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">System Error</h3>
                <p className="text-slate-400">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              <MarkdownRenderer content={content} />
              
              <footer className="pt-16 mt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Distributed Safety Net Active</p>
                  <p className="text-xs text-slate-600 italic">Verify integrity at GovChain Resilience Project.</p>
                </div>
                <a 
                  href="/Whitepaper.md" 
                  download 
                  className="bg-gold-500/10 hover:bg-gold-500 text-gold-500 hover:text-slate-950 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group border border-gold-500/20"
                >
                  <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                  Raw Markdown
                </a>
              </footer>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WhitepaperPage;
