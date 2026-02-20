"use client";
import { useEffect, useState } from "react";
import { format, parseISO, isSameWeek, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { nl, nlBE } from "date-fns/locale";
import { Trash2 } from "lucide-react";

// Definieer de types voor wat we uit de API verwachten
interface WorkDayData {
  _id: string;
  dateString: string;
  startTime: string;
  endTime: string;
  netHours: number;
  site?: string;
  note?: string;
}

export default function Overzicht() {
  const [data, setData] = useState<WorkDayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"week" | "month">("month"); // Standaard op maand
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Standaard vandaag

  useEffect(() => {
    fetch("/api/workdays")
      .then((res) => res.json())
      .then((data: WorkDayData[]) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-center mt-20 text-slate-500 font-medium">Data aan het laden...</div>;

  // Navigatie functies
  const handlePrev = () => {
    if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze dag wilt verwijderen?")) return;

    const res = await fetch(`/api/workdays?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setData((prev) => prev.filter((item) => item._id !== id));
    }
  };

  // Filter data op basis van selectie
  const filteredData = data
    .filter((d) => {
      const date = parseISO(d.dateString);
      if (view === "week") return isSameWeek(date, currentDate, { weekStartsOn: 1 });
      return isSameMonth(date, currentDate);
    })
    .sort((a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime()); // Sorteer nieuwste eerst

  // Bereken totaal
  const totalHours = filteredData.reduce((acc, curr) => acc + curr.netHours, 0);

  // Label voor de huidige periode
  const periodLabel =
    view === "week"
      ? `Week ${format(currentDate, "w", { locale: nl })} (${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: nl })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: nl })})`
      : format(currentDate, "MMMM yyyy", { locale: nl });

  return (
    <div className="p-6 pb-32">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 mt-4">
        Jouw
        <br />
        <span className="text-blue-600">Overzicht</span>
      </h1>

      {/* Filter Toggle */}
      <div className="bg-slate-100 p-1 rounded-2xl flex mb-6">
        <button onClick={() => setView("week")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
          Week
        </button>
        <button onClick={() => setView("month")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === "month" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
          Maand
        </button>
      </div>

      {/* Navigatie & Totaal Card */}
      <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrev} className="p-2 bg-blue-500 rounded-xl hover:bg-blue-400 transition">
            ←
          </button>
          <span className="font-bold text-lg capitalize">{periodLabel}</span>
          <button onClick={handleNext} className="p-2 bg-blue-500 rounded-xl hover:bg-blue-400 transition">
            →
          </button>
        </div>
        <div className="text-center">
          <p className="text-blue-100 text-sm font-medium mb-1">Totaal gewerkt</p>
          <p className="text-5xl font-black">
            {totalHours.toFixed(1)} <span className="text-xl font-medium">uur</span>
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-slate-800">Gewerkte Dagen</h2>
      <div className="space-y-3">
        {filteredData.length === 0 && <p className="text-slate-400 text-center py-8">Geen uren gevonden voor deze periode.</p>}
        {filteredData.map((day) => (
          <div key={day._id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-800 capitalize">{format(parseISO(day.dateString), "EEE d MMM", { locale: nl })}</p>
                {day.site && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{day.site}</span>}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {day.startTime} - {day.endTime}
              </p>
              {day.note && <p className="text-xs text-slate-500 italic mt-1 max-w-50 truncate">"{day.note}"</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 text-blue-700 font-black py-1 px-3 rounded-lg text-lg">{day.netHours} u</span>
              <button onClick={() => handleDelete(day._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
