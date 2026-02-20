"use client";
import { useState, useEffect, FormEvent } from "react";

interface Site {
  _id: string;
  name: string;
}

export default function Home() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [site, setSite] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [availableSites, setAvailableSites] = useState<Site[]>([]);

  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        setAvailableSites(data);
        if (data.length > 0) setSite(data[0].name);
      });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/workdays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateString: date, startTime, endTime, site, note }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(`Opgeslagen! Je hebt ${data.netHours} uur gewerkt vandaag.`);
      setNote(""); // Reset notitie na opslaan
      setTimeout(() => setMessage(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 mt-4">
        Werkdag
        <br />
        <span className="text-blue-600">Toevoegen</span>
      </h1>

      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900 text-white px-4 py-4 rounded-2xl shadow-2xl z-50 flex items-center justify-center gap-3 transition-all">
          <span className="text-xl">✅</span>
          <span className="font-bold text-sm">{message}</span>
        </div>
      )}

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
            <label className="block text-sm font-semibold text-slate-500 mb-2">Site / Locatie</label>
            <div className="relative">
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-[98%] p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium appearance-none"
              >
                {availableSites.length === 0 && <option value="">Geen locaties gevonden</option>}
                {availableSites.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-[15%] top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
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

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">Notitie (optioneel)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bijv. Extra taken gedaan..."
              className="w-[97%] p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium min-h-20"
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
        </form>
      </div>
    </div>
  );
}
