"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Plus, Wallet, Sparkles, X, TrendingUp, Info, AlertTriangle, Zap, ArrowRight, ShieldCheck, Coins, CreditCard, Clock } from "lucide-react";
import { fetchUserContributions, submitPayment } from "./actions";
import { supabase } from "@/lib/supabase";

export default function ContributionsPage() {
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [userContributions, setUserContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function initData() {
      // Fetch Weeks
      const { data: wData } = await supabase.from("weeks").select("*").order("id");
      setWeeks(wData || []);

      // Fetch User Contributions
      const cData = await fetchUserContributions();
      setUserContributions(cData);
      
      setLoading(false);
    }
    initData();
  }, []);

  const handlePay = async () => {
    if (!selectedWeek) return;
    setSubmitting(true);
    
    const res = await submitPayment(selectedWeek.id);
    
    if (res.success) {
      const cData = await fetchUserContributions();
      setUserContributions(cData);
      setSelectedWeek(null);
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const getContributionForWeek = (weekId: number) => {
    return userContributions.find(c => c.week_id === weekId);
  };

  const totalSaved = userContributions.reduce((sum, c) => sum + c.amount, 0);
  const totalTarget = 210000;
  const remaining = totalTarget - totalSaved;
  const percentComplete = Math.min(Math.round((totalSaved / totalTarget) * 100), 100);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-mesh">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden pb-40">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 py-12 md:py-24 space-y-16 md:space-y-24 mx-auto px-4 md:px-6">
        
        {/* Massive Wealth Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-16">
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom duration-1000">
             <div className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-2 text-[11px] font-black tracking-[0.3em] text-primary uppercase border border-border shadow-sm">
                <Coins size={14} className="fill-primary" /> Financial Protocol
             </div>
             <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.85] font-outfit">
                PERSONAL <br /> 
                <span className="text-gradient italic text-6xl sm:text-8xl md:text-[9rem]">SETORAN.</span>
             </h1>
             <p className="text-muted-foreground text-lg md:text-3xl font-medium max-w-sm tracking-tight leading-relaxed">
                Manajemen komitmen finansial untuk ekspedisi Lampung 2026.
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto animate-in scale-in duration-1000">
             <div className="glass-card rounded-[3rem] p-10 flex flex-col justify-between space-y-8 border-white group hover:scale-105 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <Wallet size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Total Verified</p>
                   <p className="text-4xl md:text-5xl font-black font-outfit">Rp{totalSaved.toLocaleString('id-ID')}</p>
                </div>
             </div>

             <div className="rounded-[3rem] bg-foreground text-white p-10 flex flex-col justify-between space-y-8 shadow-2xl relative overflow-hidden group hover:scale-105 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 relative z-10">
                   <TrendingUp size={28} />
                </div>
                <div className="relative z-10">
                   <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-2">Quota Remaining</p>
                   <p className="text-4xl md:text-5xl font-black font-outfit">Rp{remaining.toLocaleString('id-ID')}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Progress Shield */}
        <section className={`rounded-[4rem] p-10 md:p-16 border-4 border-white flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-all shadow-luxury relative overflow-hidden ${
           percentComplete === 100 ? 'bg-primary/5' : 'bg-white/40'
        }`}>
           <div className={`relative h-32 w-32 md:h-48 md:w-48 rounded-full border-[10px] md:border-[16px] flex items-center justify-center text-3xl md:text-5xl font-black font-outfit shadow-2xl transition-all ${
              percentComplete === 100 ? 'text-primary border-primary animate-pulse' : 'text-foreground border-muted'
           }`}>
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-current opacity-20" />
              {percentComplete}%
           </div>
           
           <div className="flex-1 space-y-4 text-center md:text-left">
              <h4 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter leading-none italic">
                 {percentComplete === 100 ? "MISSION ACCOMPLISHED." : "STEADY PROGRESS."}
              </h4>
              <p className="text-muted-foreground font-medium text-lg md:text-2xl leading-relaxed tracking-tight max-w-2xl">
                 {percentComplete === 100 
                   ? "Seluruh kewajiban finansial telah terpenuhi secara penuh. Status Personil: ELITE." 
                   : `Kekurangan akumulasi sebesar Rp${remaining.toLocaleString('id-ID')} untuk mencapai status lunas.`}
              </p>
           </div>
        </section>

        {/* The Voucher Collection (Grid of Weeks) */}
        <section className="space-y-12">
           <div className="flex items-center gap-4">
              <ShieldCheck className="text-primary" size={32} />
              <h2 className="text-4xl font-black font-outfit italic tracking-tighter">Commitment <span className="text-primary">Stamps.</span></h2>
           </div>

           <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {weeks.map((week, i) => {
                const contribution = getContributionForWeek(week.id);
                const isVerified = contribution?.is_verified;
                const isDone = !!contribution && contribution.amount >= week.target_amount && isVerified;
                const isPending = !!contribution && !isVerified;
                const progress = ((contribution?.amount || 0) / week.target_amount) * 100;

                return (
                  <div 
                    key={week.id}
                    onClick={() => !isDone && !isPending && setSelectedWeek(week)}
                    className={`glass-card group relative overflow-hidden rounded-[3.5rem] p-10 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer border-white animate-in slide-in-from-bottom-10 duration-700 ${
                      isDone ? 'opacity-80' : ''
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                          <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 ${
                            isDone ? 'bg-primary text-white rotate-12 shadow-3xl shadow-primary/20' : 
                            isPending ? 'bg-orange-500 text-white animate-pulse' :
                            'bg-white border-2 border-border text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:-rotate-6'
                          }`}>
                            {isDone ? <CheckCircle2 size={40} /> : isPending ? <Clock size={40} /> : <Plus size={40} />}
                          </div>
                          
                          <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            isDone ? 'bg-primary/10 text-primary border-primary/20' : 
                            isPending ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-muted/10 text-muted-foreground border-border/50'
                          }`}>
                            {isDone ? "VERIFIED" : isPending ? "PENDING" : "WAITING"}
                          </div>
                       </div>

                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Voucher Unit</p>
                          <h3 className="font-black text-5xl font-outfit tracking-tighter leading-none italic">Week {week.id}</h3>
                          <p className="text-muted-foreground font-black text-xs uppercase mt-3 opacity-60">TARGET: RP{week.target_amount.toLocaleString('id-ID')}</p>
                       </div>

                       <div className="space-y-4 pt-8 border-t border-border/40">
                          <div className="flex justify-between items-end">
                             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Current Load</p>
                             <p className="text-3xl font-black font-outfit text-foreground">
                                Rp{(contribution?.amount || 0).toLocaleString('id-ID')}
                             </p>
                          </div>
                          <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
                             <div 
                               className={`h-full rounded-full transition-all duration-[2000ms] ${isDone ? 'bg-primary' : isPending ? 'bg-orange-500 animate-pulse' : 'bg-foreground/10'}`} 
                               style={{ width: `${progress}%` }}
                             />
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </section>

      </div>

      {/* Payment Confirmation Luxury Modal */}
      {selectedWeek && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedWeek(null)}>
          <div className="w-full max-w-xl bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-12 right-12 h-14 w-14 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-red-500 hover:text-white transition-all" onClick={() => setSelectedWeek(null)}>
              <X size={28} />
            </button>
            
            <div className="space-y-12">
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="h-32 w-32 rounded-[3rem] bg-primary text-white flex items-center justify-center shadow-3xl shadow-primary/20 animate-float">
                     <CreditCard size={64} />
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Protocol Authorization</p>
                     <h3 className="text-5xl font-black font-outfit uppercase tracking-tighter italic">Week {selectedWeek.id}.</h3>
                     <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm">
                        Simpan bukti transfer dan pastikan nominal tepat di Rp35.000 untuk sinkronisasi otomatis.
                     </p>
                  </div>
               </div>

               <div className="p-10 rounded-[3rem] bg-muted/10 border-2 border-dashed border-border flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Required Deposit</span>
                  <p className="text-5xl font-black font-outfit text-primary tracking-tighter italic">Rp35.000</p>
               </div>

               <button 
                  disabled={submitting}
                  className="w-full bg-foreground text-white py-8 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] shadow-3xl shadow-foreground/20 hover:bg-primary transition-all disabled:opacity-50" 
                  onClick={handlePay}
               >
                  {submitting ? "Processing..." : "AUTHORIZE PAYMENT"}
               </button>
               
               <p className="text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Admin confirmation required for final verification.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
