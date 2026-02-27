"use client";
import { useEffect, useState } from "react";
import { format, parseISO, isSameWeek, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { nl } from "date-fns/locale";
import { Site, WorkDayData } from "../types";
import WorkDayItem from "../WorkDayItem";

export default function Overzicht() {
  const [data, setData] = useState<WorkDayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/workdays").then((res) => res.json()), fetch("/api/sites").then((res) => res.json())]).then(([workdays, sites]) => {
      setData(workdays);
      setSites(sites);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-center mt-20 text-slate-500 font-medium">Data aan het laden...</div>;

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

  const handleUpdate = async (updatedDay: WorkDayData) => {
    const res = await fetch("/api/workdays", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDay),
    });

    if (res.ok) {
      const savedDay = await res.json();
      setData((prev) => prev.map((d) => (d._id === savedDay._id ? savedDay : d)));
    }
  };

  const filteredData = data
    .filter((d) => {
      const date = parseISO(d.dateString);
      if (view === "week") return isSameWeek(date, currentDate, { weekStartsOn: 1 });
      return isSameMonth(date, currentDate);
    })
    .sort((a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime());

  const totalHours = filteredData.reduce((acc, curr) => acc + curr.netHours, 0);

  const targetHours = view === "week" ? 30.4 : 121.6;
  const overtime = totalHours - targetHours;

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

      <div className="bg-slate-100 p-1 rounded-2xl flex mb-6">
        <button onClick={() => setView("week")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
          Week
        </button>
        <button onClick={() => setView("month")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === "month" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
          Maand
        </button>
      </div>

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
          <div className="mt-4 inline-flex flex-col items-center bg-white/10 px-8 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{view === "week" ? "Overuren deze week" : "Overuren deze maand"}</span>
            {Math.abs(overtime) > 0.01 ? ( // Gebruik een kleine marge voor afrondingsfouten
              <span className={`text-3xl font-black ${overtime > 0 ? "text-green-300" : "text-red-300"}`}>
                {overtime > 0 ? "+" : ""}
                {overtime.toFixed(1)} uur
              </span>
            ) : (
              <span className="text-lg font-bold text-blue-200">
                Precies {targetHours.toString().replace(".", ",")} uur per {view === "week" ? "week" : "maand"}
              </span>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-slate-800">Gewerkte Dagen</h2>
      <div className="space-y-3">
        {filteredData.length === 0 && <p className="text-slate-400 text-center py-8">Geen uren gevonden voor deze periode.</p>}
        {filteredData.map((day) => (
          <WorkDayItem key={day._id} day={day} onDelete={handleDelete} onUpdate={handleUpdate} sites={sites} />
        ))}
      </div>
    </div>
  );
}
