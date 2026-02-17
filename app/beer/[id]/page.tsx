import { supabase } from "../../../lib/supabaseClient";
import ReviewForm from "../../../components/ReviewForm";
import DeleteButton from "../../../components/DeleteButton"; // <--- NOVÝ IMPORT
import Link from "next/link";

export const revalidate = 0;

export default async function BeerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beerId = parseInt(id);

  const { data: beer } = await supabase.from("beers").select("*").eq("id", beerId).single();
  const { data: reviews } = await supabase.from("reviews").select("*").eq("beer_id", beerId).order("created_at", { ascending: false });

  if (!beer) return <div className="p-10 text-center font-bold">Pivo nenalezeno.</div>;

  return (
    <main className="min-h-screen p-8 bg-white max-w-4xl mx-auto mt-10 shadow-lg rounded-lg border border-gray-100">
      <Link href="/" className="text-amber-600 hover:underline mb-4 inline-block font-bold">← Zpět na seznam piv</Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{beer.name}</h1>
          <p className="text-xl text-gray-600 mb-4 font-serif italic">{beer.brewery}</p>
          <div className="flex gap-4 mb-6">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">{beer.type}</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">{beer.alcohol}% alk.</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">{beer.description}</p>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* SEKCE RECENZÍ */}
      <h2 className="text-2xl font-bold mb-6 text-amber-900">Recenze uživatelů</h2>
      
      <div className="space-y-4 mb-10">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 border border-gray-100 p-4 rounded-lg shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-amber-500 text-lg">{"⭐".repeat(review.rating)}</div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString("cs-CZ")}
                </span>
                
                {/* TLAČÍTKO SMAZAT (ZOBRAZÍ SE JEN ADMINOVI Z KROKU 2) */}
                <DeleteButton reviewId={review.id} />
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Zatím žádné recenze. Buď první!</p>
        )}
      </div>

      {/* FORMULÁŘ PRO PŘIDÁNÍ RECENZE (PŘIHLÁŠENÍ) */}
      <ReviewForm beerId={beerId} />
    </main>
  );
}