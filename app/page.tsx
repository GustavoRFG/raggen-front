"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState("default");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://f559-2804-1b2-11c0-8707-c114-e798-a406-5689.ngrok-free.app/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, project }),
      });

      const data = await res.json();
      setResponse(data.response || "Sorry, I couldn't find an answer for that.");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error connecting to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocs = async () => {
    if (!files.length || !project.trim()) return;
    const formData = new FormData();
    formData.append("project", project);
    files.forEach((file) => formData.append("files", file));
    setUploading(true);

    try {
      const res = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.status || data.error);
    } catch (error) {
      alert("Error uploading files.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-black to-yellow-500 text-white p-6">
      <Image src="/logo.png" alt="Logo" width={100} height={100} className="mb-4" />
      <h1 className="text-5xl font-extrabold text-center mt-2 tracking-tight drop-shadow-md">RAG Generator</h1>
      <p className="text-lg text-center mb-6 max-w-xl text-white/80">Upload your PDFs, select the project, and ask smart questions with AI assistance.</p>

      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl w-full max-w-2xl shadow-2xl border border-yellow-400">
        <label className="block text-sm font-semibold mb-1 text-yellow-300">Project Name:</label>
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="e.g., tax-law"
          className="w-full mb-5 p-3 rounded-lg text-white border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
        />

        <label className="block text-sm font-semibold mb-1 text-yellow-300">PDF Files:</label>
        <div className="relative w-fit mb-4">
          <label
            htmlFor="fileInput"
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer shadow-md relative z-0"
          >
            <Upload size={18} /> Select PDF Files
          </label>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>

        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-white/80">{files.length} file(s) selected:</p>
            <ul className="text-xs text-white/60 mt-1 list-disc list-inside">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={uploadDocs}
          className="w-full bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-bold text-lg transition shadow-md flex justify-center items-center gap-2"
          disabled={uploading}
        >
          {uploading ? <><Loader2 className="animate-spin" size={20} /> Uploading...</> : <> <Upload size={20} /> Upload PDFs </>}
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm mt-8 p-8 rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question about the uploaded files..."
          className="w-full mb-4 p-3 rounded-lg text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        />

        <button
          onClick={sendQuestion}
          className="w-full bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-bold text-lg transition shadow-md"
        >
          Ask
        </button>

        <div className="mt-4 min-h-[120px] bg-white/10 p-4 rounded-lg border border-white/10">
          {loading ? (
            <p className="text-center text-yellow-200 text-lg">⏳ Thinking...</p>
          ) : response ? (
            <p className="whitespace-pre-line font-medium text-white/90">{response}</p>
          ) : (
            <p className="text-center text-sm opacity-70">Waiting for a question...</p>
          )}
        </div>
      </div>

      <footer className="mt-10 text-xs opacity-60">© {new Date().getFullYear()} RAG Generator - AI App</footer>
    </main>
  );
}
