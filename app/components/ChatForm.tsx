// frontend/app/components/ChatForm.tsx
"use client";

import { useState } from "react";

export default function ChatForm({ project, onResponse, onChunks }: { project: string, onResponse: (s: string) => void, onChunks: (a: string[]) => void }) {
  const [question, setQuestion] = useState("");

  const handleAsk = async (e: any) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, project }),
    });

    const data = await res.json();
    onResponse(data.response || "Sem resposta");
    onChunks(data.chunks_utilizados || []);
  };

  return (
    <form onSubmit={handleAsk} className="mb-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">2️⃣ Faça uma pergunta</h2>
      <input type="text" placeholder="Digite sua pergunta" onChange={(e) => setQuestion(e.target.value)} className="border p-2 w-2/3" />
      <button type="submit" className="ml-2 px-4 py-2 bg-green-600 text-white rounded">Perguntar</button>
    </form>
  );
}