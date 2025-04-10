// frontend/app/components/AnswerBox.tsx
"use client";

export default function AnswerBox({ response, chunks }: { response: string, chunks: string[] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">📌 Resposta</h2>
      <p className="mb-4 text-blue-800">{response}</p>
      {chunks.length > 0 && (
        <div>
          <h3 className="font-semibold">🔍 Trechos utilizados:</h3>
          <ul className="list-disc ml-6 mt-2">
            {chunks.map((chunk, i) => <li key={i}>{chunk}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}