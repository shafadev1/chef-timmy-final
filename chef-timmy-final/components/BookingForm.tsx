"use client";
import { useState } from "react";

type Props = { packages: { id: string; name: string }[]; whatsappNumber: string };

const field =
  "w-full border border-paper-ink/30 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-paper-ink";

export default function BookingForm({ packages, whatsappNumber }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [summary, setSummary] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const pkgId = get("package_id");
    const pkgName = packages.find((p) => p.id === pkgId)?.name ?? "";

    setSummary(
      [
        "Hello Chef Timmy, I would like to enquire about a private chef booking.",
        `Name: ${get("name")}`,
        `Date: ${get("event_date") || "-"}`,
        `Guests: ${get("guests") || "-"}`,
        `Location: ${get("location") || "-"}`,
        `Package: ${pkgName || "Not decided yet"}`,
        `Budget: ${get("budget") || "-"}`,
        `Notes: ${get("notes") || "-"}`,
      ].join("\n"),
    );
    setStatus("sending");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(f.entries()), package_name: pkgName }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const waHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(summary)}`;

  if (status === "done") {
    return (
      <div className="border border-paper-ink/30 p-8 text-center">
        <h3 className="text-2xl">Thank you. Your request has been received.</h3>
        <p className="mt-3">Chef Timmy will get back to you soon. For a faster reply, you can also send the details on WhatsApp.</p>
        {whatsappNumber && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-6">
            Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      {/* honeypot anti-spam: disembunyikan dari pengunjung asli */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <input name="name" required placeholder="Full name *" className={field} />
      <input name="phone" required placeholder="Phone / WhatsApp *" className={field} />
      <input name="email" type="email" placeholder="Email" className={field} />
      <input name="event_date" type="date" className={field} aria-label="Event date" />
      <input name="guests" type="number" min={1} placeholder="Number of guests" className={field} />
      <input name="location" placeholder="Location (villa, hotel, city)" className={field} />
      <select name="package_id" className={field} defaultValue="" aria-label="Package">
        <option value="">Package (optional)</option>
        {packages.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input name="budget" placeholder="Budget (optional)" className={field} />
      <textarea
        name="notes" rows={4}
        placeholder="Dietary needs, occasion, anything we should know"
        className={`${field} md:col-span-2`}
      />
      <div className="md:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-dark disabled:opacity-50">
          {status === "sending" ? "Sending..." : "Send Request"}
        </button>
        {status === "error" && (
          <p className="mt-4 text-sm">
            We could not send your request just now.{" "}
            {whatsappNumber ? (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline">
                Please send it on WhatsApp instead.
              </a>
            ) : (
              "Please try again in a moment."
            )}
          </p>
        )}
      </div>
    </form>
  );
}
