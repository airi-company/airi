"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TaskItem {
  type: string;
  payload: any;
  assignee?: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [type, setType] = useState("coding");
  const [assignee, setAssignee] = useState("Developer");
  const [ask, setAsk] = useState("Write Python code to create a Telegram bot.");
  const [error, setError] = useState<string | null>(null);

  const refresh = () => apiGet<TaskItem[]>("/tasks").then(setTasks).catch((e) => setError(String(e)));
  useEffect(() => {
    refresh();
  }, []);

  const submit = async () => {
    try {
      await apiPost("/tasks", { type, assignee, payload: { ask } });
      setAsk("");
      refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Task board</h1>
      {error && <div className="text-red-600">{error}</div>}

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

      <div className="card">
        <div className="font-semibold mb-2">Tasks in queue</div>
        <div className="space-y-2 text-sm">
          {tasks.length === 0 && <div className="text-slate-500">No tasks in queue.</div>}
          {tasks.map((t, i) => (
            <div key={i} className="border rounded px-3 py-2">
              <div className="font-semibold">{t.type}</div>
              <div className="text-slate-600">Assignee: {t.assignee ?? "-"}</div>
              <div className="text-slate-700">Payload: {JSON.stringify(t.payload)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
