"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-5 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <Link href="/" className={`flex flex-col items-center transition-colors ${pathname === "/" ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
        <Home size={32} strokeWidth={pathname === "/" ? 2.5 : 2} />
        <span className="text-xs font-bold mt-1">Vandaag</span>
      </Link>
      <Link href="/overzicht" className={`flex flex-col items-center transition-colors ${pathname === "/overzicht" ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
        <CalendarDays size={32} strokeWidth={pathname === "/overzicht" ? 2.5 : 2} />
        <span className="text-xs font-bold mt-1">Overzicht</span>
      </Link>
      <Link href="/instellingen" className={`flex flex-col items-center transition-colors ${pathname === "/instellingen" ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
        <Settings size={32} strokeWidth={pathname === "/instellingen" ? 2.5 : 2} />
        <span className="text-xs font-bold mt-1">Instellingen</span>
      </Link>
    </nav>
  );
}
