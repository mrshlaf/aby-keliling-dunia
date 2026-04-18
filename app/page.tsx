"use client";

export const dynamic = "force-dynamic";

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

      <div className="container relative z-10 py-10 md:py-24 space-y-16 md:space-y-32 mx-auto px-4 sm:px-6 pb-32 md:pb-48">
        
        {/* Dynamic Hero Experience */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
           <div className="lg:col-span-12 xl:col-span-7 space-y-8 md:space-y-14 animate-in slide-in-from-left duration-1000">
              <div className="space-y-4 md:space-y-8">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 md:h-24 md:w-24 rounded-[2rem] overflow-hidden shadow-3xl border-4 border-white animate-float p-1 bg-white">
                      <img src={abyLogo.src} alt="ABY Logo" className="h-full w-full object-contain rounded-[1.5rem]" />
                   </div>
                   <div className="inline-flex items-center gap-3 rounded-full bg-white/50 backdrop-blur-md px-6 py-2 text-[11px] font-black tracking-[0.3em] text-primary uppercase border border-white/80 shadow-sm">
                      <Zap size={14} className="fill-primary" /> {isAdmin ? "Admin Command Suite" : "Lampung Adventure Protocol"}
                   </div>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-[0.85] font-outfit">
                   UNLEASH <br /> 
                   <span className="text-gradient italic text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem]">THE ABY.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-3xl font-medium max-w-2xl leading-relaxed tracking-tight">
                   {isAdmin ? "Otoritas tertinggi pengelolaan logistik dan verifikasi finansial Trip Lampung 2026." : "Pantau tabungan transparan, rincian biaya villa, dan logistik tempur di markas utama kita."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <a href="/contributions" className="flex items-center justify-center gap-4 rounded-3xl bg-foreground px-8 md:px-12 py-5 md:py-7 font-black text-white hover:bg-primary transition-all shadow-2xl hover:shadow-primary/40 group text-xs md:text-sm uppercase tracking-[0.2em] active:scale-95">
                   Enforce Savings <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                </a>
                <a href="/itinerary" className="flex items-center justify-center gap-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white px-8 md:px-12 py-5 md:py-7 font-black text-foreground hover:bg-white transition-all shadow-xl text-xs md:text-sm uppercase tracking-[0.2em]">
                   The Blueprint
                </a>
              </div>
           </div>

           {/* Hero Interactive Widgets */}
           <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 animate-in slide-in-from-right duration-1000">
              
              {/* Massive Countdown Card */}
              <div className="glass-card rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 space-y-4 md:space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 shadow-luxury">
                 <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                   <Clock size={200} />
                 </div>
                 <div className="relative">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2 md:mb-4">Launch Countdown</p>
                    <div className="flex items-baseline gap-2 md:gap-4">
                       <span className="text-7xl md:text-9xl font-black font-outfit tracking-tighter text-foreground line-none">{timeLeft.days}</span>
                       <span className="text-xl md:text-2xl font-black text-primary uppercase italic">Days To Go</span>
                    </div>
                    <div className="h-1.5 md:h-2 w-full bg-foreground/5 rounded-full mt-6 md:mt-8 overflow-hidden">
                       <div className="h-full bg-primary animate-pulse" style={{ width: `${(timeLeft.days / 60) * 100}%` }} />
                    </div>
                 </div>
              </div>

              {/* Global Progress Quick-View */}
              <div className="rounded-[3rem] md:rounded-[4rem] bg-foreground text-white p-8 md:p-12 space-y-6 md:space-y-8 relative overflow-hidden shadow-2xl group hover:scale-[1.02] transition-all duration-700">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                 <div className="relative flex flex-col justify-between h-full space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="h-12 w-12 md:h-16 md:w-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/10 flex items-center justify-center backdrop-blur-md">
                          <Wallet size={24} className="text-white md:w-8 md:h-8" />
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Global Vault</p>
                          <p className="text-2xl md:text-4xl font-black font-outfit tracking-tighter">Rp{stats.total.toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Verified Total</span>
                          <span className="text-primary">{Math.round((stats.total / 2520000) * 100)}%</span>
                       </div>
                       <div className="h-3 md:h-4 w-full bg-white/5 rounded-full overflow-hidden p-0.5 md:p-1 border border-white/10">
                          <div className="h-full bg-primary rounded-full transition-all duration-2000" style={{ width: `${(stats.total / 2520000) * 100}%` }} />
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </section>

        {/* High-End Spotlight Section */}
        <section className="-mx-4 sm:-mx-6 lg:mx-0 rounded-[3rem] md:rounded-[5rem] overflow-hidden relative min-h-[500px] md:min-h-[700px] flex items-center bg-foreground group shadow-luxury border-8 border-white">
           <img 
              src="./luxury_lampung_trip_hero_1776516790626.png" 
              alt="Lampung Visual" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[6000ms] ease-out mix-blend-luminosity"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/60 to-transparent z-10" />
           
           <div className="relative z-20 w-full px-8 md:px-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-4 md:space-y-6 max-w-4xl">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                   Mission Blueprint
                 </div>
                 <h2 className="text-6xl sm:text-8xl md:text-[12rem] font-black font-outfit text-white tracking-tighter leading-[0.8] uppercase italic">
                    Beyond <br />
                    <span className="text-gradient">The Horizon.</span>
                 </h2>
                 <p className="text-white/40 text-xs md:text-2xl font-medium tracking-wide max-w-xl md:leading-relaxed">
                   Eksplorasi elit di pesisir barat Indonesia. <br className="hidden md:block" /> Privasi mutlak, dominasi total.
                 </p>
              </div>

              <div className="flex flex-col gap-4 md:gap-6 md:pb-10">
                 <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 space-y-4 md:space-y-6">
                    <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em]">Target Location</p>
                    <div className="space-y-2">
                       <p className="text-2xl md:text-4xl font-black text-white font-outfit uppercase">Lampung, ID</p>
                       <p className="text-[10px] md:text-sm text-white/40 font-bold uppercase tracking-widest">Est. August 2026</p>
                    </div>
                    <div className="flex gap-2">
                       <span className="h-1.5 w-12 rounded-full bg-primary" />
                       <span className="h-1.5 w-4 rounded-full bg-white/20" />
                       <span className="h-1.5 w-4 rounded-full bg-white/20" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Logistics & Command Center */}
        <section className="mt-24 md:mt-48 grid grid-cols-1 xl:grid-cols-12 gap-10 md:gap-12 items-start">
           
           {/* Section Title */}
           <div className="xl:col-span-12 space-y-3 md:space-y-4 text-center md:text-left">
              <h3 className="text-3xl md:text-6xl font-black font-outfit tracking-tighter italic">Group <span className="text-primary">Protocols.</span></h3>
              <p className="text-muted-foreground text-base md:text-xl font-medium">Bongkar muat persiapan logistik dan verifikasi data.</p>
           </div>

           {/* Left Column (Logistics) */}
           <div className="xl:col-span-7 space-y-10 md:space-y-12">
              
              {/* Budget Overview Widget */}
              <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 space-y-8 md:space-y-10 shadow-luxury border-white relative overflow-hidden">
                 <div className="flex items-center justify-between border-b border-border pb-6 md:pb-8">
                    <div className="flex items-center gap-3 md:gap-4">
                       <BarChart3 className="text-primary md:w-8 md:h-8" size={24} />
                       <h4 className="text-2xl md:text-4xl font-black font-outfit tracking-tight leading-none italic">The Ledger.</h4>
                    </div>
                    <span className="hidden sm:inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Operational Costs</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20">
                    <div className="space-y-4">
                       {logistics.budgets.map((b: any) => (
                          <div key={b.id} className="group/b py-2 space-y-2">
                             <div className="flex justify-between items-center text-sm">
                                <span className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">{b.category}</span>
                                <span className="font-black font-outfit text-base md:text-lg">Rp{b.allocated.toLocaleString('id-ID')}</span>
                             </div>
                             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary/20 group-hover/b:bg-primary/50 transition-all duration-700" style={{ width: '100%' }} />
                             </div>
                          </div>
                       ))}
                    </div>
                    
                    <div className="rounded-[2rem] md:rounded-[2.5rem] bg-muted/30 p-8 md:p-10 flex flex-col justify-between border border-border/50 shadow-inner">
                       <div className="space-y-1 md:space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Projected Total</p>
                          <p className="text-3xl md:text-5xl font-black font-outfit text-foreground tracking-tighter italic">Rp{totalAllocated.toLocaleString('id-ID')}</p>
                       </div>
                       <div className="mt-6 md:mt-8 flex items-center gap-3 text-xs font-black text-primary uppercase">
                          <TrendingUp size={16} /> Budget Stabilized
                       </div>
                    </div>
                 </div>
              </div>

              {/* Group Prep Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/40 bg-white p-8 md:p-10 shadow-luxury space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3">
                       <CheckSquare className="text-primary md:w-6 md:h-6" size={20} />
                       <h4 className="text-xl md:text-2xl font-black font-outfit">Mission Prep.</h4>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       {logistics.checklists.slice(0, 4).map((item: any) => (
                          <button 
                             key={item.id} 
                             onClick={() => handleToggleCheck(item.id, item.is_packed)}
                             className={`w-full flex items-center justify-between p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all text-left group/chk ${
                                item.is_packed ? 'bg-primary/5 border-primary text-primary' : 'bg-muted/10 border-border hover:bg-white hover:shadow-lg'
                             }`}
                          >
                             <span className={`text-xs md:text-sm font-black ${item.is_packed ? 'line-through opacity-50' : ''}`}>{item.item_name}</span>
                             <div className={`h-5 w-5 md:h-6 md:w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                item.is_packed ? 'bg-primary border-primary text-white' : 'border-muted-foreground/20 group-hover/chk:border-primary'
                             }`}>
                                {item.is_packed && <Check size={12} />}
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Hall Of Fame Quick View */}
                 <div className="rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 p-8 md:p-10 text-white shadow-2xl flex flex-col justify-between group">
                    <div className="space-y-4">
                       <Trophy size={40} className="text-white mb-2 md:mb-4 animate-float md:w-10 md:h-10 w-8 h-8" />
                       <h4 className="text-2xl md:text-3xl font-black font-outfit italic leading-none">ABY <br /> Legends.</h4>
                       <div className="space-y-3 md:space-y-4 pt-4">
                          {leaderboard.slice(0, 2).map((m, i) => (
                             <div key={m.id} className="flex items-center justify-between border-b border-white/10 pb-2 md:pb-3">
                                <span className="text-[10px] font-black uppercase opacity-60 truncate max-w-[120px]">{i+1}. {m.name}</span>
                                <span className="font-black font-outfit text-xs md:text-sm whitespace-nowrap">Rp{m.total.toLocaleString('id-ID')}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                    <a href="/members" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mt-6 md:mt-8 hover:translate-x-2 transition-transform">
                       View All Roster <ChevronRight size={14} />
                    </a>
                 </div>
              </div>

           </div>

           {/* Right Column (Verification Queue - Admin Only) */}
           <div className="xl:col-span-5 h-full">
              {isAdmin ? (
                <div className="rounded-[2.5rem] md:rounded-[4rem] bg-foreground text-white p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10 sticky top-24 min-h-[400px] md:min-h-[600px] border-l-8 border-primary">
                   <div className="flex items-center justify-between border-b border-white/10 pb-6 md:pb-8">
                      <div className="flex items-center gap-3 md:gap-4">
                         <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center">
                            <ShieldCheck size={20} className="text-white md:w-7 md:h-7" />
                         </div>
                         <h4 className="text-2xl md:text-4xl font-black font-outfit italic tracking-tight">Authority Queue.</h4>
                      </div>
                      <span className="bg-white/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">{pending.length} Tasks</span>
                   </div>

                   <div className="space-y-4 md:space-y-6 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {pending.length > 0 ? pending.map((p, i) => (
                         <div key={p.id} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between gap-4 md:gap-6 group hover:bg-white/10 transition-all animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="space-y-1 md:space-y-2 grow min-w-0">
                               <p className="text-lg md:text-2xl font-black font-outfit uppercase italic truncate">{p.profiles.name}</p>
                               <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                  <span className="px-2 py-0.5 bg-primary text-[7px] md:text-[8px] font-black uppercase tracking-widest rounded-full">Week {p.week_id}</span>
                                  <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Rp{p.amount.toLocaleString('id-ID')}</span>
                               </div>
                            </div>
                            <button 
                               onClick={() => handleVerify(p.id)}
                               className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center hover:scale-110 hover:shadow-3xl hover:shadow-primary/50 transition-all group/btn relative overflow-hidden"
                            >
                               <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                               <Check size={20} className="relative z-10 md:w-7 md:h-7" />
                            </button>
                         </div>
                      )) : (
                         <div className="py-16 md:py-24 text-center space-y-4 md:space-y-6 opacity-30">
                            <Eye size={48} className="mx-auto md:w-16 md:h-16" />
                            <p className="font-bold text-base md:text-xl uppercase tracking-widest">System Clear. <br /> No pending tasks.</p>
                         </div>
                      )}
                   </div>
                </div>
              ) : (
                /* Member Quick Access Card */
                <div className="rounded-[2.5rem] md:rounded-[4rem] bg-white border border-border/40 p-8 md:p-12 shadow-luxury h-full flex flex-col justify-between space-y-8 md:space-y-12">
                   <div className="space-y-4 md:space-y-6">
                      <Target className="text-primary md:w-12 md:h-12" size={32} />
                      <h4 className="text-3xl md:text-5xl font-black font-outfit leading-tight tracking-tighter italic">Your Objective.</h4>
                      <p className="text-muted-foreground text-sm md:text-lg font-medium leading-relaxed">
                         Setiap rupiah yang lo tabung adalah langkah lebih dekat ke snorkeling dan villa private di Lampung. Pantau tabungan lo secara rutin bos.
                      </p>
                   </div>
                   <div className="space-y-4 md:space-y-6">
                      <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-muted/20 border border-border/50">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Group Health</span>
                            <span className="text-primary font-black uppercase text-[10px]">Stable</span>
                         </div>
                         <div className="h-2 md:h-3 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '85%' }} />
                         </div>
                      </div>
                      <a href="/contributions" className="w-full h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-foreground text-white flex items-center justify-center gap-4 font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl">
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
