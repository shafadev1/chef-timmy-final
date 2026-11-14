import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { getSiteContent, getPackages, getMenus, getFaqs, formatPrice, whatsappLink } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Private Chef | Timmy Pramudyo",
  description: "Private chef dining by Chef Timmy Pramudyo: intimate dinners, tasting menus and private events.",
};

const steps = [
  { n: "01", t: "Enquire", d: "Tell us your date, guests and the occasion." },
  { n: "02", t: "Design the menu", d: "Chef Timmy shapes a menu around your tastes and dietary needs." },
  { n: "03", t: "Dine", d: "The kitchen comes to you. You enjoy the evening." },
];

export default async function PrivateChefPage() {
  const [c, packages, menus, faqs] = await Promise.all([getSiteContent(), getPackages(), getMenus(), getFaqs()]);
  const wa = whatsappLink(c);

  return (
    <>
      <section className="px-6 pb-24 pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Private Chef</p>
          <h1 className="mt-5 max-w-4xl text-5xl uppercase md:text-7xl">An evening, cooked for you.</h1>
          <hr className="rule mt-8 max-w-xl text-bone" />
          <p className="subtitle mt-6 max-w-2xl text-2xl md:text-3xl">
            Intimate dinners, tasting menus and private events, prepared at your table.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#book" className="btn btn-light">Request a Booking</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="border-y border-graphite">
        <ol className="mx-auto grid max-w-7xl md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="border-graphite px-6 py-12 md:border-l md:first:border-l-0">
              <p className="eyebrow">{s.n}</p>
              <h3 className="mt-3 text-2xl">{s.t}</h3>
              <p className="mt-2 text-ash">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="packages" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Packages</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Choose how the evening unfolds.</h2>
          <div className="mt-12 grid gap-px bg-graphite md:grid-cols-3">
            {packages.map((p) => (
              <article key={p.id} className="flex flex-col bg-ink p-8">
                <h3 className="text-2xl">{p.name}</h3>
                <p className="eyebrow mt-3 text-bone">{formatPrice(p)}</p>
                <p className="mt-5 text-ash">{p.description}</p>
                {(p.min_guests || p.max_guests) && (
                  <p className="mt-5 text-sm">
                    Guests: {p.min_guests ?? "1"}{p.max_guests ? ` to ${p.max_guests}` : "+"}
                  </p>
                )}
                {p.includes.length > 0 && (
                  <div className="mt-5">
                    <p className="eyebrow">Included</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {p.includes.map((i) => <li key={i}>+ {i}</li>)}
                    </ul>
                  </div>
                )}
                {p.excludes.length > 0 && (
                  <div className="mt-5">
                    <p className="eyebrow">Not included</p>
                    <ul className="mt-2 space-y-1 text-sm text-ash">
                      {p.excludes.map((i) => <li key={i}>- {i}</li>)}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {menus.length > 0 && (
        <section id="menus" className="paper px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow text-paper-ink/60">Sample Menus</p>
            <h2 className="mt-4 text-4xl md:text-5xl">A taste of what to expect.</h2>
            <div className="mt-12 grid gap-12 md:grid-cols-2">
              {menus.map((m) => (
                <article key={m.id}>
                  <h3 className="text-2xl">{m.name}</h3>
                  {m.description && <p className="mt-2">{m.description}</p>}
                  <ol className="mt-6 divide-y divide-paper-ink/20 border-y border-paper-ink/20">
                    {m.courses.map((co, i) => (
                      <li key={i} className="py-4">
                        <p className="eyebrow text-paper-ink/60">{co.label}</p>
                        <p className="mt-1 font-medium">{co.dish}</p>
                        {co.note && <p className="text-sm">{co.note}</p>}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="px-6 py-28">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Good to know.</h2>
            <div className="mt-10 divide-y divide-graphite border-y border-graphite">
              {faqs.map((f) => (
                <details key={f.id} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg">
                    {f.question}
                    <span className="text-2xl transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ash">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="paper px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-paper-ink/60">Booking</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Request a booking.</h2>
          <p className="mb-10 mt-4 max-w-xl">Share a few details and Chef Timmy will get back to you to plan the evening.</p>
          <BookingForm
            packages={packages.map((p) => ({ id: p.id, name: p.name }))}
            whatsappNumber={c.whatsapp_number}
          />
        </div>
      </section>
    </>
  );
}
