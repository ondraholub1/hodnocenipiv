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
  };

  return (
    <nav className="bg-amber-800 p-4 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl hover:text-amber-200">
          🍺 Hodnocení Piv
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                Odhlásit
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-200 transition">Přihlásit</Link>
              <Link href="/signup" className="bg-white text-amber-900 px-3 py-1 rounded text-sm font-bold hover:bg-gray-100 transition">Registrace</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}