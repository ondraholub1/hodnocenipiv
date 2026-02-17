import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  const { data: beers, error } = await supabase
    .from('beers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return <div className="p-10 text-red-500">Chyba: {error.message}</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-amber-700">🍺 Hodnocení Piv</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beers?.map((beer) => (
            <div key={beer.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-800">{beer.name}</h2>
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {beer.alcohol}%
                </span>
              </div>
              <p className="text-gray-600 italic mb-2">{beer.brewery}</p>
              <p className="text-sm text-gray-500 mb-4">{beer.type}</p>
              
              {/* Popis piva */}
              <p className="text-gray-700 text-sm line-clamp-3 mb-4 flex-grow">
                {beer.description}
              </p>

              {/* Tlačítko - nyní správně umístěné pod popisem */}
              <Link 
                href={`/beer/${beer.id}`} 
                className="block w-full bg-amber-600 text-white text-center py-2 rounded hover:bg-amber-700 transition-colors mt-auto"
              >
                Zobrazit detaily a recenze
              </Link>
            </div>
          ))}
        </div>

        {(!beers || beers.length === 0) && (
          <p className="text-center text-gray-500 mt-10">Zatím tu nejsou žádná piva.</p>
        )}
      </div>
    </main>
  );
}