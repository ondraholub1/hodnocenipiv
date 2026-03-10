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

  if (!beer) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black"><div className="p-10 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-center font-bold text-xl text-red-500">Pivo nenalezeno.</div></div>;

  return (
    <main className="min-h-screen py-10 px-4 sm:px-8 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-200">
      
      {/* Tmavá průhledná karta s efektem rozmazání pozadí */}
      <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700 relative overflow-hidden">
        
        {/* Jemná záře v pozadí karty pro luxusní efekt */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors mb-6 font-bold bg-gray-900/50 hover:bg-gray-800 border border-gray-700 px-4 py-2 rounded-full shadow-sm relative z-10">
          ← Zpět na seznam piv
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
          <div className="flex-1">
            {/* Zlatý zářící nadpis */}
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-500 mb-2 tracking-tight drop-shadow-sm">{beer.name}</h1>
            <p className="text-2xl text-amber-500/80 mb-6 font-serif italic">{beer.brewery}</p>
            
            {/* Tmavé štítky */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-gray-900 text-gray-300 border border-gray-700 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-sm shadow-sm">{beer.type}</span>
              <span className="bg-gray-900 text-amber-500 border border-amber-900/50 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">{beer.alcohol}% alk.</span>
              
              {beer.degrees && (
                <span className="bg-gray-900 text-yellow-500 border border-yellow-900/50 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  Stupňovitost: {beer.degrees}°
                </span>
              )}
              
              {beer.ibu && (
                <span className="bg-gray-900 text-green-400 border border-green-900/50 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  Hořkost: {beer.ibu} IBU
                </span>
              )}
            </div>
            
            {/* Boxík s popisem piva */}
            <p className="text-gray-300 leading-relaxed text-lg bg-gray-900/50 p-6 rounded-2xl border border-gray-700 shadow-inner">{beer.description}</p>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />

        <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm">Hodnocení a recenze</h2>
        
        <div className="space-y-5 mb-12 relative z-10">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-900/80 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-shadow flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-orange-600 opacity-80"></div>
                
                <div className="flex justify-between items-start mb-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="text-amber-500 text-xl bg-gray-800 px-3 py-1 rounded-full border border-gray-700 shadow-sm">
                      {"⭐".repeat(review.rating)}
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      {new Date(review.created_at).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  <DeleteButton reviewId={review.id} />
                </div>
                <p className="text-gray-300 text-lg pl-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700 text-center shadow-inner">
              <p className="text-amber-500/80 text-lg font-medium">Zatím tu nejsou žádné recenze. Buď první, kdo toto pivo ohodnotí!</p>
            </div>
          )}
        </div>

        <ReviewForm beerId={beerId} />
      </div>
    </main>
  );
}