"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await getBrowserSupabase()!.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    if (error) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="wordmark text-lg">Timmy Pramudyo</p>
        <p className="eyebrow mt-2">Admin panel</p>
        <hr className="rule mt-6 text-graphite" />
        <label className="label mt-8">Email</label>
        <input name="email" type="email" required autoComplete="email" className="input" />
        <label className="label mt-5">Password</label>
        <input name="password" type="password" required autoComplete="current-password" className="input" />
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="btn btn-light mt-8 w-full disabled:opacity-50">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
