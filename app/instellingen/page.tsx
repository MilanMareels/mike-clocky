"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";

interface SiteData {
  _id: string;
  name: string;
}

export default function Instellingen() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [newSite, setNewSite] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    const res = await fetch("/api/sites");
    const data = await res.json();
    setSites(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.trim()) return;

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSite }),
    });

    if (res.ok) {
      setNewSite("");
      fetchSites();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze locatie wilt verwijderen?")) return;

    await fetch(`/api/sites?id=${id}`, { method: "DELETE" });
    setSites(sites.filter((s) => s._id !== id));
  };

  return (
    <div className="p-6 pb-32">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 mt-4">
        Beheer
        <br />
        <span className="text-blue-600">Locaties</span>
      </h1>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            placeholder="Nieuwe locatie naam..."
            className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={24} />
          </button>
        </form>
      </div>

      <h2 className="text-lg font-bold mb-4 text-slate-800">Huidige Locaties</h2>

      {loading ? (
        <p className="text-slate-400">Laden...</p>
      ) : (
        <div className="space-y-3">
          {sites.length === 0 && <p className="text-slate-400 italic">Nog geen locaties toegevoegd.</p>}
          {sites.map((site) => (
            <div key={site._id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
              <span className="font-bold text-slate-700">{site.name}</span>
              <button onClick={() => handleDelete(site._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
