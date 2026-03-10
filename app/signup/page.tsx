"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Registrace byla úspěšná! Nyní se můžeš přihlásit.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <span className="text-6xl drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] block mb-4">🍻</span>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-500 tracking-tight">
              Nová registrace
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Přidej se k naší pivní komunitě</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-bold">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-900/30 border border-green-800 text-green-400 p-4 rounded-xl mb-6 text-sm text-center font-bold">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                placeholder="tvoj@email.cz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                placeholder="Minimálně 6 znaků"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-70 mt-4"
            >
              {loading ? "Vytvářím účet..." : "Zaregistrovat se"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Už máš svůj účet?{" "}
            <Link href="/login" className="text-amber-500 font-bold hover:text-amber-400 hover:underline transition-all">
              Přihlas se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}