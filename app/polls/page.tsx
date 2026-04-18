"use client";

import { useState, useEffect } from "react";
import { Clock, MessageSquare, Vote, Plus, CheckCircle2, X, Sparkles } from "lucide-react";
import { fetchPolls, castVote, createPoll } from "./actions";
import { getAuthSession } from "@/app/login/actions";

export default function PollsPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePool, setShowCreatePool] = useState(false);
  
  // Create Poll State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      // FIX: Use Server Action instead of direct session import
      const sess = await getAuthSession();
      setSession(sess);

      const data = await fetchPolls();
      setPolls(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleVote = async (pollId: string, optionId: string) => {
    const res = await castVote(pollId, optionId);
    if (res.success) {
      const data = await fetchPolls();
      setPolls(data);
    } else {
      alert(res.error);
    }
  };

  const handleCreatePoll = async () => {
    if (!question || options.some(o => !o)) {
      alert("Isi semua pertanyaan dan opsi dulu ya!");
      return;
    }
    setIsSubmitting(true);
    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await createPoll(question, deadline, options);
    
    if (res.success) {
      const data = await fetchPolls();
      setPolls(data);
      setShowCreatePool(false);
      setQuestion("");
      setOptions(["", ""]);
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const isAdmin = session?.role === 'admin';

  return (
    <div className="container py-8 md:py-20 space-y-12 md:space-y-16 animate-in fade-in duration-700 mx-auto px-4 md:px-6">
      
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-10 md:pb-16">
        <div className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-[10px] font-black tracking-widest text-primary uppercase border border-primary/10">
            <Sparkles size={12} /> Democratic Decisions
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter font-outfit leading-none">Group <span className="text-primary italic">Voice.</span></h1>
          <p className="text-muted-foreground text-base md:text-xl font-medium max-w-sm leading-relaxed">
            Voting transparan buat semua keputusan trip. Adil, terbuka, dan tanpa drama.
          </p>
        </div>
        
        {session && (
          <button 
            onClick={() => setShowCreatePool(true)}
            className="flex items-center justify-center gap-3 rounded-2xl bg-foreground px-8 md:px-10 py-4 md:py-5 font-black text-white hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 group text-sm md:text-sm uppercase tracking-widest active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> Buat Polling
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
           Mendengarkan Aspirasi...
        </div>
      ) : (
        <div className="grid gap-8 md:gap-12 grid-cols-1 lg:grid-cols-2">
          {polls.map((poll) => (
            <div key={poll.id} className="rounded-[2.5rem] md:rounded-[3.5rem] border border-border/50 bg-white p-8 md:p-12 shadow-luxury transition-all hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-8 md:mb-12">
                <div className="space-y-3 md:space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-border/50">
                    <Clock size={10} /> Active Decision
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black font-outfit leading-tight tracking-tight">{poll.question}</h3>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                {poll.options.map((option: any) => {
                  const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const isVoted = poll.voted === option.id;

                  return (
                    <div key={option.id} onClick={() => handleVote(poll.id, option.id)} className="group/opt relative cursor-pointer space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1 md:px-2">
                        <span className="flex items-center gap-2 text-foreground truncate max-w-[200px]">
                          {option.option_text}
                          {isVoted && <CheckCircle2 size={14} className="text-primary animate-in zoom-in duration-300" />}
                        </span>
                        <span className={isVoted ? "text-primary" : "text-muted-foreground"}>{percentage}%</span>
                      </div>
                      <div className={`relative h-14 md:h-16 w-full overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-500 ${
                        isVoted ? 'border-primary bg-primary/[0.03]' : 'border-border bg-muted/20 hover:border-muted-foreground/30'
                      }`}>
                        <div 
                          className={`h-full transition-all duration-1000 ${isVoted ? 'bg-primary/20' : 'bg-foreground/5'}`} 
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6">
                          <span className={`text-xs md:text-sm font-black ${isVoted ? 'text-primary' : 'text-muted-foreground'}`}>{option.votes} Suara</span>
                          {isVoted && <span className="text-[9px] font-black uppercase tracking-widest text-primary hidden sm:inline">Your Choice</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 md:mt-12 flex items-center justify-between border-t border-border/50 pt-6 md:pt-10">
                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground font-black text-[9px] md:text-[11px] uppercase tracking-widest">
                  <MessageSquare size={16} className="text-primary" /> {poll.totalVotes} Personil Bersuara
                </div>
                {!poll.voted && (
                   <span className="text-[9px] font-black text-primary uppercase italic animate-pulse">Vote Now!</span>
                )}
              </div>
            </div>
          ))}

          {polls.length === 0 && (
             <div className="lg:col-span-2 py-32 text-center space-y-4">
                <Vote size={48} className="mx-auto text-muted-foreground/20" />
                <p className="font-bold text-muted-foreground italic">Gak ada polling aktif.</p>
             </div>
          )}
        </div>
      )}

      {/* Create Poll Modal - Mobile Optimized */}
      {showCreatePool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowCreatePool(false)}>
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-8 right-8 text-muted-foreground hover:text-foreground" onClick={() => setShowCreatePool(false)}>
              <X size={24} />
            </button>
            
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-2 md:space-y-3">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">New Poll</p>
                <h3 className="text-3xl md:text-5xl font-black font-outfit leading-none tracking-tighter text-foreground italic">Buat Polling.</h3>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] font-black text-muted-foreground ml-2 uppercase tracking-[0.2em]">Pertanyaan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Pilih Villa atau Hotel?" 
                    className="w-full rounded-2xl border border-border bg-muted/20 py-4 md:py-5 px-6 md:px-8 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all font-bold text-lg md:text-xl" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] font-black text-muted-foreground ml-2 uppercase tracking-[0.2em]">Opsi Jawaban</label>
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder={`Opsi ${i+1}`} 
                         className="flex-1 rounded-xl md:rounded-2xl border border-border bg-muted/10 py-3 md:py-4 px-5 md:px-6 outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold" 
                         value={opt}
                         onChange={(e) => {
                           const newOpts = [...options];
                           newOpts[i] = e.target.value;
                           setOptions(newOpts);
                         }}
                       />
                       {options.length > 2 && (
                         <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                           <X size={18} />
                         </button>
                       )}
                    </div>
                  ))}
                  <button 
                    onClick={() => setOptions([...options, ""])}
                    className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 py-2 px-2 hover:bg-primary/5 rounded-lg transition-all"
                  >
                    <Plus size={14} /> Tambah Opsi
                  </button>
                </div>
              </div>

              <div className="pt-4 md:pt-6 space-y-4">
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest" 
                  onClick={handleCreatePoll}
                >
                  {isSubmitting ? "Processing..." : "Bikin Polling 🔥"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
