import { supabase } from "../../../lib/supabaseClient";
import ReviewForm from "../../../components/ReviewForm";
import DeleteButton from "../../../components/DeleteButton";
import Link from "next/link";

export const revalidate = 0;

export default async function BeerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beerId = parseInt(id);

  const { data: beer } = await supabase.from("beers").select("*").eq("id", beerId).single();
  const { data: reviews } = await supabase.from("reviews").select("*").eq("beer_id", beerId).order("created_at", { ascending: false });

  if (!beer) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200"><div className="p-10 bg-white rounded-2xl shadow-xl text-center font-bold text-xl text-amber-900">Pivo nenalezeno.</div></div>;

  return (
    // 1. Přidán krásný gradient přes celou obrazovku, stejně jako na hlavní stránce
    <main className="min-h-screen py-10 px-4 sm:px-8 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200">
      
      {/* 2. Hlavní bílá karta s obsahem, která má jemný stín a zaoblení */}
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl border border-orange-100">
        <Link href="/" className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-6 font-bold bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-full shadow-sm">
          ← Zpět na seznam piv
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">{beer.name}</h1>
            <p className="text-2xl text-amber-700 mb-6 font-serif italic">{beer.brewery}</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm shadow-sm">{beer.type}</span>
              <span className="bg-gray-100 text-gray-800 border border-gray-200 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">{beer.alcohol}% alk.</span>
              
              {beer.degrees && (
                <span className="bg-yellow-100 text-yellow-900 border border-yellow-200 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  Stupňovitost: {beer.degrees}°
                </span>
              )}
              
              {beer.ibu && (
                <span className="bg-green-100 text-green-900 border border-green-200 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  Hořkost: {beer.ibu} IBU
                </span>
              )}
            </div>
            
            <p className="text-gray-700 leading-relaxed text-lg bg-orange-50/50 p-6 rounded-2xl border border-orange-50">{beer.description}</p>
          </div>
        </div>

        <hr className="my-10 border-orange-100" />

        {/* SEKCE RECENZÍ */}
        <h2 className="text-3xl font-extrabold mb-8 text-amber-900 drop-shadow-sm">Hodnocení a recenze</h2>
        
        <div className="space-y-5 mb-12">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              // 3. Upravené kartičky pro recenze - hezčí design s barevným proužkem
              <div key={review.id} className="bg-white border border-orange-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                
                <div className="flex justify-between items-start mb-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="text-amber-500 text-xl bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                      {"⭐".repeat(review.rating)}
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      {new Date(review.created_at).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  <DeleteButton reviewId={review.id} />
                </div>
                <p className="text-gray-800 text-lg pl-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 text-center shadow-inner">
              <p className="text-amber-800 text-lg font-medium">Zatím tu nejsou žádné recenze. Buď první, kdo toto pivo ohodnotí!</p>
            </div>
          )}
        </div>

        {/* FORMULÁŘ */}
        <ReviewForm beerId={beerId} />
      </div>
    </main>
  );
}