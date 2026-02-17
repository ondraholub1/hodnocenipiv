"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DeleteButton({ reviewId }: { reviewId: number }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // ⚠️ TADY NAPIŠ SVŮJ ADMIN E-MAIL (kterým se přihlašuješ jako správce)
  const ADMIN_EMAIL = "test@test.cz"; 

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true); // Pokud je to admin, povolíme tlačítko
      }
    };
    checkAdmin();
  }, []);

  const handleDelete = async () => {
    const potvrdit = window.confirm("Opravdu chceš smazat tuto recenzi?");
    if (!potvrdit) return;

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    
    if (error) {
      alert("Chyba při mazání: " + error.message);
    } else {
      router.refresh(); // Obnoví stránku po smazání, aby recenze zmizela
    }
  };

  // Pokud to NENÍ admin, neukáže se nic
  if (!isAdmin) return null;

  return (
    <button 
      onClick={handleDelete} 
      className="ml-auto bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold hover:bg-red-200 transition"
    >
      🗑️ Smazat
    </button>
  );
}