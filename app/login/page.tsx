"use client";

import { useState } from "react";
import { Sparkles, User, Lock, ArrowLeft } from "lucide-react";
import { loginAction, signUpAction } from "./actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        if (username.trim().includes(" ")) {
          throw new Error("Username nggak boleh pake spasi!");
        }
        const res = await signUpAction(username, password);
        if (res.error) throw new Error(res.error);
        if (res.success) {
          window.location.href = "/";
        }
      } else {
        const res = await loginAction(username, password);
        if (res.error) throw new Error(res.error);
        if (res.success) {
          window.location.href = "/";
        }
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-6 mx-auto container animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-10 rounded-[2.5rem] border border-border/50 bg-white p-12 shadow-luxury relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="text-center space-y-3 relative">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Sparkles size={24} />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground font-outfit">
            {isSignUp ? "Grup Baru?" : "Gaskeun!"}
          </h2>
          <p className="text-muted-foreground font-medium">
            {isSignUp ? "Bikin akun tabungan lo sekarang." : "Masuk buat liat tabungan kelompok."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 relative">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground ml-1 uppercase tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="marshal_aufa"
                  className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all font-bold text-foreground"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground ml-1 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all font-bold text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 font-extrabold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-lg uppercase tracking-widest"
          >
            {loading ? "Sabar..." : isSignUp ? "Daftar Akun" : "Masuk Sekarang"}
          </button>
        </form>

        {message && (
          <div className={`p-4 rounded-2xl border text-center text-sm font-bold animate-in zoom-in-95 ${
            message.includes("Error") ? "bg-red-50 border-red-100 text-red-500" : "bg-primary/5 border-primary/10 text-primary"
          }`}>
            {message}
          </div>
        )}

        <div className="text-center space-y-4 pt-4 border-t border-border/50">
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
            className="text-sm font-bold text-primary hover:underline underline-offset-4"
          >
            {isSignUp ? "Udah punya akun? Login aja" : "Belum punya akun? Daftar gratis"}
          </button>
          
          <div className="pt-2">
            <a href="/" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              <ArrowLeft size={14} /> Balik ke Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
