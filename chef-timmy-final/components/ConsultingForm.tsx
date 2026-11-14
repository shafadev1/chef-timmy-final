"use client";
import { useState } from "react";

type Props = { services: string[]; whatsappNumber: string };

const field =
  "w-full border border-paper-ink/30 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-paper-ink";

const types = ["Cafe", "Restaurant", "Catering", "Hotel", "Other"];
const stages = ["New concept, not yet built", "Opening soon", "Existing business that needs improvement"];

export default function ConsultingForm({ services, whatsappNumber }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [summary, setSummary] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const picked = f.getAll("services").map(String);

    setSummary(
      [
        "Hello Chef Timmy, I would like to enquire about F&B consulting.",
        `Name: ${get("name")}`,
        `Business: ${get("business_name") || "-"} (${get("business_type") || "-"})`,
        `Stage: ${get("stage") || "-"}`,
        `Location: ${get("location") || "-"}`,
        `Needs: ${picked.join(", ") || "-"}`,
        `Target timeline: ${get("timeline") || "-"}`,
        `Notes: ${get("notes") || "-"}`,
      ].join("\n"),
    );
    setStatus("sending");

    try {
      const res = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"), phone: get("phone"), email: get("email"),
          business_name: get("business_name"), business_type: get("business_type"),
          stage: get("stage"), location: get("location"), timeline: get("timeline"),
          notes: get("notes"), services: picked, website: get("website"),
        }),
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
        <h3 className="text-2xl">Thank you. Your enquiry has been received.</h3>
        <p className="mt-3">Chef Timmy will review your concept and get back to you. You can also send the details on WhatsApp.</p>
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
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <input name="name" required placeholder="Full name *" className={field} />
      <input name="phone" required placeholder="Phone / WhatsApp *" className={field} />
      <input name="email" type="email" placeholder="Email" className={field} />
      <input name="business_name" placeholder="Business name" className={field} />
      <select name="business_type" defaultValue="" className={field} aria-label="Type of business">
        <option value="">Type of business</option>
        {types.map((t) => <option key={t}>{t}</option>)}
      </select>
      <select name="stage" defaultValue="" className={field} aria-label="Current stage">
        <option value="">Where are you now?</option>
        {stages.map((t) => <option key={t}>{t}</option>)}
      </select>
      <input name="location" placeholder="Location" className={field} />
      <input name="timeline" placeholder="Target opening or start date" className={field} />

      <fieldset className="md:col-span-2">
        <legend className="eyebrow mb-3 text-paper-ink/60">What do you need help with?</legend>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <label key={s} className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="services" value={s} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <textarea
        name="notes" rows={4}
        placeholder="Tell us about your concept, your space and what you want to achieve"
        className={`${field} md:col-span-2`}
      />
      <div className="md:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-dark disabled:opacity-50">
          {status === "sending" ? "Sending..." : "Send Enquiry"}
        </button>
        {status === "error" && (
          <p className="mt-4 text-sm">
            We could not send your enquiry just now.{" "}
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
