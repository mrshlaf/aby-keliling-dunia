"use client";

import { useState, useEffect } from "react";
import { Coffee, MapPin, Camera, Car, Sun, Moon, Sparkles, Navigation, Calendar, Clock, ChevronRight, Info } from "lucide-react";
import { fetchItinerary } from "./actions";

export default function ItineraryPage() {
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    async function init() {
      const data = await fetchItinerary();
      setDays(data);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="container py-6 md:py-16 space-y-8 md:space-y-16 animate-in fade-in duration-700 mx-auto px-4 sm:px-6 pb-32 md:pb-40">
      
      {/* Dynamic Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8 md:pb-16">
        <div className="space-y-3 md:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-[9px] md:text-[10px] font-black tracking-widest text-primary uppercase border border-primary/10">
            <Sparkles size={12} /> The Grand Plan
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter font-outfit leading-none">ABY <span className="text-primary italic">Adventure.</span></h1>
          <p className="text-muted-foreground text-sm md:text-xl font-medium max-w-sm">
            Rencana perjalanan lengkap dari hari pertama sampe pulang. Disiapin biar nggak bingung pas di lokasi.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-4">
           <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Mapping Trip...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* Day Selector (Mobile Horizontal, Desktop Vertical) */}
          <div className="lg:col-span-3 flex lg:flex-col gap-3 md:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {days.map((day) => (
              <button 
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] border font-black text-[10px] md:text-sm uppercase tracking-widest transition-all whitespace-nowrap min-w-[120px] lg:min-w-0 ${
                  activeDay === day.day 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10' 
                    : 'bg-white border-border/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Calendar size={16} className="md:w-[18px]" /> Day {day.day}
              </button>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="lg:col-span-9 space-y-10 md:space-y-12">
            {days.find(d => d.day === activeDay)?.activities.map((act: any, idx: number) => (
              <div key={act.id} className="relative pl-10 md:pl-16 group animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                
                {/* Timeline vertical bar */}
                <div className="absolute left-3.5 md:left-6 top-0 bottom-0 w-[2px] bg-muted/40 group-last:bottom-auto group-last:h-6" />
                
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 h-8 md:h-12 w-8 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-all border duration-500 overflow-hidden ${
                   idx === 0 ? 'bg-primary border-primary text-white scale-110 shadow-primary/20' : 'bg-white border-border text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Clock size={idx === 0 ? 14 : 14} className="relative z-10 md:w-4" />
                </div>

                <div className="space-y-4 md:space-y-6">
                   <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2 md:gap-3">
                         <span className="text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">{act.time_range}</span>
                         <div className="h-[1px] w-6 md:w-8 bg-primary/20" />
                         <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded uppercase truncate max-w-[150px] md:max-w-none">
                            <MapPin size={10} /> {act.location}
                         </div>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black font-outfit tracking-tight group-hover:text-primary transition-colors">{act.activity}</h3>
                   </div>

                   <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-border/40 shadow-luxury group-hover:shadow-2xl transition-all space-y-4">
                      <p className="text-muted-foreground font-medium text-base md:text-lg leading-relaxed">
                         {act.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                         <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/30 border border-border/50 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Navigation size={12} /> Directions
                         </div>
                         <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/30 border border-border/50 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Camera size={12} /> Photo Spot
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}

            {days.length === 0 && (
              <div className="py-20 text-center space-y-4">
                 <MapPin size={48} className="mx-auto text-muted-foreground/20" />
                 <p className="font-bold text-muted-foreground italic">Itinerary belum di-finalisasi oleh Admin.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Info Footnote */}
      <section className="mt-12 md:mt-16 bg-foreground text-background rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
         <div className="relative space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
               <Info className="text-primary" size={24} />
               <h3 className="text-2xl md:text-3xl font-black font-outfit">Catatan Penting.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-neutral-400 font-medium text-sm md:text-base">
               <p>
                  Waktu di atas masih estimasi fleksibel. Tergantung kondisi di jalan dan mood rombongan pas lagi mager di pantai.
               </p>
               <p>
                  Pastiin bawa charger/powerbank karena rutenya bakal banyak island hopping yang jauh dari stop kontak.
               </p>
            </div>
         </div>
      </section>

    </div>
  );
}
