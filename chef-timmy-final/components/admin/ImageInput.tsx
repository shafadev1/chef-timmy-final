"use client";
import { useState } from "react";
import { uploadFile } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  kind?: "image" | "pdf";
};

export default function ImageInput({ value, onChange, folder, kind = "image" }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadFile(file, kind === "pdf" ? "documents" : "images", folder));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Upload failed.");
    }
    setBusy(false);
  }

  return (
    <div className="flex items-start gap-4">
      {kind === "image" && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 w-20 shrink-0 object-cover" />
      )}
      <div className="min-w-0">
        <label className="btn btn-ghost btn-sm cursor-pointer">
          {busy ? "Uploading..." : value ? "Replace" : "Choose file"}
          <input
            type="file"
            hidden
            disabled={busy}
            accept={kind === "pdf" ? "application/pdf" : "image/*"}
            onChange={pick}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="eyebrow ml-4 underline">
            Remove
          </button>
        )}
        {kind === "pdf" && value && (
          <p className="mt-2 truncate text-xs text-ash">
            <a href={value} target="_blank" rel="noopener noreferrer" className="underline">
              {value.split("/").pop()}
            </a>
          </p>
        )}
        {err && <p className="mt-2 text-xs text-red-300">{err}</p>}
      </div>
    </div>
  );
}
