"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    // NOVÝ DESIGN: Téměř černá, hodně rozmazané pozadí (sklo) a jemný spodní okraj
    <nav className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-50 border-b border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo - jemně zlatavé po najetí */}
        <Link href="/" className="text-2xl font-black flex items-center gap-2 text-white hover:text-amber-500 transition-colors tracking-tight drop-shadow-sm">
          🍺 Hodnocení Piv
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-5">
              <span className="text-sm hidden sm:inline text-amber-500/70 font-medium">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-red-900/80 text-gray-400 hover:text-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-gray-800 hover:border-red-800/50 shadow-sm"
              >
                Odhlásit
              </button>
            </div>
          ) : (
            <div className="flex gap-3 sm:gap-4">
              {/* Moderní skleněné tlačítko "Přihlásit se" */}
              <Link 
                href="/login" 
                className="px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-700 text-gray-300 hover:border-amber-500/50 hover:text-amber-400 hover:bg-gray-900/50 shadow-sm"
              >
                Přihlásit se
              </Link>

              {/* Zářící tlačítko "Registrovat" */}
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
              >
                Registrovat
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}