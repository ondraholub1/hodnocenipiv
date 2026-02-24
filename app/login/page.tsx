"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Chyba: " + error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    // TADY JE ZMĚNA: Elegantní tmavší gradient (Amber -> Orange -> Dark)
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-900">
      
      {/* Karta s formulářem - bez bublinek, čistý design */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-orange-200">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🍻</div>
          <h1 className="text-3xl font-extrabold text-gray-900">Vítej zpátky!</h1>
          <p className="text-gray-500 mt-2">Přihlas se do svého pivního deníku.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="tvuj@email.cz"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="******"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition shadow-lg disabled:opacity-70"
          >
            {loading ? "Přihlašuji..." : "Přihlásit se"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Ještě nemáš účet?{" "}
            <Link href="/signup" className="text-amber-700 font-bold hover:underline">
              Zaregistruj se zdarma
            </Link>
          </p>
          <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 transition">
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}