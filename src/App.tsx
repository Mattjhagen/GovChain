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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

// --- Types ---

interface Bill {
  id?: string;
  billNumber: string;
  action: string;
  sponsor: string;
  date: string;
  insight: string;
}

// --- Sub-components ---

const PublicProofLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
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
        Public <span className="text-gold-500">Proof</span>
      </span>
      <span className="text-[8px] font-medium tracking-[0.2em] text-slate-400 uppercase">
        Transparency • Accountability
      </span>
    </div>
  </div>
);

const Navbar = ({ onOpenInvolved }: { onOpenInvolved: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Bills', href: '#bills' },
    { name: 'Track', href: '#track' },
    { name: 'About', href: '#about' },
    { name: 'API', href: '#api', isMock: true }
  ];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.isMock) {
      e.preventDefault();
      alert(`${item.name} access is reserved for verified government nodes. Concept demonstration only.`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <PublicProofLogo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="text-[10px] font-bold text-slate-400 hover:text-gold-400 transition-colors uppercase tracking-[0.2em]"
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={onOpenInvolved}
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              Get Involved
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-900 border-b border-white/10 px-4 py-8 flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-lg font-medium text-slate-200"
                onClick={(e) => {
                  handleNavClick(e, item);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={() => { onOpenInvolved(); setIsOpen(false); }}
              className="bg-gold-500 text-slate-950 px-5 py-3 rounded-lg font-bold text-center"
            >
              Get Involved
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-2xl flex flex-col items-center text-center space-y-3 group transition-all hover:ring-1 hover:ring-gold-500/30"
  >
    <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
      <Icon size={24} />
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-bold tracking-tight text-white font-mono">{value}</h3>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const ActivityRow = ({ billNumber, action, sponsor, date, insight }: { billNumber: string, action: string, sponsor: string, date: string, insight: string, key?: React.Key }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
    <td className="py-4 px-4 font-mono text-gold-400 text-sm">{billNumber}</td>
    <td className="py-4 px-4">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 uppercase letter-spacing-1">
        {action}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-300">{sponsor}</td>
    <td className="py-4 px-4 text-sm text-slate-500 italic">{date}</td>
    <td className="py-4 px-4 text-right">
      <div className="relative group/view inline-block">
        <button className="text-xs font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform uppercase tracking-tighter">
          View <ChevronRight size={14} />
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-slate-900 border border-gold-500/30 rounded-xl opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all z-20 shadow-2xl pointer-events-none scale-95 group-hover/view:scale-100 origin-bottom-right">
           <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1">
             <div className="w-2 h-2 bg-gold-500 rounded-full" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Bill Insights</span>
           </div>
           <p className="text-[10px] text-slate-300 leading-relaxed font-medium">{insight}</p>
        </div>
      </div>
    </td>
  </tr>
);

const InvolvementModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        email,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-gold-500/30 rounded-3xl p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Sent</h3>
                <p className="text-slate-400">Verifying your node credentials... We will contact you soon.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Join the Network</h3>
                  <p className="text-slate-400 text-sm">Become a legislative node operator or advocate for local transparency.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="senator@capitol.gov"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all font-mono text-sm"
                    />
                  </div>
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Request Access"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [isInvolvedModalOpen, setIsInvolvedModalOpen] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const q = query(collection(db, 'bills'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const fetchedBills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
        
        // If empty (newly deployed), use mock data as fallback for now
        if (fetchedBills.length === 0) {
          setBills([
            { billNumber: "H.R. 7215", action: "Introduced", sponsor: "Rep. John Smith", date: "May 20, 2024", insight: "Initial draft focuses on renewable energy infrastructure." },
            { billNumber: "S. 4122", action: "Amendment Added", sponsor: "Sen. Jane Doe", date: "May 19, 2024", insight: "Added provision for independent audits of project spending." },
            { billNumber: "H.R. 6789", action: "Committee Vote", sponsor: "Rep. Mark Johnson", date: "May 18, 2024", insight: "Passed Agriculture Committee with 14-3 support." },
            { billNumber: "S. 2103", action: "Amendment Added", sponsor: "Sen. Emily Davis", date: "May 17, 2024", insight: "Modified Section 4 to include urban farmer protections." },
            { billNumber: "H.R. 3355", action: "Passed House", sponsor: "Rep. Michael Brown", date: "May 16, 2024", insight: "Final version includes 12 blockchain-verified amendments." },
          ]);
        } else {
          setBills(fetchedBills);
        }
      } catch (err) {
        console.error("Error fetching bills, using mock data", err);
        // Fallback for demo if rules/data not ready
        setBills([
          { billNumber: "H.R. 7215", action: "Introduced", sponsor: "Rep. John Smith", date: "May 20, 2024", insight: "Initial draft focuses on renewable energy infrastructure." },
        ]);
      } finally {
        setLoadingBills(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-gold-500/30">
      <Navbar onOpenInvolved={() => setIsInvolvedModalOpen(true)} />
      <InvolvementModal isOpen={isInvolvedModalOpen} onClose={() => setIsInvolvedModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] z-0" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Transparent Legislation. <br />
                <span className="text-gold-500 text-glow-gold">Accountable Government.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
                Blockchain-verified records of every bill, every change, every time. 
                Securing the democratic process through immutable technology.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => window.location.href = "#bills"}
                className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
              >
                Explore Bills
              </button>
              <button 
                onClick={() => window.location.href = "#about"}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/10"
              >
                How It Works
              </button>
            </motion.div>

            {/* Search Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); alert("Search feature mocked for concept presentation."); }}
              className="relative group max-w-2xl"
            >
              <div className="absolute inset-y-0 left-5 flex items-center text-slate-500">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Search bills, representatives, or keywords..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-5 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-white placeholder-slate-500 text-lg transition-all focus:bg-slate-900"
              />
              <button type="submit" className="absolute right-3 top-2.5 bottom-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 px-6 rounded-xl font-bold transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative" id="dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard icon={FileText} label="Bills Tracked" value="12,458" />
            <StatCard icon={ExternalLink} label="Amendments Recorded" value="98,732" />
            <StatCard icon={Users} label="Representatives Monitored" value="1,240" />
            <StatCard icon={Shield} label="Immutable Records" value="100%" />
          </div>
        </div>
      </section>

      {/* Main Content: Activity & Flow */}
      <section className="py-20" id="bills">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Recent Activity</h2>
                <div className="h-1 w-12 bg-gold-500 mt-2 rounded-full" />
              </div>
              <button 
                onClick={() => alert("Redirecting to Full Activity Ledger...")}
                className="text-xs font-bold text-slate-500 hover:text-gold-500 transition-colors uppercase tracking-widest"
              >
                View All
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bill</th>
                    <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                    <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sponsor</th>
                    <th className="py-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="py-4 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {loadingBills ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-gold-500" size={24} />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hydrating Chain Data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : bills.map((bill, idx) => (
                    <ActivityRow 
                      key={bill.id || idx}
                      billNumber={bill.billNumber} 
                      action={bill.action} 
                      sponsor={bill.sponsor} 
                      date={bill.date} 
                      insight={bill.insight} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
            id="track"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">How It Works</h2>
              <p className="text-slate-400 font-light text-lg leading-relaxed">
                Our proprietary legislative nodes capture every digital event within the Capitol, sealing them into a distributed audit trail.
              </p>
            </div>

            <div className="space-y-8 relative">
              {[
                { 
                  icon: FileText, 
                  title: "Captured", 
                  desc: "Legislation and amendments are captured from official sources in real-time." 
                },
                { 
                  icon: Shield, 
                  title: "Verified", 
                  desc: "Data is verified, signed, and recorded on the blockchain network." 
                },
                { 
                  icon: LinkIcon, 
                  title: "Immutable", 
                  desc: "Records are immutable and publicly accessible forever. No hidden names." 
                }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start relative">
                  <div className="w-16 h-16 shrink-0 bg-slate-900 border border-gold-500/30 rounded-2xl flex items-center justify-center text-gold-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] z-10">
                    <step.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white">{step.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gold-500/5 rounded-2xl p-6 border border-gold-500/10 flex items-center gap-6">
              <div className="w-12 h-12 shrink-0 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-500 animate-pulse">
                <Shield size={24} />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Blockchain Security Active</h5>
                <p className="text-xs text-slate-500">Currently syncronizing with 1,240 federal nodes. Integrity check complete.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 pb-20">
            <div className="col-span-2 space-y-6">
              <PublicProofLogo />
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Empowering citizens with verifiable truth and radical accountability. Our mission is to make the legislative process impossible to obscure.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: "https://x.com/MattyJamesHagen" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/mattjhagen/" },
                  { icon: Github, href: "https://github.com/Mattjhagen" },
                  { icon: Mail, href: "mailto:Matty@p3lending.space" }
                ].map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-gold-500 hover:bg-slate-800 transition-all">
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Platform</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#track" className="hover:text-gold-400 transition-colors">Legislative Nodes</a></li>
                <li><a href="#dashboard" className="hover:text-gold-400 transition-colors">Audit Ledger</a></li>
                <li><a href="#api" onClick={(e) => { e.preventDefault(); alert("API documentation coming in v2.0"); }} className="hover:text-gold-400 transition-colors">API Docs</a></li>
                <li><a href="#status" onClick={(e) => { e.preventDefault(); alert("System status: Optimal"); }} className="hover:text-gold-400 transition-colors">Status</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#about" className="hover:text-gold-400 transition-colors">Our Mission</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Whitepaper released following beta launch."); }} className="hover:text-gold-400 transition-colors">Whitepaper</a></li>
                <li><a href="mailto:Matty@p3lending.space" className="hover:text-gold-400 transition-colors">Contact</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy is automated via zero-knowledge proofs."); }} className="hover:text-gold-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-medium">
              &copy; 2026 Public Proof. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <a href="/sitemap.xml" target="_blank" className="hover:text-slate-400 transition-colors">Sitemap</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">Security Audit</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Status Indicator */}
      <div className="fixed bottom-6 right-6 z-40 bg-slate-900/80 backdrop-blur-md border border-gold-500/30 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Network Verified: Block #821,442</span>
      </div>
    </div>
  );
}
