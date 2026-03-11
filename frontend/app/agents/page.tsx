"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Agent = {
  name: string;
  status: string;
  current_task?: any;
  last_activity?: string | null;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const refresh = () => apiGet<Agent[]>("/agents").then(setAgents).catch((e) => setError(String(e)));

  useEffect(() => {
    refresh();
  }, []);

  const toggle = async (agent: Agent, action: "start" | "stop") => {
    try {
      await apiPost(`/agents/${action}`, { name: agent.name });
      refresh();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Agents</h1>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {agents.map((a) => (
          <div key={a.name} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-sm text-slate-500">{a.status}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggle(a, "start")}
                  disabled={a.status === "running"}
                >
                  Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggle(a, "stop")}
                  disabled={a.status === "stopped"}
                >
                  Stop
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-600">Current task: {a.current_task ? a.current_task.type : "-"}</div>
            <div className="text-sm text-slate-600">Last activity: {a.last_activity ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
