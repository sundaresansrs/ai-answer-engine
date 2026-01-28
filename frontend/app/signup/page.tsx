"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const signup = () => {
    if (!username.trim()) return;

    localStorage.setItem("mindx_user", username);
    localStorage.setItem("mindx_token", `token_${username}`);

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md border border-zinc-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full mb-4 p-3 rounded bg-black border border-zinc-700 focus:outline-none"
        />

        <button
          onClick={signup}
          className="w-full bg-green-500 text-black py-2 rounded font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
