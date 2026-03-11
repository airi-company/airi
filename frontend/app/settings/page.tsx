"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [groq, setGroq] = useState("");
  const [hf, setHf] = useState("");
  const [info, setInfo] = useState<string | null>(null);

  const save = async () => {
    setInfo("Set the keys as environment variables on the backend host: GROQ_API_KEY, HF_API_KEY.");
  };

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card space-y-3">
        <div className="text-sm text-slate-600">Nhập API key (không gửi lên server qua UI, chỉ để tiện ghi chú). Bạn cần export các biến trên máy chạy backend.</div>
        <div className="grid grid-cols-1 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Groq API Key" value={groq} onChange={(e) => setGroq(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="HF API Key" value={hf} onChange={(e) => setHf(e.target.value)} />
        </div>
        <Button onClick={save}>Save (instructions)</Button>
        {info && <div className="text-sm text-slate-700">{info}</div>}
      </div>
      <div className="text-sm text-slate-500">Để áp dụng thật, đặt trên backend: <code>export GROQ_API_KEY=...; export HF_API_KEY=...</code></div>
    </div>
  );
}
