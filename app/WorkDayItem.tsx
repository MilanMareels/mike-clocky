"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Site, WorkDayData } from "./types";

interface WorkDayItemProps {
  day: WorkDayData;
  onDelete: (id: string) => void;
  onUpdate: (day: WorkDayData) => void;
  sites: Site[];
}

export default function WorkDayItem({ day, onDelete, onUpdate, sites }: WorkDayItemProps) {
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
            <p className={`text-xs text-slate-500 italic ${!isExpanded ? "truncate" : "whitespace-pre-wrap break-words"}`}>"{day.note}"</p>
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
