"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/utils";

interface DashboardData {
  agents: number;
  tasks_in_queue: number;
  llm_usage: number;
  logs: string[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<DashboardData>("/dashboard")
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="container-page space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-slate-500">Active agents</div>
          <div className="text-2xl font-semibold">{data?.agents ?? "-"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">Tasks in queue</div>
          <div className="text-2xl font-semibold">{data?.tasks_in_queue ?? "-"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">LLM calls</div>
          <div className="text-2xl font-semibold">{data?.llm_usage ?? "-"}</div>
        </div>
      </div>

      <div className="card">
        <div className="text-sm font-semibold mb-2">Recent activity</div>
        <div className="space-y-1 text-sm text-slate-700 max-h-80 overflow-y-auto">
          {(data?.logs ?? []).map((l, i) => (
            <div key={i}>• {l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
