"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("mindx_token");
    localStorage.removeItem("mindx_user");
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold tracking-widest text-green-400">
          MindX
        </h1>

        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
