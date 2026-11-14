const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type EmailRow = [string, string | number | null | undefined];

// Kirim email notifikasi lewat Resend. Gagal kirim tidak boleh menggagalkan request pengunjung.
export async function sendNotification(o: {
  title: string;
  subject: string;
  rows: EmailRow[];
  adminPath: string;
  replyTo?: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_EMAIL ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!apiKey || to.length === 0) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const adminUrl = site ? `${site}${o.adminPath}` : "";
  const line = ([k, v]: EmailRow) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#777">${esc(k)}</td><td style="padding:6px 0"><b>${esc(String(v || "-"))}</b></td></tr>`;
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 16px">${esc(o.title)}</h2>
      <table>${o.rows.map(line).join("")}</table>
      ${adminUrl ? `<p style="margin-top:24px"><a href="${adminUrl}" style="background:#111;color:#fff;padding:12px 20px;text-decoration:none">Open in admin panel</a></p>` : ""}
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Chef Timmy Website <onboarding@resend.dev>",
        to,
        subject: o.subject,
        html,
        reply_to: o.replyTo ?? undefined,
      }),
    });
    if (!res.ok) console.error("Email failed:", res.status, await res.text());
  } catch (e) {
    console.error("Email error:", e);
  }
}
