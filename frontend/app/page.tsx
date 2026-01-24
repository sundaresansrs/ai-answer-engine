"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askMindX = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-user-123",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch {
      setError("MindX couldn’t fetch an answer right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-extrabold tracking-wide mb-2 text-green-500">
        MindX
      </h1>

      <p className="text-gray-400 mb-8 text-center">
        Answers you can trust. Sources you can verify.
      </p>

      <div className="w-full max-w-xl">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Curiosity detected. Type away."
          className="w-full p-3 rounded bg-zinc-900 text-green-300 border border-zinc-700 focus:outline-none"
        />

        <button
          onClick={askMindX}
          disabled={loading}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? "MindX is thinking…" : "Ask MindX"}
        </button>

        {error && (
          <p className="mt-4 text-red-400 text-sm">{error}</p>
        )}

        {answer && (
          <div className="mt-6 bg-zinc-900 p-4 rounded border border-zinc-700">
            <h2 className="text-lg font-semibold mb-2 text-green-500">
              Answer
            </h2>
            <p className="text-green-300">{answer}</p>

            {sources.length > 0 && (
              <>
                <h3 className="mt-4 text-sm font-semibold text-gray-400">
                  Sources
                </h3>
                <ul className="text-sm text-gray-300 list-disc ml-5">
                  {sources.map((s, i) => (
                    <li key={i}>
                      {s.filename} (chunk {s.chunk_id})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
