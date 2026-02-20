"use client";
import { useState, FormEvent } from "react";

export default function Home() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/workdays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateString: date, startTime, endTime }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(`Opgeslagen! Je hebt ${data.netHours} uur gewerkt vandaag.`);
    }
    setLoading(false);
  };

  return (
    // ... exact dezelfde JSX weergave als in het vorige JavaScript voorbeeld ...
    // (De HTML structuur en Tailwind classes uit de vorige reactie blijven identiek)
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 mt-4">
        Werkdag
        <br />
        <span className="text-blue-600">Toevoegen</span>
      </h1>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-[90%] p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-[90%] p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">Einde</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-[90%] p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
            />
          </div>

          <div className="text-xs text-slate-400 bg-blue-50 p-3 rounded-xl flex items-center">💡 24 minuten pauze wordt automatisch van je totaal afgetrokken.</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_16px_rgba(37,99,235,0.2)] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? "Bezig met opslaan..." : "Uren Opslaan"}
          </button>

          {message && <div className="text-center font-medium text-green-600 mt-4 bg-green-50 p-3 rounded-xl">{message}</div>}
        </form>
      </div>
    </div>
  );
}
