"use client";
import { useEffect, useState } from "react";
import { format, parseISO, isSameWeek, isSameMonth } from "date-fns";
import { nl } from "date-fns/locale";

// Definieer de types voor wat we uit de API verwachten
interface WorkDayData {
  _id: string;
  dateString: string;
  startTime: string;
  endTime: string;
  netHours: number;
}

export default function Overzicht() {
  const [data, setData] = useState<WorkDayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/workdays")
      .then((res) => res.json())
      .then((data: WorkDayData[]) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-center mt-20 text-slate-500 font-medium">Data aan het laden...</div>;

  const now = new Date();

  const weekTotal = data.filter((d) => isSameWeek(parseISO(d.dateString), now, { weekStartsOn: 1 })).reduce((acc, curr) => acc + curr.netHours, 0);

  const monthTotal = data.filter((d) => isSameMonth(parseISO(d.dateString), now)).reduce((acc, curr) => acc + curr.netHours, 0);

  return (
    // ... exact dezelfde JSX weergave als in het vorige JavaScript voorbeeld ...
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 mt-4">
        Jouw
        <br />
        <span className="text-blue-600">Overzicht</span>
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-200">
          <h3 className="text-blue-100 text-sm font-medium mb-1">Deze Week</h3>
          <p className="text-3xl font-black">
            {weekTotal.toFixed(1)} <span className="text-base font-medium">uur</span>
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Deze Maand</h3>
          <p className="text-3xl font-black text-slate-800">
            {monthTotal.toFixed(1)} <span className="text-base font-medium">uur</span>
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-slate-800">Recente Dagen</h2>
      <div className="space-y-3">
        {data.map((day) => (
          <div key={day._id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
            <div>
              <p className="font-bold text-slate-800 capitalize">{format(parseISO(day.dateString), "EEEE d MMM", { locale: nl })}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {day.startTime} - {day.endTime}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-blue-50 text-blue-700 font-black py-1 px-3 rounded-lg text-lg">{day.netHours} u</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
