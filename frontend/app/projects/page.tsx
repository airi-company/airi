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
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      {error && <div className="text-red-600">{error}</div>}
      <div className="card space-y-3">
        <div className="font-semibold">Create project</div>
        <input className="border rounded px-3 py-2" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="border rounded px-3 py-2" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={createRepo} onChange={(e) => setCreateRepo(e.target.checked)} />
          Tạo repo GitHub trong org
        </label>
        <Button onClick={submit}>Create</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">{p.status ?? "active"}</div>
            </div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{p.description}</div>
            {p.repo_url && <a className="text-sm text-blue-600 underline" href={p.repo_url} target="_blank" rel="noreferrer">Repo: {p.repo_url}</a>}
            <div className="text-xs text-slate-500">ID: {p.id}</div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-slate-500">No projects yet.</div>}
      </div>
    </div>
  );
}
