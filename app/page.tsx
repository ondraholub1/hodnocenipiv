import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  const { data: beers, error } = await supabase
    .from('beers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return <div className="p-10 text-red-500 text-center font-bold mt-10 bg-white rounded-lg shadow">Chyba: {error.message}</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-5xl font-extrabold mb-12 text-center text-amber-900 drop-shadow-sm tracking-tight">
          🍻 Hodnocení Piv
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beers?.map((beer) => (
            // KARTA - Přidáno "group", abychom mohli dělat efekty při najetí myší
            <div key={beer.id} className="group relative bg-white p-7 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-2 border border-orange-100">
              
              {/* Horní dekorační barevný proužek */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

              {/* Velký průhledný "vodoznak" piva v pozadí karty, který se při najetí myší otočí */}
              <div className="absolute -right-6 -top-6 text-9xl opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                🍺
              </div>

              <div className="relative z-10 flex justify-between items-start mt-2 mb-3">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{beer.name}</h2>
                <span className="text-sm bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap ml-3">
                  {beer.alcohol}% alk.
                </span>
              </div>
              
              <p className="relative z-10 text-amber-700 font-serif italic mb-3 text-lg border-b border-gray-100 pb-3">{beer.brewery}</p>
              
              <div className="relative z-10 flex mb-4">
                <span className="text-xs uppercase tracking-widest bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-200 font-bold">
                  {beer.type}
                </span>
              </div>
              
              <p className="relative z-10 text-gray-600 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                {beer.description}
              </p>

              <Link 
                href={`/beer/${beer.id}`} 
                className="relative z-10 block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-md mt-auto hover:shadow-lg"
              >
                Zobrazit detaily a recenze
              </Link>
            </div>
          ))}
        </div>

        {(!beers || beers.length === 0) && (
          <div className="text-center bg-white p-10 rounded-2xl shadow-lg mt-10">
            <p className="text-gray-500 text-lg font-medium">Zatím tu nejsou žádná piva.</p>
          </div>
        )}
      </div>
    </main>
  );
}