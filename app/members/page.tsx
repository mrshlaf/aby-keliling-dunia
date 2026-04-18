"use client";

export const dynamic = "force-dynamic";

import { CheckCircle, AlertCircle, Search, User, CreditCard, Clock, X, Trash2, MessageCircle, Sparkles, ShieldCheck, UserCircle, Award, Target, Info, Flame, Shell, Umbrella, Anchor, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAllMembersStatus, deleteMember } from "../contributions/actions";
import { getAuthSession } from "@/app/login/actions";

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const sess = await getAuthSession();
      setSession(sess);

      const data = await fetchAllMembersStatus();
      setMembers(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Yakin mau hapus si ${username} dari grup? Data setorannya bakal ilang permanen!`)) return;
    
    setIsDeleting(userId);
    const res = await deleteMember(userId);
    if (res.success) {
      setMembers(members.filter(m => m.id !== userId));
    } else {
      alert(res.error);
    }
    setIsDeleting(null);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase())
  );

  const isAdmin = session?.role === 'admin';

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden pb-48">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-200/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 py-10 md:py-24 mx-auto px-4 sm:px-6">
        
        {/* Massive Luxury Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-16 mb-12">
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-2 text-[11px] font-black tracking-[0.3em] text-primary uppercase border border-border shadow-sm">
              <Zap size={14} className="fill-primary" /> The Global Roster
            </div>
             <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.85] font-outfit text-foreground capitalize">
                The <br /> 
                <span className="text-gradient italic text-6xl sm:text-8xl md:text-[10rem]">Circle.</span>
             </h1>
             <p className="text-muted-foreground text-sm md:text-3xl font-medium max-w-sm tracking-tight leading-relaxed">
               Otoritas penuh pemantauan personil dan distribusi kekayaan grup.
             </p>
          </div>
          
          <div className="relative w-full max-w-xl group animate-in slide-in-from-right duration-700">
            <div className="absolute inset-0 bg-primary/20 rounded-[1.5rem] md:rounded-[2.5rem] blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search Identity..." 
                className="w-full rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-white bg-white/40 backdrop-blur-xl py-4 md:py-8 pl-14 md:pl-20 pr-6 md:pr-10 text-lg md:text-xl font-bold outline-none focus:border-primary focus:bg-white transition-all shadow-luxury"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6 text-center">
             <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
             <p className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Syncing Circle Data...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-10">
            {filteredMembers.map((member, i) => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="glass-card group relative rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 transition-all hover:scale-[1.01] hover:shadow-2xl cursor-pointer border-white animate-in fade-in duration-1000 slide-in-from-bottom-10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-[1.5rem] transition-all duration-500 ${
                  member.status === 'ON TRACK' ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-destructive'
                }`} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  {/* Left: Profile Information */}
                  <div className="flex items-center gap-5 md:gap-8">
                    <div className="h-20 w-20 md:h-28 md:w-28 rounded-2xl md:rounded-[2.5rem] bg-white border border-border flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                      <UserCircle size={40} className="md:w-[60px] md:h-[60px] relative z-10 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-1.5 md:space-y-3 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl md:text-5xl font-black font-outfit tracking-tighter text-foreground truncate">{member.name}</span>
                        {member.role === 'admin' && <ShieldCheck size={20} className="text-primary shrink-0" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-foreground text-[8px] font-black text-white uppercase tracking-widest">ID:{member.username}</span>
                        <p className="text-muted-foreground text-sm md:text-xl font-medium italic truncate">"{member.bio || 'Ready for Lampung!'}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Stats & Actions */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex items-center gap-10 md:gap-16">
                      <div className="space-y-1">
                        <p className="text-[7px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest">Capital</p>
                        <p className="text-xl md:text-3xl font-black font-outfit text-primary">Rp{member.total?.toLocaleString('id-ID') || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[7px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                        <div className={`text-[9px] md:text-xs font-black uppercase ${member.status === 'ON TRACK' ? 'text-primary' : 'text-destructive'}`}>
                          ● {member.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 lg:justify-end">
                      <a 
                        href={`https://wa.me/?text=Heh ${member.name}, jangan lupa setoran trip Lampung ya! Buruan bayar di ABY Trip Tracker.`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-[1.5rem] bg-green-500 text-white flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-xl shadow-green-500/10 font-black text-[10px] md:text-xs uppercase tracking-widest"
                      >
                         <MessageCircle size={16} /> WhatsApp
                      </a>
                      {isAdmin && member.id !== session?.userId && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(member.id, member.username); }}
                          disabled={isDeleting === member.id}
                          className="h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-[1.5rem] bg-white border border-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all disabled:opacity-50 shrink-0"
                        >
                           <Trash2 size={20} className={isDeleting === member.id ? 'animate-spin' : ''} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedMember(null)}>
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <button className="absolute top-8 md:top-12 right-8 md:right-12 h-10 w-10 md:h-14 md:w-14 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-red-500 hover:text-white transition-all" onClick={() => setSelectedMember(null)}>
              <X size={24} />
            </button>
            <div className="space-y-8 md:space-y-12">
               <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white shadow-3xl shadow-primary/20">
                     <UserCircle size={80} />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                     <h3 className="text-4xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-none">{selectedMember.name}</h3>
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">{selectedMember.role === 'admin' ? 'Strategic Commander' : 'Active Elite Member'}</p>
                  </div>
               </div>
               <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-muted/10 border-2 border-dashed border-border flex flex-col items-center gap-3 md:gap-4">
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Personal Manifesto</p>
                  <p className="text-xl md:text-3xl font-bold italic font-outfit text-center leading-tight">"{selectedMember.bio || 'Ready for Lampung!'}"</p>
               </div>
               <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-foreground text-white text-center">
                     <span className="text-[8px] md:text-[9px] font-black opacity-50 uppercase tracking-[0.3em]">Circle Status</span>
                     <p className="text-3xl md:text-5xl font-black font-outfit text-primary">{selectedMember.progress}%</p>
                  </div>
                  <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-primary text-white text-center shadow-2xl shadow-primary/30">
                     <span className="text-[8px] md:text-[9px] font-black opacity-60 uppercase tracking-[0.3em]">Capital Status</span>
                     <p className="text-2xl md:text-4xl font-black font-outfit">LUNAS</p>
                  </div>
               </div>
               <button onClick={() => setSelectedMember(null)} className="w-full bg-muted/20 text-muted-foreground py-6 md:py-8 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] hover:bg-primary hover:text-white transition-all">Close Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
