"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Source = {
  title: string;
  url: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  reasoning: string[];
  sources: Source[];
};

export default function Home() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /* 🔐 Auth guard */
  useEffect(() => {
    const token = localStorage.getItem("mindx_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  /* 🔽 Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askMindX = async () => {
    if (!question.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: question,
      reasoning: [],
      sources: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("mindx_token")}`,
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const botMsg: Message = {
        role: "assistant",
        content: data.answer?.final_answer || "No answer generated.",
        reasoning: data.answer?.reasoning_summary || [],
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          reasoning: [],
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-green-300">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-3xl rounded-lg p-4 ${
              m.role === "user"
                ? "ml-auto bg-green-500 text-black"
                : "mr-auto bg-zinc-900 border border-zinc-700"
            }`}
          >
            <p className="whitespace-pre-wrap">{m.content}</p>

            {m.role === "assistant" && (
              <>
                <button
                  onClick={() => copyAnswer(m.content, i)}
                  className="mt-2 text-xs underline opacity-70"
                >
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>

                {m.reasoning.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-green-400">
                      How MindX reasoned
                    </summary>
                    <ul className="list-disc ml-5 mt-2 text-sm text-gray-300">
                      {m.reasoning.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </details>
                )}

                {m.sources.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-green-400">
                      Sources
                    </summary>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                      {m.sources.map((s, idx) => (
                        <li key={idx}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-green-400"
                          >
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-zinc-900 border border-zinc-700 rounded-lg p-4 max-w-3xl">
            MindX is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar (fixed) */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askMindX()}
            placeholder="Ask MindX anything…"
            className="flex-1 rounded-md bg-zinc-900 border border-zinc-700 p-3 focus:outline-none"
          />
          <button
            onClick={askMindX}
            disabled={loading}
            className="bg-green-500 text-black px-5 rounded-md font-semibold disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
