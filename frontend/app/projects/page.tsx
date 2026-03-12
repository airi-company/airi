"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  id: number;
  name: string;
  description?: string;
  status?: string;
  repo_url?: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [createRepo, setCreateRepo] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => apiGet<ProjectItem[]>("/projects").then(setProjects).catch((e) => setError(String(e)));

  useEffect(() => { refresh(); }, []);

  const submit = async () => {
    try {
      await apiPost("/projects", { name, description: desc, status: "active", create_repo: createRepo });
      setName(""); setDesc(""); setCreateRepo(true);
      refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="container-page space-y-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-500">Quản lý dự án và repo GitHub trong org. Tạo dự án mới sẽ tự tạo repo nếu bật tùy chọn.</p>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

      <div className="card space-y-4 bg-white/80 dark:bg-slate-900/70">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-lg font-semibold">Tạo dự án</div>
            <div className="text-sm text-slate-500">Repo GitHub sẽ tạo trong org airi-company (nếu bật).</div>
          </div>
          <Button onClick={submit}>Create</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <input className="w-full border rounded px-3 py-2 bg-white/70 dark:bg-slate-800" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <textarea className="w-full border rounded px-3 py-2 bg-white/70 dark:bg-slate-800" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={createRepo} onChange={(e) => setCreateRepo(e.target.checked)} />
          Tạo repo GitHub trong org
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="card space-y-3 bg-white/90 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200">{p.status ?? "active"}</div>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{p.description}</div>
            {p.repo_url && <a className="inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-500" href={p.repo_url} target="_blank" rel="noreferrer">🔗 Repo</a>}
            <div className="text-xs text-slate-500">ID: {p.id}</div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-slate-500">Chưa có dự án nào.</div>}
      </div>
    </div>
  );
}
