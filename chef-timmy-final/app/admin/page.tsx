"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

type Recent = { id: string; name: string; event_date: string | null; guests: number | null; status: string; created_at: string };

export default function Dashboard() {
  const sb = getBrowserSupabase();
  const [data, setData] = useState<{ fresh: number; total: number; photos: number; consulting: number; recent: Recent[] } | null>(null);

  useEffect(() => {
    if (!sb) return;
    let live = true;
    Promise.all([
      sb.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
      sb.from("bookings").select("*", { count: "exact", head: true }),
      sb.from("gallery_items").select("*", { count: "exact", head: true }),
      sb.from("consulting_inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      sb.from("bookings").select("id,name,event_date,guests,status,created_at").order("created_at", { ascending: false }).limit(5),
    ]).then(([a, b, c, e, d]) => {
      if (live) setData({ fresh: a.count ?? 0, total: b.count ?? 0, photos: c.count ?? 0, consulting: e.count ?? 0, recent: (d.data as Recent[]) ?? [] });
    });
    return () => { live = false; };
  }, [sb]);

  if (!data) return <p className="eyebrow">Loading...</p>;

  const cards = [
    { n: data.fresh, t: "New requests", href: "/admin/bookings" },
    { n: data.total, t: "All requests", href: "/admin/bookings" },
    { n: data.consulting, t: "New consulting enquiries", href: "/admin/consulting" },
    { n: data.photos, t: "Gallery photos", href: "/admin/gallery" },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl">Dashboard</h1>
      <div className="mt-8 grid gap-px bg-graphite sm:grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.t} href={c.href} className="bg-ink p-6 transition hover:bg-charcoal">
            <p className="text-5xl font-bold">{c.n}</p>
            <p className="eyebrow mt-3">{c.t}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl">Latest requests</h2>
      <ul className="mt-4 divide-y divide-graphite border-y border-graphite">
        {data.recent.length === 0 && <li className="py-5 text-sm text-ash">No requests yet.</li>}
        {data.recent.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p>{r.name}</p>
              <p className="text-xs text-ash">
                {r.event_date ?? "Date not set"}{r.guests ? ` · ${r.guests} guests` : ""}
              </p>
            </div>
            <span className={`eyebrow ${r.status === "new" ? "text-bone" : ""}`}>{r.status}</span>
          </li>
        ))}
      </ul>
      <Link href="/admin/bookings" className="btn btn-ghost btn-sm mt-6">Open bookings</Link>
    </div>
  );
}
