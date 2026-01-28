"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const login = () => {
    if (!username.trim()) return;

    localStorage.setItem("mindx_user", username);
    localStorage.setItem("mindx_token", `token_${username}`);

    router.push("/");
  };

  const guestLogin = () => {
    const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("mindx_user", guestName);
    localStorage.setItem("mindx_token", `token_${guestName}`);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md border border-zinc-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to MindX</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mb-4 p-3 rounded bg-black border border-zinc-700 focus:outline-none"
        />

        <button
          onClick={login}
          className="w-full bg-green-500 text-black py-2 rounded font-semibold mb-3"
        >
          Sign In
        </button>

        <button
          onClick={guestLogin}
          className="w-full border border-zinc-600 py-2 rounded text-gray-300 hover:text-green-400"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
