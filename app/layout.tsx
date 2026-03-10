import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Hodnocení Piv",
  description: "Nejlepší aplikace pro hodnocení craftových piv",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      {/* ZDE JE ZMĚNA: bg-black zaručí, že pod skleněnou lištou bude tma */}
      <body className="bg-black text-gray-200 min-h-screen flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}