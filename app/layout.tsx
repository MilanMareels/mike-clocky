import BottomNav from "./BottomNav";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "UrenTracker",
  description: "Simpele urenregistratie",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-slate-50 text-slate-800 pb-20">
        <Analytics />
        <main className="max-w-md mx-auto min-h-screen relative">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
