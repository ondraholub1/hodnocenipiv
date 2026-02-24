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
    <nav className="bg-amber-900 p-4 shadow-lg text-white sticky top-0 z-50 border-b border-amber-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo / Domů */}
        <Link href="/" className="text-2xl font-black flex items-center gap-2 hover:text-amber-200 transition tracking-tight">
          🍺 Hodnocení Piv
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:inline text-amber-200 font-medium opacity-90">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm border border-red-700"
              >
                Odhlásit
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              {/* TLAČÍTKO PŘIHLÁSIT - Nyní stejně velké jako registrace */}
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-lg font-bold transition border border-amber-500 hover:bg-amber-800 hover:text-amber-100 flex items-center"
              >
                Přihlásit se
              </Link>

              {/* TLAČÍTKO REGISTROVAT */}
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-lg font-bold transition shadow-md flex items-center"
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