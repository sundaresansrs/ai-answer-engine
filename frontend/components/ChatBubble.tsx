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

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const copyText = async () => {
    await navigator.clipboard.writeText(message.content);
    alert("Copied to clipboard");
  };

  return (
    <div
      className={`max-w-3xl rounded-lg p-4 ${
        isUser
          ? "ml-auto bg-green-500 text-black"
          : "mr-auto bg-muted"
      }`}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>

      {!isUser && (
        <>
          <button
            onClick={copyText}
            className="mt-2 text-xs underline opacity-70"
          >
            Copy
          </button>

          {message.reasoning.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-green-500">
                How MindX reasoned
              </summary>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {message.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </details>
          )}

          {message.sources.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-green-500">
                Sources
              </summary>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {message.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      className="underline"
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
  );
}
