import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotification } from "@/lib/email";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  if (!url || !key) return NextResponse.json({ error: "Booking is not available right now." }, { status: 503 });

  const guests = Math.floor(Number(b.guests));
  const row = {
    name,
    phone,
    email: s("email", 160) || null,
    event_date: /^\d{4}-\d{2}-\d{2}$/.test(s("event_date")) ? s("event_date") : null,
    guests: Number.isFinite(guests) && guests > 0 ? guests : null,
    location: s("location", 200) || null,
    budget: s("budget", 100) || null,
    package_id: UUID.test(s("package_id")) ? s("package_id") : null,
    notes: s("notes", 2000) || null,
  };

  const { error } = await createClient(url, key).from("bookings").insert(row);
  if (error) {
    console.error("Booking insert failed:", error.message);
    return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  }

  await sendNotification({
    title: "New private chef request",
    subject: `New private chef request: ${row.name}${row.guests ? ` (${row.guests} guests)` : ""}`,
    adminPath: "/admin/bookings",
    replyTo: row.email,
    rows: [
      ["Name", row.name], ["Phone", row.phone], ["Email", row.email], ["Date", row.event_date],
      ["Guests", row.guests], ["Location", row.location], ["Package", s("package_name", 120)],
      ["Budget", row.budget], ["Notes", row.notes],
    ],
  });
  return NextResponse.json({ ok: true });
}
