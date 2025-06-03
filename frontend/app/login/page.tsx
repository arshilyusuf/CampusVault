"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form className="bg-white/80 dark:bg-black/30 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md flex flex-col gap-6 backdrop-blur-md border border-[var(--color-3)]">
        <h2 className="text-3xl font-bold text-center text-[var(--color-4)] mb-2">Admin Login</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-1)] dark:text-[var(--color-4)]">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-2)] bg-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-[var(--color-1)] dark:text-[var(--color-4)]">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-2)] bg-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-[var(--color-2)] hover:bg-[var(--color-3)] text-white font-semibold py-2 rounded-lg transition-colors
          hover:bg-red-900 active:bg-red-950
          "
        >
          Sign In
        </button>
       
      </form>
    </div>
  );
}
