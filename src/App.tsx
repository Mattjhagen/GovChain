import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <PublicProofLogo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Dashboard', 'Bills', 'Track', 'About', 'API'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-400 hover:text-gold-400 transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
            <button className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
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
            {['Dashboard', 'Bills', 'Track', 'About', 'API'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-slate-200"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="bg-gold-500 text-slate-950 px-5 py-3 rounded-lg font-bold text-center">
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

const ActivityRow = ({ bill, action, sponsor, date }: { bill: string, action: string, sponsor: string, date: string }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
    <td className="py-4 px-4 font-mono text-gold-400 text-sm">{bill}</td>
    <td className="py-4 px-4">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 uppercase letter-spacing-1">
        {action}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-300">{sponsor}</td>
    <td className="py-4 px-4 text-sm text-slate-500 italic">{date}</td>
    <td className="py-4 px-4 text-right">
      <button className="text-xs font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform uppercase tracking-tighter">
        View <ChevronRight size={14} />
      </button>
    </td>
  </tr>
);

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-gold-500/30">
      <Navbar />
      
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
              <button className="bg-gold-500 hover:bg-gold-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                Explore Bills
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/10">
                How It Works
              </button>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
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
              <button className="absolute right-3 top-2.5 bottom-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 px-6 rounded-xl font-bold transition-colors">
                Search
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative">
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
      <section className="py-20">
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
              <button className="text-xs font-bold text-slate-500 hover:text-gold-500 transition-colors uppercase tracking-widest">View All</button>
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
                  <ActivityRow bill="H.R. 7215" action="Introduced" sponsor="Rep. John Smith" date="May 20, 2024" />
                  <ActivityRow bill="S. 4122" action="Amendment Added" sponsor="Sen. Jane Doe" date="May 19, 2024" />
                  <ActivityRow bill="H.R. 6789" action="Committee Vote" sponsor="Rep. Mark Johnson" date="May 18, 2024" />
                  <ActivityRow bill="S. 2103" action="Amendment Added" sponsor="Sen. Emily Davis" date="May 17, 2024" />
                  <ActivityRow bill="H.R. 3355" action="Passed House" sponsor="Rep. Michael Brown" date="May 16, 2024" />
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
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 pb-20">
            <div className="col-span-2 space-y-6">
              <PublicProofLogo />
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Empowering citizens with verifiable truth and radical accountability. Our mission is to make the legislative process impossible to obscure.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github, Mail].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-gold-500 hover:bg-slate-800 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Platform</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Legislative Nodes</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Audit Ledger</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Status</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-medium">
              &copy; 2026 Public Proof. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security Audit</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
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
