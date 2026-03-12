"use client";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TaskItem {
  id: number;
  type: string;
  payload: any;
  assignee?: string | null;
  status?: string;
  result?: any;
  agent?: string;
  project_id?: number | null;
  created_at?: string | null;
}

interface ProjectItem {
  id: number;
  name: string;
  description?: string;
  status?: string;
}

const STATUS_COLUMNS = [
  { key: "queued", title: "Queued" },
  { key: "running", title: "Running" },
  { key: "done", title: "Done" },
  { key: "error", title: "Error" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [type, setType] = useState("coding");
  const [assignee, setAssignee] = useState("Developer");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [ask, setAsk] = useState("Write Python code to create a Telegram bot.");
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [t, p] = await Promise.all([
        apiGet<TaskItem[]>("/tasks"),
        apiGet<ProjectItem[]>("/projects"),
      ]);
      setTasks(t);
      setProjects(p);
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const submit = async () => {
    try {
      await apiPost("/tasks", { type, assignee, project_id: projectId, payload: { ask } });
      setAsk("");
      refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  const grouped = useMemo(() => {
    const g: Record<string, TaskItem[]> = { queued: [], running: [], done: [], error: [] };
    tasks.forEach((t) => {
      const k = t.status ?? "queued";
      if (!g[k]) g[k] = [];
      g[k].push(t);
    });
    return g;
  }, [tasks]);

  const projectName = (id?: number | null) => projects.find((p) => p.id === id)?.name || "-";

  return (
    <div className="container-page space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task board</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="card space-y-3">
        <div className="font-semibold">Create task</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-600">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="coding">coding</option>
              <option value="analysis">analysis</option>
              <option value="simple_text">simple_text</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Assignee</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option>CEO</option>
              <option>Developer</option>
              <option>Marketing</option>
              <option>Analyst</option>
              <option>Support</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Project</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={projectId ?? ""}
              onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">(none)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="text-sm text-slate-600">Prompt / details</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={submit}>Create task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map((col) => (
          <div key={col.key} className="card space-y-2">
            <div className="font-semibold">{col.title}</div>
            <div className="space-y-2 text-sm">
              {(grouped[col.key] ?? []).map((t) => (
                <div key={t.id} className="border rounded px-3 py-2 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">#{t.id} • {t.type}</div>
                    <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-700">{t.status ?? "?"}</span>
                  </div>
                  <div className="text-slate-600">Agent: {t.assignee ?? t.agent ?? "-"}</div>
                  <div className="text-slate-600">Project: {projectName(t.project_id)}</div>
                  {t.created_at && <div className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</div>}
                  <div className="text-slate-700">Payload: {JSON.stringify(t.payload)}</div>
                  {t.result && <div className="text-slate-700">Result: {JSON.stringify(t.result)}</div>}
                </div>
              ))}
              {(grouped[col.key] ?? []).length === 0 && (
                <div className="text-slate-500">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
