"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewForm({ beerId }: { beerId: number }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert([{ beer_id: beerId, user_id: user.id, rating: rating, comment: comment }]);

    if (error) {
      alert("Chyba při ukládání: " + error.message);
    } else {
      setComment("");
      router.refresh();
    }
    setLoading(false);
  };

  if (checkingAuth) return <p className="mt-8 text-amber-700 font-bold animate-pulse">Načítám formulář...</p>;

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200 mt-8 text-center shadow-sm">
        <p className="text-amber-900 mb-4 font-bold text-lg">Pro napsání recenze se musíš přihlásit.</p>
        <Link href="/login" className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition shadow-md hover:shadow-lg">
          Přejít na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-50 to-amber-50/30 p-8 rounded-2xl border border-orange-100 shadow-inner mt-8">
      <h3 className="text-2xl font-extrabold mb-6 text-amber-900">Napsat recenzi <span className="text-sm font-normal text-gray-500 block mt-1">(Přihlášen jako: {user.email})</span></h3>
      
      <div className="mb-6">
        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wide">Hodnocení (hvězdičky)</label>
        <div className="flex gap-2 bg-white inline-flex p-2 rounded-xl border border-gray-200 shadow-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star} type="button" onClick={() => setRating(star)}
              className={`text-3xl transition-all transform hover:scale-110 ${star <= rating ? "grayscale-0 drop-shadow-md" : "grayscale opacity-30"}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wide">Tvůj komentář</label>
        <textarea
          value={comment} onChange={(e) => setComment(e.target.value)} required
          className="w-full p-4 border border-gray-300 rounded-xl h-32 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm resize-none" 
          placeholder="Jak ti toto pivo chutnalo? Doporučil bys ho?"
        />
      </div>
      
      <button type="submit" disabled={loading} className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition shadow-md hover:shadow-lg disabled:opacity-50">
        {loading ? "Odesílám..." : "Odeslat recenzi"}
      </button>
    </form>
  );
}