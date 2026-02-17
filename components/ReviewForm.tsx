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
      setComment(""); // Vyčistí políčko
      router.refresh(); // Zobrazí novou recenzi
    }
    setLoading(false);
  };

  if (checkingAuth) return <p className="mt-8 text-gray-500">Načítám formulář...</p>;

  // TADY JE KONTROLA: Pokud není přihlášen, ukáže se mu tlačítko k přihlášení
  if (!user) {
    return (
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mt-8 text-center">
        <p className="text-amber-900 mb-2 font-bold">Pro napsání recenze se musíš přihlásit.</p>
        <Link href="/login" className="inline-block mt-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition">
          Přejít na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
      <h3 className="text-xl font-bold mb-4 text-amber-900">Napsat recenzi (jako {user.email})</h3>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Hodnocení (hvězdičky)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star} type="button" onClick={() => setRating(star)}
              className={`text-2xl transition ${star <= rating ? "grayscale-0" : "grayscale opacity-30"}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Tvůj komentář</label>
        <textarea
          value={comment} onChange={(e) => setComment(e.target.value)} required
          className="w-full p-2 border rounded h-24" placeholder="Jak ti chutnalo?"
        />
      </div>
      <button type="submit" disabled={loading} className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700">
        {loading ? "Odesílám..." : "Odeslat recenzi"}
      </button>
    </form>
  );
}