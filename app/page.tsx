"use client";

import { ArrowRight, BarChart3, Coins, Users, Vote, Sparkles, TrendingUp, Clock, Trophy, MapPin, CheckSquare, Wallet, ShieldCheck, User, X, Check, Eye, ChevronRight, Zap, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchGlobalStats, fetchAllMembersStatus, fetchPracticalData, fetchPendingVerifications, verifyPayment, toggleChecklistItem } from "./contributions/actions";
import { getAuthSession } from "./login/actions";

import abyLogo from "@/images/aby.png";

export default function Home() {
  const [stats, setStats] = useState({ total: 0, memberCount: 0 });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [logistics, setLogistics] = useState<any>({ budgets: [], checklists: [] });
  const [pending, setPending] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    async function loadData() {
      const [sess, globalStats, members, practical, pendingData] = await Promise.all([
        getAuthSession(),
        fetchGlobalStats(),
        fetchAllMembersStatus(),
        fetchPracticalData(),
        fetchPendingVerifications()
      ]);

      setSession(sess);
      setStats(globalStats);
      setLeaderboard(members.sort((a, b) => b.total - a.total).slice(0, 3));
      setLogistics(practical);
      setPending(pendingData);
      setLoading(false);
    }
    loadData();

    const tripDate = new Date("2026-06-20T00:00:00").getTime();
    const interval = setInterval(() => {
      const diff = tripDate - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (id: string) => {
    const res = await verifyPayment(id);
    if (res.success) {
      const [newPending, newStats] = await Promise.all([fetchPendingVerifications(), fetchGlobalStats()]);
      setPending(newPending);
      setStats(newStats);
    }
  };

  const handleToggleCheck = async (id: string, current: boolean) => {
    const res = await toggleChecklistItem(id, !current);
    if (res.success) {
      const practical = await fetchPracticalData();
      setLogistics(practical);
    }
  };

  const isAdmin = session?.role === 'admin';
  const totalAllocated = logistics.budgets.reduce((sum: number, b: any) => sum + b.allocated, 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-mesh">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="container relative z-10 py-12 md:py-24 space-y-20 md:space-y-32 mx-auto px-4 md:px-6 pb-40">
        
        {/* Dynamic Hero Experience */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
           <div className="lg:col-span-12 xl:col-span-7 space-y-10 md:space-y-14 animate-in slide-in-from-left duration-1000">
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 md:h-24 md:w-24 rounded-[2rem] overflow-hidden shadow-3xl border-4 border-white animate-float p-1 bg-white">
                      <img src={abyLogo.src} alt="ABY Logo" className="h-full w-full object-contain rounded-[1.5rem]" />
                   </div>
                   <div className="inline-flex items-center gap-3 rounded-full bg-white/50 backdrop-blur-md px-6 py-2 text-[11px] font-black tracking-[0.3em] text-primary uppercase border border-white/80 shadow-sm">
                      <Zap size={14} className="fill-primary" /> {isAdmin ? "Admin Command Suite" : "Lampung Adventure Protocol"}
                   </div>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] font-outfit">
                   UNLEASH <br /> 
                   <span className="text-gradient italic text-6xl sm:text-8xl md:text-[8rem] lg:text-[11rem]">THE ABY.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-3xl font-medium max-w-2xl leading-relaxed tracking-tight">
                   {isAdmin ? "Otoritas tertinggi pengelolaan logistik dan verifikasi finansial Trip Lampung 2026." : "Pantau tabungan transparan, rincian biaya villa, dan logistik tempur di markas utama kita."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <a href="/contributions" className="flex items-center justify-center gap-4 rounded-3xl bg-foreground px-12 py-7 font-black text-white hover:bg-primary transition-all shadow-2xl hover:shadow-primary/40 group text-sm uppercase tracking-[0.2em] active:scale-95">
                   Enforce Savings <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                </a>
                <a href="/itinerary" className="flex items-center justify-center gap-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white px-12 py-7 font-black text-foreground hover:bg-white transition-all shadow-xl text-sm uppercase tracking-[0.2em]">
                   The Blueprint
                </a>
              </div>
           </div>

           {/* Hero Interactive Widgets */}
           <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 animate-in slide-in-from-right duration-1000">
              
              {/* Massive Countdown Card */}
              <div className="glass-card rounded-[4rem] p-12 space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 shadow-luxury">
                 <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                   <Clock size={200} />
                 </div>
                 <div className="relative">
                    <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">Launch Countdown</p>
                    <div className="flex items-baseline gap-4">
                       <span className="text-9xl font-black font-outfit tracking-tighter text-foreground line-none">{timeLeft.days}</span>
                       <span className="text-2xl font-black text-primary uppercase italic">Days To Go</span>
                    </div>
                    <div className="h-2 w-full bg-foreground/5 rounded-full mt-8 overflow-hidden">
                       <div className="h-full bg-primary animate-pulse" style={{ width: `${(timeLeft.days / 60) * 100}%` }} />
                    </div>
                 </div>
              </div>

              {/* Global Progress Quick-View */}
              <div className="rounded-[4rem] bg-foreground text-white p-12 space-y-8 relative overflow-hidden shadow-2xl group hover:scale-[1.02] transition-all duration-700">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                 <div className="relative flex flex-col justify-between h-full space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center backdrop-blur-md">
                          <Wallet size={32} className="text-white" />
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Global Vault</p>
                          <p className="text-4xl font-black font-outfit tracking-tighter">Rp{stats.total.toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Verified Total</span>
                          <span className="text-primary">{Math.round((stats.total / 2520000) * 100)}%</span>
                       </div>
                       <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                          <div className="h-full bg-primary rounded-full transition-all duration-2000" style={{ width: `${(stats.total / 2520000) * 100}%` }} />
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </section>

        {/* Dynamic Image Break Section */}
        <section className="rounded-[4rem] overflow-hidden relative min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-foreground group shadow-2xl border-4 border-white/50">
           <img 
              src="./luxury_lampung_trip_hero_1776516790626.png" 
              alt="Lampung Visual" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[4000ms] ease-out"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-80" />
           
           {/* Subtle Logo Watermark */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-5 pointer-events-none">
              <img src={abyLogo.src} alt="Brand Watermark" className="w-full grayscale brightness-0 invert" />
           </div>

           <div className="relative z-10 text-center space-y-6 md:space-y-8 px-6">
              <h2 className="text-4xl md:text-8xl font-black font-outfit text-white tracking-tighter leading-none italic">
                 Beyond The <span className="text-primary">Horizon.</span>
              </h2>
              <p className="text-white/60 text-sm md:text-2xl font-medium max-w-xl mx-auto uppercase tracking-widest">Lampung • West Indonesia • 2026</p>
              <div className="flex flex-wrap justify-center gap-3">
                 <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">Private Villa</div>
                 <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">Secret Islands</div>
              </div>
           </div>
        </section>

        {/* Logistics & Command Center */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
           
           {/* Section Title */}
           <div className="xl:col-span-12 space-y-4 text-center md:text-left">
              <h3 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter italic">Group <span className="text-primary">Protocols.</span></h3>
              <p className="text-muted-foreground text-lg md:text-xl font-medium">Bongkar muat persiapan logistik dan verifikasi data.</p>
           </div>

           {/* Left Column (Logistics) */}
           <div className="xl:col-span-7 space-y-12">
              
              {/* Budget Overview Widget */}
              <div className="glass-card rounded-[3.5rem] p-12 space-y-10 shadow-luxury border-white relative overflow-hidden">
                 <div className="flex items-center justify-between border-b border-border pb-8">
                    <div className="flex items-center gap-4">
                       <BarChart3 className="text-primary" size={32} />
                       <h4 className="text-4xl font-black font-outfit tracking-tight leading-none italic">The Ledger.</h4>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Operational Costs</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-4">
                       {logistics.budgets.map((b: any) => (
                          <div key={b.id} className="group/b py-2 space-y-2">
                             <div className="flex justify-between items-center text-sm">
                                <span className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">{b.category}</span>
                                <span className="font-black font-outfit text-lg">Rp{b.allocated.toLocaleString('id-ID')}</span>
                             </div>
                             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary/20 group-hover/b:bg-primary/50 transition-all duration-700" style={{ width: '100%' }} />
                             </div>
                          </div>
                       ))}
                    </div>
                    
                    <div className="rounded-[2.5rem] bg-muted/30 p-10 flex flex-col justify-between border border-border/50 shadow-inner">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Projected Total</p>
                          <p className="text-5xl font-black font-outfit text-foreground tracking-tighter italic">Rp{totalAllocated.toLocaleString('id-ID')}</p>
                       </div>
                       <div className="mt-8 flex items-center gap-3 text-xs font-black text-primary uppercase">
                          <TrendingUp size={16} /> Budget Stabilized
                       </div>
                    </div>
                 </div>
              </div>

              {/* Group Prep Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="rounded-[3rem] border border-border/40 bg-white p-10 shadow-luxury space-y-8">
                    <div className="flex items-center gap-3">
                       <CheckSquare className="text-primary" size={24} />
                       <h4 className="text-2xl font-black font-outfit">Mission Prep.</h4>
                    </div>
                    <div className="space-y-4">
                       {logistics.checklists.slice(0, 4).map((item: any) => (
                          <button 
                             key={item.id} 
                             onClick={() => handleToggleCheck(item.id, item.is_packed)}
                             className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left group/chk ${
                                item.is_packed ? 'bg-primary/5 border-primary text-primary' : 'bg-muted/10 border-border hover:bg-white hover:shadow-lg'
                             }`}
                          >
                             <span className={`text-sm font-black ${item.is_packed ? 'line-through opacity-50' : ''}`}>{item.item_name}</span>
                             <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                item.is_packed ? 'bg-primary border-primary text-white' : 'border-muted-foreground/20 group-hover/chk:border-primary'
                             }`}>
                                {item.is_packed && <Check size={14} />}
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Hall Of Fame Quick View */}
                 <div className="rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 p-10 text-white shadow-2xl flex flex-col justify-between group">
                    <div className="space-y-4">
                       <Trophy size={40} className="text-white mb-4 animate-float" />
                       <h4 className="text-3xl font-black font-outfit italic leading-none">ABY <br /> Legends.</h4>
                       <div className="space-y-4 pt-4">
                          {leaderboard.slice(0, 2).map((m, i) => (
                             <div key={m.id} className="flex items-center justify-between border-b border-white/10 pb-3">
                                <span className="text-[10px] font-black uppercase opacity-60">{i+1}. {m.name}</span>
                                <span className="font-black font-outfit text-sm">Rp{m.total.toLocaleString('id-ID')}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                    <a href="/members" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mt-8 hover:translate-x-2 transition-transform">
                       View All Roster <ChevronRight size={14} />
                    </a>
                 </div>
              </div>

           </div>

           {/* Right Column (Verification Queue - Admin Only) */}
           <div className="xl:col-span-5 h-full">
              {isAdmin ? (
                <div className="rounded-[4rem] bg-foreground text-white p-12 shadow-2xl space-y-10 sticky top-24 min-h-[600px] border-l-8 border-primary">
                   <div className="flex items-center justify-between border-b border-white/10 pb-8">
                      <div className="flex items-center gap-4">
                         <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
                            <ShieldCheck size={28} className="text-white" />
                         </div>
                         <h4 className="text-4xl font-black font-outfit italic tracking-tight">Authority Queue.</h4>
                      </div>
                      <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pending.length} Tasks</span>
                   </div>

                   <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {pending.length > 0 ? pending.map((p, i) => (
                         <div key={p.id} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between gap-6 group hover:bg-white/10 transition-all animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="space-y-2">
                               <p className="text-2xl font-black font-outfit uppercase italic">{p.profiles.name}</p>
                               <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 bg-primary text-[8px] font-black uppercase tracking-widest rounded-full">Week {p.week_id}</span>
                                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rp{p.amount.toLocaleString('id-ID')}</span>
                               </div>
                            </div>
                            <button 
                               onClick={() => handleVerify(p.id)}
                               className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 hover:shadow-3xl hover:shadow-primary/50 transition-all group/btn relative overflow-hidden"
                            >
                               <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                               <Check size={28} className="relative z-10" />
                            </button>
                         </div>
                      )) : (
                         <div className="py-24 text-center space-y-6 opacity-30">
                            <Eye size={64} className="mx-auto" />
                            <p className="font-bold text-xl uppercase tracking-widest">System Clear. <br /> No pending tasks.</p>
                         </div>
                      )}
                   </div>
                </div>
              ) : (
                /* Member Quick Access Card */
                <div className="rounded-[4rem] bg-white border border-border/40 p-12 shadow-luxury h-full flex flex-col justify-between space-y-12">
                   <div className="space-y-6">
                      <Target className="text-primary" size={48} />
                      <h4 className="text-4xl md:text-5xl font-black font-outfit leading-tight tracking-tighter italic">Your Objective.</h4>
                      <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                         Setiap rupiah yang lo tabung adalah langkah lebih dekat ke snorkeling dan villa private di Lampung. Pantau tabungan lo secara rutin bos.
                      </p>
                   </div>
                   <div className="space-y-6">
                      <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/50">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Group Health</span>
                            <span className="text-primary font-black uppercase text-xs">Stable</span>
                         </div>
                         <div className="h-3 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '85%' }} />
                         </div>
                      </div>
                      <a href="/contributions" className="w-full h-20 rounded-[2rem] bg-foreground text-white flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl">
                         Open Personal Vault <ArrowRight size={20} />
                      </a>
                   </div>
                </div>
              )}
           </div>

        </section>

      </div>
    </div>
  );
}
