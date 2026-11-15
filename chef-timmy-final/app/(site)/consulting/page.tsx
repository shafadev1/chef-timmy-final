import type { Metadata } from "next";
import ConsultingForm from "@/components/ConsultingForm";
import {
  getSiteContent, getConsultingServices, getConsultingSteps, getConsultingClients, whatsappLink,
} from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "F&B Consulting | Timmy Pramudyo",
  description:
    "F&B consulting for cafes, restaurants, catering and hotels: menu development, concept, training, kitchen and bar management, service and business.",
};

const audiences = [
  { t: "Hotel", d: "Food and beverage outlets that meet hotel standards and guest expectations." },
  { t: "Restaurant", d: "New openings and existing restaurants that need a sharper concept or tighter operations." },
  { t: "Cafe", d: "Coffee-led and all-day concepts, from the menu to the daily rhythm of service." },
  { t: "Catering", d: "Menus, production systems and costing built to deliver the same quality at scale." },
];

export default async function ConsultingPage() {
  const [c, services, steps, clients] = await Promise.all([
    getSiteContent(), getConsultingServices(), getConsultingSteps(), getConsultingClients(),
  ]);
  const wa = whatsappLink(c);

  return (
    <>
      <section className="px-6 pb-24 pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">F&amp;B Consulting</p>
          <h1 className="mt-5 max-w-4xl text-4xl uppercase md:text-6xl">{c.consulting_hero_title}</h1>
          <hr className="rule mt-8 max-w-xl text-bone" />
          <p className="mt-6 max-w-2xl text-lg text-ash">{c.consulting_hero_text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#inquiry" className="btn btn-light">Start a Project</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="border-y border-graphite">
        <ul className="mx-auto grid max-w-7xl md:grid-cols-4">
          {audiences.map((a) => (
            <li key={a.t} className="border-graphite px-6 py-12 md:border-l md:first:border-l-0">
              <p className="eyebrow">Who we work with</p>
              <h3 className="mt-3 text-2xl">{a.t}</h3>
              <p className="mt-2 text-sm text-ash">{a.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="services" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Everything behind a venue that works.</h2>
          <div className="mt-12 grid border-l border-t border-graphite md:grid-cols-3">
            {services.map((s, i) => (
              <article key={s.id} className="border-b border-r border-graphite p-8">
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-2xl">{s.title}</h3>
                <p className="mt-4 text-ash">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="paper px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow text-paper-ink/60">How a project works</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Shaped around your concept.</h2>
            <p className="mt-6 max-w-sm">{c.consulting_duration_note}</p>
          </div>
          <ol className="divide-y divide-paper-ink/20 border-y border-paper-ink/20">
            {steps.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="eyebrow pt-1 text-paper-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-1">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {clients.length > 0 && (
        <section id="clients" className="px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Selected clients</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Venues we have worked with.</h2>
            <ul className="mt-10 flex flex-wrap gap-3">
              {clients.map((cl) => (
                <li key={cl.id} className="chip">
                  {cl.organization}{cl.location ? ` · ${cl.location}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-graphite px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Why Chef Timmy</p>
            <h2 className="mt-4 text-4xl md:text-5xl">{c.consulting_why_title}</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg text-ash">{c.consulting_why_text}</p>
            <a href="/experience" className="btn btn-ghost mt-8">See full experience</a>
          </div>
        </div>
      </section>

      <section id="inquiry" className="paper px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-paper-ink/60">Start a project</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Tell us about your concept.</h2>
          <p className="mb-10 mt-4 max-w-xl">
            Every project is scoped to your concept. Share a few details and we will come back with a proposal.
          </p>
          <ConsultingForm services={services.map((s) => s.title)} whatsappNumber={c.whatsapp_number} />
        </div>
      </section>
    </>
  );
}
