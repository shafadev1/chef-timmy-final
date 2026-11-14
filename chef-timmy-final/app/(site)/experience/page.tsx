import type { Metadata } from "next";
import { getSiteContent, getExperiences, type Experience } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Experience | Timmy Pramudyo",
  description: "Career, ventures, consulting and partnerships of Chef Timmy Pramudyo.",
};

const groups: { key: Experience["category"]; title: string }[] = [
  { key: "employment", title: "Career" },
  { key: "venture", title: "Ventures Founded" },
  { key: "consulting", title: "Consulting" },
  { key: "partnership", title: "Partnerships & Special Projects" },
];

export default async function ExperiencePage() {
  const [c, items] = await Promise.all([getSiteContent(), getExperiences()]);
  const focus = (c.professional_focus ?? "").split("|").filter(Boolean);

  return (
    <>
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Experience</p>
          <h1 className="mt-5 max-w-4xl text-5xl uppercase md:text-7xl">From the pass to the boardroom.</h1>
          <hr className="rule mt-8 max-w-xl text-bone" />
          <p className="mt-6 max-w-2xl text-ash">{c.profile_text}</p>
          {(c.cv_url || c.autobiography_url) && (
            <a href="/downloads" className="btn btn-ghost mt-8">CV &amp; Autobiography</a>
          )}
          {focus.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {focus.map((f) => <li key={f} className="chip">{f}</li>)}
            </ul>
          )}
        </div>
      </section>

      {groups.map((g) => {
        const rows = items.filter((i) => i.category === g.key);
        if (rows.length === 0) return null;
        return (
          <section key={g.key} className="border-t border-graphite px-6 py-16">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_2.2fr]">
              <h2 className="text-3xl">{g.title}</h2>
              <ul className="divide-y divide-graphite border-y border-graphite">
                {rows.map((r) => (
                  <li key={r.id} className="flex items-baseline justify-between gap-6 py-4">
                    <div>
                      <p className="text-lg">{r.organization}</p>
                      <p className="text-sm text-ash">
                        {r.role}{r.location ? ` · ${r.location}` : ""}
                      </p>
                    </div>
                    {r.period && <p className="eyebrow shrink-0">{r.period}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
      {items.length === 0 && (
        <section className="border-t border-graphite px-6 py-16">
          <p className="eyebrow mx-auto max-w-7xl">Experience entries will appear here.</p>
        </section>
      )}
    </>
  );
}
