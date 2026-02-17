import { supabase } from "../../../lib/supabaseClient";
import ReviewForm from "../../../components/ReviewForm";
import Link from "next/link";

// Tato funkce říká Next.js, že stránka je dynamická (pro každé ID jiná)
export const revalidate = 0;

export default async function BeerPage({ params }: { params: { id: string } }) {
  const beerId = parseInt(params.id);

  // 1. Načteme informace o pivu
  const { data: beer } = await supabase
    .from("beers")
    .select("*")
    .eq("id", beerId)
    .single();

  // 2. Načteme recenze k tomuto pivu
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("beer_id", beerId)
    .order("created_at", { ascending: false });

  if (!beer) return <div className="p-10">Pivo nenalezeno.</div>;

  return (
    <main className="min-h-screen p-8 bg-white max-w-4xl mx-auto">
      <Link href="/" className="text-amber-600 hover:underline mb-4 block">← Zpět na seznam</Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{beer.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{beer.brewery}</p>
          <div className="flex gap-4 mb-6">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{beer.type}</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{beer.alcohol}% alk.</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{beer.description}</p>
        </div>
      </div>

      <hr className="my-8" />

      {/* Sekce recenzí */}
      <h2 className="text-2xl font-bold mb-6">Recenze uživatelů</h2>
      
      <div className="space-y-4 mb-10">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border p-4 rounded shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-amber-500">{"⭐".repeat(review.rating)}</div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString("cs-CZ")}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Zatím žádné recenze. Buď první!</p>
        )}
      </div>

      {/* Formulář pro přidání recenze */}
      <ReviewForm beerId={beerId} />
    </main>
  );
}