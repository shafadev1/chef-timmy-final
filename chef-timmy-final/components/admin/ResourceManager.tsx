"use client";
import { useCallback, useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { uploadFile } from "@/lib/upload";
import ImageInput from "./ImageInput";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "image" | "lines" | "courses";
  options?: string[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  full?: boolean;
};

type Row = Record<string, unknown> & { id: string };
type Course = { label: string; dish: string; note?: string };

type Props = {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  titleField: string;
  subtitleField?: string;
  thumbField?: string;
  defaults?: Record<string, unknown>;
  bulkImage?: { field: string; folder: string; titleField?: string };
  addLabel?: string;
  flagField?: { name: string; label: string; max?: number };
};

function toForm(f: Field, v: unknown): unknown {
  if (f.type === "checkbox") return Boolean(v);
  if (f.type === "lines") return Array.isArray(v) ? v.join("\n") : "";
  if (f.type === "courses")
    return Array.isArray(v)
      ? (v as Course[]).map((c) => [c.label, c.dish, c.note ?? ""].join(" | ").replace(/( \| )+$/, "")).join("\n")
      : "";
  return v == null ? "" : String(v);
}

function fromForm(f: Field, v: unknown): unknown {
  const s = typeof v === "string" ? v : "";
  switch (f.type) {
    case "checkbox": return Boolean(v);
    case "number": return s.trim() === "" ? null : Number(s);
    case "lines": return s.split("\n").map((x) => x.trim()).filter(Boolean);
    case "courses":
      return s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const [label = "", dish = "", ...note] = l.split("|").map((x) => x.trim());
        return { label, dish, note: note.join(" | ") };
      });
    case "image": return s === "" && !f.required ? null : s;
    default: return s.trim();
  }
}

