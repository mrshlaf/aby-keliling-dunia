"use client";

import { logoutAction } from "@/app/login/actions";
import { LogOut, User as UserIcon, Home, Coins, Users, Vote, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  session: {
    userId: string;
    username: string;
  } | null;
}

export default function Navbar({ session }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={20} /> },
    { href: "/contributions", label: "Setoran", icon: <Coins size={20} /> },
    { href: "/members", label: "Member", icon: <Users size={20} /> },
    { href: "/polls", label: "Voting", icon: <Vote size={20} /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 md:h-20 items-center justify-between mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">A</div>
              <span className="text-lg md:text-xl font-black tracking-tighter text-foreground font-outfit uppercase">ABY <span className="text-primary font-medium">Trip</span></span>
            </a>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`transition-all hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {session ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                  <UserIcon size={14} className="text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">{session.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl md:rounded-full bg-white border border-border px-3 md:px-4 py-2 text-xs font-black text-destructive hover:bg-destructive/5 transition-all shadow-sm"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline uppercase tracking-widest">Out</span>
                </button>
              </div>
            ) : (
              <a href="/login" className="rounded-full bg-primary px-5 md:px-6 py-2 text-xs md:text-sm font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - LUXURY STYLE */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm h-16 bg-foreground/95 backdrop-blur-xl border border-white/10 rounded-[2rem] px-6 flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <a 
              key={link.href} 
              href={link.href} 
              className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-white/40'}`}
            >
              {link.icon}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </a>
          );
        })}
        {/* Mobile Extra Menu (Logout/Session) */}
        <div className="w-[1px] h-6 bg-white/10 mx-2" />
        <a 
          href={session ? "#" : "/login"} 
          onClick={session ? handleLogout : undefined}
          className="text-white/40 hover:text-destructive transition-colors"
        >
          {session ? <LogOut size={20} className="text-red-400" /> : <UserIcon size={20} />}
        </a>
      </nav>
    </>
  );
}
