import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  FileText, 
  Users, 
  Database, 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  Link as LinkIcon,
  CheckCircle2,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Loader2,
  AlertTriangle,
  Zap,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import WhitepaperPage from './components/WhitepaperPage';

// --- Types ---
interface Bill {
  id?: string;
  billNumber: string;
  action: string;
  sponsor: string;
  date: string;
  insight: string;
}

// --- Components ---

const PublicProofLogo = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-gold-500 fill-none stroke-current stroke-[6] stroke-linejoin-round">
          <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center translate-y-[-1px]">
          <div className="w-1.5 h-4 bg-gold-400 rounded-sm mb-0.5" />
          <div className="w-5 h-1 bg-gold-400 rounded-full" />
          <LinkIcon className="w-3 h-3 text-gold-200 mt-1" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-white uppercase">
          Gov<span className="text-gold-500">Chain</span>
        </span>
        <span className="text-[8px] font-medium tracking-[0.2em] text-slate-400 uppercase">
          Transparency • Resilience
        </span>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center space-y-3 group transition-all hover:ring-1 hover:ring-gold-500/30">
    <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
      <Icon size={24} />
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-bold tracking-tight text-white font-mono">{value}</h3>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const ActivityRow = ({ billNumber, action, sponsor, date, insight }: { billNumber: string, action: string, sponsor: string, date: string, insight: string }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
    <td className="py-4 px-4 font-mono text-gold-400 text-sm">{billNumber}</td>
    <td className="py-4 px-4">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 uppercase letter-spacing-1">{action}</span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-300">{sponsor}</td>
    <td className="py-4 px-4 text-sm text-slate-500 italic">{date}</td>
    <td className="py-4 px-4 text-right">
      <button className="text-xs font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 ml-auto transition-transform uppercase tracking-tighter">Verify <ChevronRight size={14} /></button>
    </td>
  </tr>
);

const HomePage = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const q = query(collection(db, 'bills'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const fetchedBills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
        if (fetchedBills.length === 0) {
          setBills([
            { billNumber: "H.R. 7215", action: "Introduced", sponsor: "Rep. John Smith", date: "May 20, 2024", insight: "Resilience protocol active." },
            { billNumber: "S. 4122", action: "Amendment", sponsor: "Sen. Jane Doe", date: "May 19, 2024", insight: "Immutable audit trail." },
          ]);
        } else {
          setBills(fetchedBills);
        }
      } catch (err) { console.error(err); } finally { setLoadingBills(false); }
    };
    fetchBills();
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[10px] font-bold uppercase tracking-widest">
              <Shield size={12} /> Decentralized Infrastructure
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Eliminating Single Points of <span className="text-gold-500 text-glow-gold">Failure.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
              Protecting government records, land deeds, and legislative integrity from hacks and systemic corruption through distributed resilience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/whitepaper')} className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_10px_30px_rgba(245,158,11,0.2)] flex items-center gap-2">
                <FileText size={20} /> Read Whitepaper
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard / Stats */}
      <section className="py-12 max-w-7xl mx-auto px-4" id="dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Database} label="Distributed Nodes" value="1,240" />
          <StatCard icon={Zap} label="Uptime Resilience" value="99.99%" />
          <StatCard icon={Shield} label="SPOF Risk" value="0%" />
          <StatCard icon={CheckCircle2} label="Verified Records" value="12k+" />
        </div>
      </section>

      {/* Activity Table */}
      <section className="py-20 max-w-7xl mx-auto px-4" id="bills">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">Public Audit Trail</h2>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/10">
              <tr>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Record</th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source</th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="py-4 px-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody>
              {loadingBills ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500 uppercase tracking-widest">Syncing Nodes...</td></tr>
              ) : (
                bills.map((bill, idx) => <ActivityRow key={idx} {...bill} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </motion.main>
  );
};

export default function App() {
  const [isInvolvedModalOpen, setIsInvolvedModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen font-sans selection:bg-gold-500/30 bg-slate-950 text-slate-300">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <PublicProofLogo />
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-gold-500' : 'text-slate-400 hover:text-gold-500'}`}>Home</Link>
            <Link to="/whitepaper" className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${location.pathname === '/whitepaper' ? 'text-gold-500' : 'text-slate-400 hover:text-gold-500'}`}>Whitepaper</Link>
            <Link to="/whitepaper" className="bg-gold-500 text-slate-950 px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]">Get Involved</Link>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/whitepaper" element={<WhitepaperPage onBack={() => navigate('/')} />} />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 pb-20">
            <div className="col-span-2 space-y-6">
              <PublicProofLogo />
              <p className="text-slate-400 max-w-sm">Decentralizing government records to ensure trust is mathematical, not just political.</p>
              <div className="flex gap-4">
                <a href="https://github.com/Mattjhagen" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-gold-500 transition-all"><Github size={18} /></a>
                <a href="mailto:matty@p3lending.space" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-gold-500 transition-all"><Mail size={18} /></a>
              </div>
            </div>
            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Documentation</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/whitepaper" className="hover:text-gold-500 transition-colors flex items-center gap-2"><FileText size={14} /> Whitepaper</Link></li>
                <li><a href="#" className="hover:text-gold-500 transition-colors">Resilience Model</a></li>
                <li><a href="#dashboard" className="hover:text-gold-500 transition-colors">Audit Ledger</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Legal</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-gold-500 transition-colors">SPOF Analysis</a></li>
                <li><a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-widest border-t border-white/5 pt-10">
            &copy; {new Date().getFullYear()} GovChain Resilience Project. Distributed Safety Net Active.
          </p>
        </div>
      </footer>
    </div>
  );
}
