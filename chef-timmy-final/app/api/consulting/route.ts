import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot anti-spam

  const s = (k: string, max = 500) => String(b[k] ?? "").trim().slice(0, max);
  const name = s("name", 120);
  const phone = s("phone", 40);
  if (!name || !phone) return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Enquiries are not available right now." }, { status: 503 });

  const services = Array.isArray(b.services)
    ? b.services.map((x) => String(x).trim().slice(0, 60)).filter(Boolean).slice(0, 12)
    : [];

  const row = {
    name,
    phone,
    email: s("email", 160) || null,
    business_name: s("business_name", 160) || null,
    business_type: s("business_type", 60) || null,
    stage: s("stage", 120) || null,
    location: s("location", 200) || null,
    services,
    timeline: s("timeline", 120) || null,
    notes: s("notes", 2000) || null,
  };

  const { error } = await createClient(url, key).from("consulting_inquiries").insert(row);
  if (error) {
    console.error("Consulting insert failed:", error.message);
    return NextResponse.json({ error: "Could not save your enquiry." }, { status: 500 });
  }

  await sendNotification({
    title: "New consulting enquiry",
    subject: `New consulting enquiry: ${row.business_name || row.name}${row.business_type ? ` (${row.business_type})` : ""}`,
    adminPath: "/admin/consulting",
    replyTo: row.email,
    rows: [
      ["Name", row.name], ["Phone", row.phone], ["Email", row.email], ["Business", row.business_name],
      ["Type", row.business_type], ["Stage", row.stage], ["Location", row.location],
      ["Services needed", services.join(", ")], ["Target timeline", row.timeline], ["Notes", row.notes],
    ],
  });
  return NextResponse.json({ ok: true });
}
