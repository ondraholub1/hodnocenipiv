"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ReviewForm({ beerId }: { beerId: number }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Zjistíme, kdo je přihlášený
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Pro vložení recenze se musíš přihlásit!");
      setLoading(false);
      return;
    }

    // 2. Odešleme recenzi do databáze
    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          beer_id: beerId,
          user_id: user.id,
          rating: rating,
          comment: comment,
        },
      ]);

    if (error) {
      alert("Chyba při ukládání: " + error.message);
    } else {
      setComment(""); // Vyčistit formulář
      router.refresh(); // Obnovit stránku, aby byla recenze vidět
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
      <h3 className="text-xl font-bold mb-4 text-amber-900">Napsat recenzi</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Hodnocení (hvězdičky)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Jak ti chutnalo?"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Odesílám..." : "Odeslat recenzi"}
      </button>
    </form>
  );
}