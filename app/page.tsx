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

  // Bublinky
  const bubbles = [
    { id: 1, size: 12, left: 10, delay: 0, duration: 8 },
    { id: 2, size: 24, left: 25, delay: 2, duration: 6 },
    { id: 3, size: 10, left: 40, delay: 4, duration: 9 },
    { id: 4, size: 28, left: 55, delay: 1, duration: 5 },
    { id: 5, size: 18, left: 70, delay: 3, duration: 7 },
    { id: 6, size: 22, left: 85, delay: 5, duration: 6.5 },
    { id: 7, size: 14, left: 15, delay: 6, duration: 8.5 },
    { id: 8, size: 26, left: 35, delay: 0.5, duration: 5.5 },
    { id: 9, size: 12, left: 50, delay: 2.5, duration: 7.5 },
    { id: 10, size: 20, left: 65, delay: 4.5, duration: 6.8 },
    { id: 11, size: 16, left: 80, delay: 1.5, duration: 9.5 },
    { id: 12, size: 30, left: 5, delay: 3.5, duration: 5.2 },
    { id: 13, size: 25, left: 90, delay: 5.5, duration: 7.2 },
    { id: 14, size: 11, left: 45, delay: 0.8, duration: 8.2 },
    { id: 15, size: 19, left: 75, delay: 2.8, duration: 6.2 },
  ];

  return (
    <main className="relative min-h-screen p-8 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200">
      
      {/* Kontejner s bublinkami na pozadí */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-0 bg-white/40 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] backdrop-blur-sm"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              animation: `floatUp ${b.duration}s infinite ease-in ${b.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        <h1 className="text-5xl font-extrabold mb-12 text-center text-amber-900 drop-shadow-sm tracking-tight">
          🍻 Hodnocení Piv
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beers?.map((beer) => (
            <div key={beer.id} className="group relative bg-white/95 backdrop-blur-sm p-7 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-2 border border-orange-100">
              
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

              {/* Dekorativní pivo v pozadí místo rozbité fotky */}
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