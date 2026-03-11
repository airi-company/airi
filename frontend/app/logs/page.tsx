"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/utils";

interface LogsResp { logs: string[] }
interface MemoryResp { files: { path: string; content: string }[] }

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [files, setFiles] = useState<MemoryResp["files"]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [l, m] = await Promise.all([
        apiGet<LogsResp>("/logs"),
        apiGet<MemoryResp>("/memory"),
      ]);
      setLogs(l.logs ?? []);
      setFiles(m.files ?? []);
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Logs & Memory</h1>
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card max-h-[70vh] overflow-y-auto">
          <div className="font-semibold mb-2">Agent logs</div>
          <div className="space-y-1 text-sm text-slate-700">
            {logs.map((l, i) => <div key={i}>• {l}</div>)}
          </div>
        </div>
        <div className="card max-h-[70vh] overflow-y-auto">
          <div className="font-semibold mb-2">Memory files</div>
          <div className="space-y-4 text-sm">
            {files.map((f, i) => (
              <div key={i} className="border rounded p-2">
                <div className="font-semibold">{f.path}</div>
                <pre className="whitespace-pre-wrap text-slate-700 text-xs">{f.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
