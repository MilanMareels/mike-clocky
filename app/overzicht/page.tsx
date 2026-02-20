"use client";
import { useEffect, useState } from "react";
import { format, parseISO, isSameWeek, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { nl, nlBE } from "date-fns/locale";
import { Trash2, Pencil, Check, X } from "lucide-react";

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

interface Site {
  _id: string;
  name: string;
}

function WorkDayItem({ day, onDelete, onUpdate, sites }: { day: WorkDayData; onDelete: (id: string) => void; onUpdate: (day: WorkDayData) => void; sites: Site[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(day);
  const isLong = day.note && day.note.length > 30;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(day);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-sm space-y-3">
        <div className="flex gap-2">
          <input
            type="date"
            value={editData.dateString}
            onChange={(e) => setEditData({ ...editData, dateString: e.target.value })}
            className="flex-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={editData.site || ""}
            onChange={(e) => setEditData({ ...editData, site: e.target.value })}
            className="flex-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Locatie...</option>
            {sites.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="time"
            value={editData.startTime}
            onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
            className="flex-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400">-</span>
          <input
            type="time"
            value={editData.endTime}
            onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
            className="flex-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          value={editData.note || ""}
          onChange={(e) => setEditData({ ...editData, note: e.target.value })}
          placeholder="Notitie..."
          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
          <button onClick={handleSave} className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
            <Check size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl flex justify-between items-start border border-slate-100 shadow-sm transition-all">
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-bold text-slate-800 capitalize">{format(parseISO(day.dateString), "EEE d MMM", { locale: nl })}</p>
          {day.site && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{day.site}</span>}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {day.startTime} - {day.endTime}
        </p>
        {day.note && (
          <div className="mt-1">
            <p className={`text-xs text-slate-500 italic ${!isExpanded ? "truncate" : "whitespace-pre-wrap wrap-break-word"}`}>"{day.note}"</p>
            {isLong && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-[10px] text-blue-600 font-bold mt-1 hover:underline focus:outline-none">
                {isExpanded ? "Minder" : "Lees meer"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="bg-blue-50 text-blue-700 font-black py-1 px-3 rounded-lg text-lg">{day.netHours} u</span>
        <button onClick={() => setIsEditing(true)} className="text-slate-300 hover:text-blue-500 transition-colors p-2">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(day._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Overzicht() {
  const [data, setData] = useState<WorkDayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"week" | "month">("month"); // Standaard op maand
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Standaard vandaag
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/workdays").then((res) => res.json()), fetch("/api/sites").then((res) => res.json())]).then(([workdays, sites]) => {
      setData(workdays);
      setSites(sites);
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

  let overtime = 0;
  if (view === "week") {
    overtime = totalHours - 30.4;
  } else {
    // Voor maandoverzicht: tel de overuren van elke week op (op basis van de volledige week)
    const weeksInMonth = new Set(filteredData.map((d) => startOfWeek(parseISO(d.dateString), { weekStartsOn: 1 }).toISOString()));

    weeksInMonth.forEach((weekStartISO) => {
      const weekStart = parseISO(weekStartISO);
      // Bereken totaal uren voor deze specifieke week (ook dagen buiten de huidige maand)
      const weekHours = data.filter((d) => isSameWeek(parseISO(d.dateString), weekStart, { weekStartsOn: 1 })).reduce((acc, curr) => acc + curr.netHours, 0);
      overtime += weekHours - 30.4;
    });
  }

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
          <div className="mt-4 inline-flex flex-col items-center bg-white/10 px-8 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Overuren</span>
            {overtime > 0 ? <span className="text-3xl font-black text-green-300">+{overtime.toFixed(1)}</span> : <span className="text-lg font-bold text-blue-200">Nog geen overuren</span>}
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
