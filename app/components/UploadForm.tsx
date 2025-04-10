// frontend/app/components/UploadForm.tsx
"use client";

import { useState } from "react";

export default function UploadForm({ onProjectSet }: { onProjectSet: (p: string) => void }) {
  const [project, setProject] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!project || !files) return alert("Preencha o projeto e selecione os PDFs");

    const formData = new FormData();
    formData.append("project", project);
    Array.from(files).forEach((f) => formData.append("files", f));

    await fetch("http://localhost:5001/upload", {
      method: "POST",
      body: formData,
    });

    onProjectSet(project);
    alert("Upload realizado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">1️⃣ Envio de PDFs</h2>
      <input type="text" placeholder="Nome do projeto" onChange={(e) => setProject(e.target.value)} className="border p-2 mr-2" />
      <input type="file" multiple accept=".pdf" onChange={(e) => setFiles(e.target.files)} className="border p-2" />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Enviar</button>
    </form>
  );
}