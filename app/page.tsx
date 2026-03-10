"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Home() {
  const [beers, setBeers] = useState<any[]>([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stavy pro vyhledávání a filtrování
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Vše");

  useEffect(() => {
    const fetchData = async () => {
      // Načtení piv
      const { data: beersData, error: beersError } = await supabase
        .from('beers')
        .select('*')
        .order('name', { ascending: true });

      // Načtení počtu recenzí
      const { count: revCount, error: revError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      if (beersError) setError(beersError.message);
      else setBeers(beersData || []);

      if (!revError) setReviewsCount(revCount || 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Kategorie pro rychlá tlačítka
  const categories = ["Vše", "Ležák", "IPA", "Tmavé", "Pšeničné", "Ale"];

  // Magie filtrování - vybere jen ta piva, která odpovídají hledání i kategorii
  const filteredBeers = beers.filter((beer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = beer.name.toLowerCase().includes(searchLower) || 
                          beer.brewery.toLowerCase().includes(searchLower);
    
    // Zjistí, jestli typ piva obsahuje vybranou kategorii (např. "Světlý ležák" obsahuje "Ležák")
    const matchesType = filterType === "Vše" || beer.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  if (error) {
    return <div className="p-10 text-red-500 text-center font-bold mt-10 bg-gray-900 rounded-lg shadow">Chyba: {error}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-amber-500">
        <div className="text-6xl animate-bounce mb-4">🍺</div>
        <h2 className="text-2xl font-bold animate-pulse">Načítám piva...</h2>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen p-8 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-200">
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* NADPIS S PŮLLITRY */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-10 mt-4">
          <span className="text-6xl sm:text-8xl drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transform -rotate-12 hover:scale-110 transition-transform">
            🍺
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-orange-700 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tighter uppercase">
            Hodnocení Piv
          </h1>
          <span className="text-6xl sm:text-8xl drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transform rotate-12 hover:scale-110 transition-transform">
            🍺
          </span>
        </div>

        {/* RYCHLÉ STATISTIKY */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 bg-gray-800/40 backdrop-blur-md border border-gray-700/50 py-6 px-10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm mb-1">
                {beers.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">Piv v databázi</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm mb-1">
                {reviewsCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">Napsaných recenzí</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm mb-1">
                1
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">Skvělá komunita</div>
            </div>
          </div>
        </div>

        {/* 🔍 NOVÉ: VYHLEDÁVÁNÍ A FILTRY */}
        <div className="mb-12 bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 shadow-lg">
          
          {/* Textové pole pro hledání */}
          <input 
            type="text" 
            placeholder="🔍 Hledat pivo nebo pivovar (např. Kozel)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-700 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all mb-6 text-lg placeholder-gray-500 shadow-inner"
          />

          {/* Tlačítka pro rychlé filtry */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterType(category)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                  filterType === category 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                    : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* MŘÍŽKA S PIVY (Vykresluje už jen vyfiltrovaná piva) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeers.map((beer) => (
            <div key={beer.id} className="group relative bg-gray-800/50 backdrop-blur-md p-7 rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-2 border border-gray-700 hover:border-amber-500/50">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600 opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-6 -top-6 text-9xl opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none grayscale group-hover:grayscale-0">🍺</div>

              <div className="relative z-10 flex justify-between items-start mt-2 mb-3">
                <h2 className="text-2xl font-black text-white tracking-tight">{beer.name}</h2>
                <span className="text-sm bg-gray-900 text-amber-500 border border-gray-700 px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap ml-3">
                  {beer.alcohol}% alk.
                </span>
              </div>
              
              <p className="relative z-10 text-amber-500/80 font-serif italic mb-3 text-lg border-b border-gray-700 pb-3">{beer.brewery}</p>
              
              <div className="relative z-10 flex mb-4">
                <span className="text-xs uppercase tracking-widest bg-gray-900/80 text-gray-400 px-2 py-1 rounded border border-gray-700 font-bold">
                  {beer.type}
                </span>
              </div>
              
              <p className="relative z-10 text-gray-400 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                {beer.description}
              </p>

              <Link 
                href={`/beer/${beer.id}`} 
                className="relative z-10 block w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center py-3 rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] mt-auto hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
              >
                Zobrazit detaily a recenze
              </Link>
            </div>
          ))}
        </div>

        {/* Když hledání nic nenajde */}
        {filteredBeers.length === 0 && (
          <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-lg mt-10 border border-gray-700">
            <div className="text-5xl mb-4">🏜️</div>
            <p className="text-gray-400 text-xl font-medium">Je tu sucho. Tohle pivo jsme nenašli.</p>
            <button 
              onClick={() => {setSearchTerm(""); setFilterType("Vše");}}
              className="mt-6 text-amber-500 hover:text-amber-400 font-bold underline"
            >
              Zrušit filtry a ukázat vše
            </button>
          </div>
        )}
      </div>
    </main>
  );
}