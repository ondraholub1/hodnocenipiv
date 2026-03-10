"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewForm({ beerId }: { beerId: number }) {
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("reviews").insert({
      beer_id: beerId,
      user_id: user.id,
      rating,
      comment,
    });

    setLoading(false);
    if (error) {
      alert("Chyba: " + error.message);
    } else {
      setComment("");
      setRating(5);
      router.refresh();
    }
  };

  // 1. STAV PRO NEPŘIHLÁŠENÉ (Nenápadný tmavý box)
  if (!user) {
    return (
      <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 text-center shadow-inner mt-8 backdrop-blur-sm">
        <p className="text-gray-500 text-lg font-medium mb-5">Pro napsání recenze se musíš přihlásit.</p>
        <Link 
          href="/login" 
          className="inline-block bg-gray-800 hover:bg-gray-700 text-amber-500/80 hover:text-amber-400 border border-gray-700 hover:border-amber-500/50 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
        >
          Přejít na přihlášení
        </Link>
      </div>
    );
  }

  // 2. STAV PRO PŘIHLÁŠENÉ (Temný formulář pro recenzi)
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-xl mt-8 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-500 mb-6 drop-shadow-sm">
        Přidat hodnocení
      </h3>
      
      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Hodnocení</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Skvělé</option>
          <option value={4}>⭐⭐⭐⭐ (4/5) - Velmi dobré</option>
          <option value={3}>⭐⭐⭐ (3/5) - Průměrné</option>
          <option value={2}>⭐⭐ (2/5) - Podprůměrné</option>
          <option value={1}>⭐ (1/5) - Špatné</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Tvoje recenze</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all min-h-[120px] placeholder-gray-600"
          placeholder="Jak ti pivo chutnalo? Zkus popsat hořkost, pěnu..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-70"
      >
        {loading ? "Odesílám..." : "Odeslat recenzi"}
      </button>
    </form>
  );
}