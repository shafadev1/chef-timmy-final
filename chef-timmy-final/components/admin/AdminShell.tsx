"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/consulting", label: "Consulting Enquiries" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/menus", label: "Sample Menus" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/consulting-services", label: "Consulting Services" },
  { href: "/admin/consulting-steps", label: "Consulting Process" },
  { href: "/admin/stats", label: "Highlights" },
  { href: "/admin/experience", label: "Experience" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sb = getBrowserSupabase();
  const isLogin = pathname === "/admin/login";
  const [state, setState] = useState<"loading" | "ok" | "forbidden">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!sb || isLogin) return;
    let active = true;
    async function check() {
      const { data: { session } } = await sb!.auth.getSession();
      if (!active) return;
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      const { data } = await sb!.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (!active) return;
      setEmail(session.user.email ?? "");
      setState(data ? "ok" : "forbidden");
    }
    check();
    return () => { active = false; };
  }, [sb, isLogin, router]);

  async function logout() {
    await sb?.auth.signOut();
    router.replace("/admin/login");
  }

  if (!sb) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-3xl">Supabase is not connected</h1>
        <p className="mt-4 text-ash">
          Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server.
        </p>
      </div>
    );
  }
  if (isLogin) return <>{children}</>;
  if (state === "loading") return <p className="eyebrow p-10">Loading...</p>;
  if (state === "forbidden") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-3xl">No admin access</h1>
        <p className="mt-4 text-ash">
          {email} is signed in but is not registered as an admin. Add this account to the admins table (see supabase-schema.sql).
        </p>
        <button onClick={logout} className="btn btn-ghost btn-sm mt-8">Sign out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-graphite md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/admin" className="wordmark text-sm">Admin</Link>
          <p className="eyebrow hidden md:mt-2 md:block md:normal-case md:tracking-normal">{email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-3">
          {nav.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`block shrink-0 whitespace-nowrap px-3 py-2 text-sm transition ${
                  active ? "bg-bone text-ink" : "text-ash hover:text-bone"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden gap-3 px-5 py-6 md:flex md:flex-col">
          <Link href="/" target="_blank" className="eyebrow underline">View website</Link>
          <button onClick={logout} className="eyebrow text-left underline">Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
