"use client";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { defaults } from "@/lib/content";
import ImageInput from "@/components/admin/ImageInput";

type F = { key: string; label: string; type?: "text" | "textarea" | "image" | "pdf"; help?: string };

const groups: { title: string; fields: F[] }[] = [
  {
    title: "Home hero",
    fields: [
      { key: "hero_image", label: "Main photo", type: "image", help: "Use the monochrome chef photo. Large photos are resized automatically." },
      { key: "hero_title", label: "Name" },
      { key: "hero_role", label: "Role line" },
      { key: "hero_tagline", label: "Tagline" },
    ],
  },
  {
    title: "Story block (home)",
    fields: [
      { key: "story_image", label: "Photo", type: "image" },
      { key: "story_title", label: "Title" },
      { key: "story_body", label: "Text", type: "textarea" },
      { key: "story_quote", label: "Quote" },
    ],
  },
  {
    title: "Beyond the Plate",
    fields: [
      { key: "btp_image", label: "Photo", type: "image" },
      { key: "btp_title", label: "Title" },
      { key: "btp_body", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Profile and expertise",
    fields: [
      { key: "profile_text", label: "Profile paragraph", type: "textarea" },
      { key: "core_expertise", label: "Core expertise", type: "textarea", help: "Separate items with the | symbol." },
      { key: "professional_focus", label: "Professional focus", type: "textarea", help: "Separate items with the | symbol." },
    ],
  },
  {
    title: "Consulting page",
    fields: [
      { key: "consulting_hero_title", label: "Headline" },
      { key: "consulting_hero_text", label: "Intro text", type: "textarea" },
      { key: "consulting_duration_note", label: "Project duration note" },
      { key: "consulting_why_title", label: "Why Chef Timmy: title" },
      { key: "consulting_why_text", label: "Why Chef Timmy: text", type: "textarea" },
    ],
  },
  {
    title: "Contact and social links",
    fields: [
      { key: "whatsapp_number", label: "WhatsApp number", help: "Digits only with country code, for example 6281234567890." },
      { key: "whatsapp_message", label: "Default WhatsApp message" },
      { key: "instagram_url", label: "Instagram link", help: "Full link, for example https://instagram.com/username" },
      { key: "linkedin_url", label: "LinkedIn link" },
    ],
  },
  {
    title: "Documents (CV and autobiography)",
    fields: [
      { key: "cv_url", label: "Curriculum Vitae (PDF)", type: "pdf", help: "Shown on the Downloads page. Visitors can view it or download it." },
      { key: "autobiography_url", label: "Autobiography (PDF)", type: "pdf", help: "Shown on the Downloads page. Visitors can view it or download it." },
    ],
  },
];

export default function ContentAdmin() {
  const sb = getBrowserSupabase();
  const [values, setValues] = useState<Record<string, string>>({ ...defaults });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!sb) return;
    let live = true;
    Promise.resolve(sb.from("site_content").select("key,value")).then(({ data }) => {
      if (!live) return;
      const next = { ...defaults };
      (data ?? []).forEach((r: { key: string; value: string }) => { if (r.value) next[r.key] = r.value; });
      setValues(next);
      setLoading(false);
    });
    return () => { live = false; };
  }, [sb]);

  async function save() {
    setBusy(true);
    const rows = groups.flatMap((g) => g.fields).map((f) => ({
      key: f.key, value: values[f.key] ?? "", updated_at: new Date().toISOString(),
    }));
    const { error } = await sb!.from("site_content").upsert(rows, { onConflict: "key" });
    setBusy(false);
    setMsg(error ? error.message : "Saved. The website updates within a minute.");
  }

  if (!sb) return null;
  if (loading) return <p className="eyebrow">Loading...</p>;

  return (
    <div className="max-w-3xl pb-24">
      <h1 className="text-3xl">Site Content</h1>
      <p className="mt-2 text-sm text-ash">Texts, photos and links used across the website.</p>

      {groups.map((g) => (
        <section key={g.title} className="mt-10 border border-graphite bg-charcoal p-6">
          <h2 className="text-xl">{g.title}</h2>
          <div className="mt-6 space-y-5">
            {g.fields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                {f.type === "image" || f.type === "pdf" ? (
                  <ImageInput
                    kind={f.type === "pdf" ? "pdf" : "image"}
                    folder="site"
                    value={values[f.key] ?? ""}
                    onChange={(v) => setValues({ ...values, [f.key]: v })}
                  />
                ) : f.type === "textarea" ? (
                  <textarea rows={4} className="input" value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                ) : (
                  <input className="input" value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                )}
                {f.help && <p className="mt-1 text-xs text-ash">{f.help}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-graphite bg-ink px-5 py-4 md:left-60 md:px-10">
        <div className="flex max-w-3xl items-center gap-5">
          <button onClick={save} disabled={busy} className="btn btn-light btn-sm disabled:opacity-50">
            {busy ? "Saving..." : "Save all changes"}
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
