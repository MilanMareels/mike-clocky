import "./globals.css";
import Link from "next/link";
import { Home, CalendarDays } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UrenTracker",
  description: "Simpele urenregistratie",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-slate-50 text-slate-800 pb-20">
        <main className="max-w-md mx-auto min-h-screen relative">{children}</main>

        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-around max-w-md left-1/2 -translate-x-1/2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl z-50">
          <Link href="/" className="flex flex-col items-center text-slate-400 hover:text-blue-600 focus:text-blue-600">
            <Home size={24} />
            <span className="text-[10px] font-medium mt-1">Vandaag</span>
          </Link>
          <Link href="/overzicht" className="flex flex-col items-center text-slate-400 hover:text-blue-600 focus:text-blue-600">
            <CalendarDays size={24} />
            <span className="text-[10px] font-medium mt-1">Overzicht</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
