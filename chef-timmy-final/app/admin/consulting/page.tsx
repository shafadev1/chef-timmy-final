"use client";
import { useCallback, useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

type Booking = {
  id: string; name: string; phone: string; email: string | null; business_name: string | null;
  business_type: string | null; stage: string | null; location: string | null; services: string[];
  timeline: string | null; notes: string | null;
  status: "new" | "contacted" | "proposal" | "active" | "closed"; created_at: string;
};

const statuses = ["new", "contacted", "proposal", "active", "closed"] as const;
const label: Record<string, string> = { new: "New", contacted: "Contacted", proposal: "Proposal sent", active: "In progress", closed: "Closed" };

function waLink(b: Booking) {
  let d = b.phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  const text = `Hello ${b.name}, thank you for your consulting enquiry. This is Chef Timmy's team.`;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}


export default function ConsultingInquiriesAdmin() {
  const sb = getBrowserSupabase();
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [msg, setMsg] = useState("");

  const fetchRows = useCallback(async () => {
    const { data, error } = await sb!.from("consulting_inquiries").select("*").order("created_at", { ascending: false });
    return { rows: (data as Booking[]) ?? [], error: error?.message };
  }, [sb]);

  const apply = useCallback((r: { rows: Booking[]; error?: string }) => {
    if (r.error) setMsg(r.error);
    setRows(r.rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!sb) return;
    let live = true;
    fetchRows().then((r) => { if (live) apply(r); });
    return () => { live = false; };
  }, [sb, fetchRows, apply]);

  async function setStatus(id: string, status: string) {
    const { error } = await sb!.from("consulting_inquiries").update({ status }).eq("id", id);
    if (error) setMsg(error.message);
    apply(await fetchRows());
  }

  async function remove(b: Booking) {
    if (!confirm(`Delete the enquiry from ${b.name}? This cannot be undone.`)) return;
    const { error } = await sb!.from("consulting_inquiries").delete().eq("id", b.id);
    if (error) setMsg(error.message);
    apply(await fetchRows());
  }

  const count = (s: string) => (s === "all" ? rows.length : rows.filter((r) => r.status === s).length);
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl">Consulting Enquiries</h1>
      <p className="mt-2 text-sm text-ash">Enquiries sent from the Consulting page, newest first.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs uppercase tracking-widest ${filter === s ? "bg-bone text-ink" : "border border-graphite text-ash"}`}
          >
            {s === "all" ? "All" : label[s]} ({count(s)})
          </button>
        ))}
      </div>

      {msg && <p className="mt-5 border border-graphite px-4 py-3 text-sm">{msg}</p>}

      <ul className="mt-8 space-y-4">
        {loading && <li className="eyebrow">Loading...</li>}
        {!loading && shown.length === 0 && <li className="text-sm text-ash">No enquiries here yet.</li>}
        {shown.map((b) => (
          <li key={b.id} className="border border-graphite bg-charcoal p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xl">{b.business_name || b.name}</p>
                {b.business_name && <p className="text-sm text-ash">{b.name}</p>}
                <p className="eyebrow mt-1">
                  {new Date(b.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <select
                value={b.status}
                onChange={(e) => setStatus(b.id, e.target.value)}
                className="input w-auto"
                aria-label="Status"
              >
                {statuses.map((s) => <option key={s} value={s}>{label[s]}</option>)}
              </select>
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {([
                ["Phone", b.phone], ["Email", b.email], ["Type", b.business_type],
                ["Stage", b.stage], ["Location", b.location], ["Target timeline", b.timeline],
                ["Needs", b.services.join(", ")],
              ] as [string, string | number | null][]).map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd>{v || "-"}</dd>
                </div>
              ))}
            </dl>
            {b.notes && (
              <div className="mt-4 text-sm">
                <p className="label">Notes</p>
                <p className="whitespace-pre-wrap">{b.notes}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink(b)} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm">Reply on WhatsApp</a>
              {b.email && <a href={`mailto:${b.email}`} className="btn btn-ghost btn-sm">Email</a>}
              <button onClick={() => remove(b)} className="btn btn-sm border border-red-300/40 text-red-300 hover:bg-red-300 hover:text-ink">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