export default function ResourceManager(p: Props) {
  const sb = getBrowserSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null); // row id atau "new"
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchRows = useCallback(async () => {
    const { data, error } = await sb!.from(p.table).select("*").order("sort_order", { ascending: true });
    return { rows: (data as Row[]) ?? [], error: error?.message };
  }, [sb, p.table]);

  const apply = useCallback((r: { rows: Row[]; error?: string }) => {
    if (r.error) setMsg(r.error);
    setRows(r.rows);
    setLoading(false);
  }, []);

  const load = useCallback(async () => apply(await fetchRows()), [fetchRows, apply]);

  useEffect(() => {
    if (!sb) return;
    let live = true;
    fetchRows().then((r) => {
      if (live) apply(r);
    });
    return () => { live = false; };
  }, [sb, fetchRows, apply]);

  function openForm(row: Row | null) {
    const base: Record<string, unknown> = {};
    p.fields.forEach((f) => {
      base[f.name] = toForm(f, row ? row[f.name] : p.defaults?.[f.name]);
    });
    setForm(base);
    setEditing(row ? row.id : "new");
    setMsg("");
  }

  const nextOrder = () => rows.reduce((m, r) => Math.max(m, Number(r.sort_order) || 0), 0) + 1;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    for (const f of p.fields) {
      if (f.required && f.type !== "checkbox" && !String(form[f.name] ?? "").trim()) {
        setMsg(`"${f.label}" is required.`);
        return;
      }
    }
    const payload: Record<string, unknown> = {};
    p.fields.forEach((f) => { payload[f.name] = fromForm(f, form[f.name]); });
    setBusy(true);
    const res =
      editing === "new"
        ? await sb!.from(p.table).insert({ ...payload, sort_order: nextOrder() })
        : await sb!.from(p.table).update(payload).eq("id", editing!);
    setBusy(false);
    if (res.error) return setMsg(res.error.message);
    setEditing(null);
    setMsg("Saved.");
    load();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${String(row[p.titleField] ?? "this item")}"? This cannot be undone.`)) return;
    const { error } = await sb!.from(p.table).delete().eq("id", row.id);
    if (error) return setMsg(error.message);
    setMsg("Deleted.");
    load();
  }

  async function togglePublished(row: Row) {
    const { error } = await sb!.from(p.table).update({ is_published: !row.is_published }).eq("id", row.id);
    if (error) return setMsg(error.message);
    load();
  }

  async function toggleFlag(row: Row) {
    const f = p.flagField!;
    const turningOn = !row[f.name];
    if (turningOn && f.max && rows.filter((r) => r[f.name]).length >= f.max) {
      setMsg(`Only ${f.max} can be selected for the ${f.label}. Remove one first.`);
      return;
    }
    const { error } = await sb!.from(p.table).update({ [f.name]: turningOn }).eq("id", row.id);
    if (error) return setMsg(error.message);
    setMsg("");
    load();
  }

  async function move(index: number, dir: -1 | 1) {
    const a = rows[index];
    const b = rows[index + dir];
    if (!b) return;
    // beri nomor urut baru yang pasti berbeda supaya tukar posisi selalu berhasil
    const ra = await sb!.from(p.table).update({ sort_order: index + dir + 1 }).eq("id", a.id);
    const rb = await sb!.from(p.table).update({ sort_order: index + 1 }).eq("id", b.id);
    if (ra.error || rb.error) setMsg((ra.error ?? rb.error)!.message);
    load();
  }

  async function bulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length || !p.bulkImage) return;
    setBusy(true);
    let order = nextOrder();
    let done = 0;
    for (const file of files) {
      setMsg(`Uploading ${done + 1} of ${files.length}...`);
      try {
        const url = await uploadFile(file, "images", p.bulkImage.folder);
        const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
        const { error } = await sb!.from(p.table).insert({
          ...p.defaults,
          [p.bulkImage.field]: url,
          [p.bulkImage.titleField ?? "title"]: title,
          sort_order: order++,
        });
        if (error) throw error;
        done++;
      } catch (x) {
        setMsg(`Stopped after ${done} file(s): ${x instanceof Error ? x.message : "upload failed"}`);
        break;
      }
    }
    if (done === files.length) setMsg(`${done} photo(s) added. Click Edit to set a title, category or story.`);
    setBusy(false);
    load();
  }

  if (!sb) return null;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">{p.title}</h1>
          {p.description && <p className="mt-2 max-w-2xl text-sm text-ash">{p.description}</p>}
        </div>
        <div className="flex gap-3">
          {p.bulkImage && (
            <label className={`btn btn-ghost btn-sm cursor-pointer ${busy ? "opacity-50" : ""}`}>
              Upload photos
              <input type="file" hidden multiple accept="image/*" disabled={busy} onChange={bulkUpload} />
            </label>
          )}
          <button onClick={() => openForm(null)} className="btn btn-light btn-sm">
            {p.addLabel ?? "Add new"}
          </button>
        </div>
      </div>

      {msg && <p className="mt-5 border border-graphite px-4 py-3 text-sm">{msg}</p>}

      {editing && (
        <form onSubmit={save} className="mt-8 border border-graphite bg-charcoal p-6">
          <h2 className="text-xl">{editing === "new" ? "New item" : "Edit item"}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {p.fields.map((f) => {
              const full = f.full || f.type === "textarea" || f.type === "lines" || f.type === "courses" || f.type === "image";
              const val = form[f.name];
              const set = (v: unknown) => setForm({ ...form, [f.name]: v });
              return (
                <div key={f.name} className={full ? "md:col-span-2" : ""}>
                  {f.type !== "checkbox" && (
                    <label className="label">{f.label}{f.required ? " *" : ""}</label>
                  )}
                  {f.type === "textarea" || f.type === "lines" || f.type === "courses" ? (
                    <textarea
                      rows={f.type === "textarea" ? 4 : 6}
                      className="input"
                      value={String(val ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => set(e.target.value)}
                    />
                  ) : f.type === "select" ? (
                    <select className="input" value={String(val ?? "")} onChange={(e) => set(e.target.value)}>
                      {f.options!.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-3 text-sm">
                      <input type="checkbox" checked={Boolean(val)} onChange={(e) => set(e.target.checked)} />
                      {f.label}
                    </label>
                  ) : f.type === "image" ? (
                    <ImageInput value={String(val ?? "")} onChange={set} folder={p.table} />
                  ) : (
                    <input
                      className="input"
                      type={f.type === "number" ? "number" : "text"}
                      value={String(val ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => set(e.target.value)}
                    />
                  )}
                  {f.help && <p className="mt-1 text-xs text-ash">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex gap-3">
            <button disabled={busy} className="btn btn-light btn-sm disabled:opacity-50">
              {busy ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </form>
      )}

      {p.flagField && (
        <p className="mt-6 text-sm text-ash">
          {rows.filter((r) => r[p.flagField!.name]).length}
          {p.flagField.max ? ` of ${p.flagField.max}` : ""} selected for the {p.flagField.label}. Click the star on a row to
          add or remove it. If none are selected, the first {p.flagField.max ?? ""} items are shown.
        </p>
      )}

      <ul className="mt-4 divide-y divide-graphite border-y border-graphite">
        {loading && <li className="eyebrow py-6">Loading...</li>}
        {!loading && rows.length === 0 && <li className="py-6 text-sm text-ash">Nothing here yet. Click &quot;{p.addLabel ?? "Add new"}&quot;.</li>}
        {rows.map((r, i) => (
          <li key={r.id} className="flex flex-wrap items-center gap-4 py-4">
            {p.thumbField && typeof r[p.thumbField] === "string" && r[p.thumbField] !== "" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(r[p.thumbField])} alt="" className="h-16 w-16 shrink-0 object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate">{String(r[p.titleField] ?? "") || "(untitled)"}</p>
              {p.subtitleField && <p className="truncate text-xs text-ash">{String(r[p.subtitleField] ?? "")}</p>}
            </div>
            {p.flagField && (
              <button
                onClick={() => toggleFlag(r)}
                className={`eyebrow ${r[p.flagField.name] ? "text-bone" : "opacity-50"}`}
              >
                {r[p.flagField.name] ? "★ On home" : "☆ Add to home"}
              </button>
            )}
            {"is_published" in r && (
              <button onClick={() => togglePublished(r)} className={`eyebrow ${r.is_published ? "" : "opacity-50"}`}>
                {r.is_published ? "Visible" : "Hidden"}
              </button>
            )}
            <div className="flex gap-1 text-lg">
              <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="px-2 disabled:opacity-20">↑</button>
              <button aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="px-2 disabled:opacity-20">↓</button>
            </div>
            <button onClick={() => openForm(r)} className="btn btn-ghost btn-sm">Edit</button>
            <button onClick={() => remove(r)} className="btn btn-sm border border-red-300/40 text-red-300 hover:bg-red-300 hover:text-ink">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
