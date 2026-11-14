import type { Metadata } from "next";
import { getSiteContent, downloadUrl } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Downloads | Timmy Pramudyo",
  description: "View or download the CV and autobiography of Chef Timmy Pramudyo.",
};

export default async function DownloadsPage() {
  const c = await getSiteContent();
  const docs = [
    {
      label: "Document 01",
      title: "Curriculum Vitae",
      text: "Career, ventures and consulting work of Chef Timmy, from hotel kitchens to corporate culinary leadership.",
      url: c.cv_url,
      file: "Timmy-Pramudyo-CV.pdf",
    },
    {
      label: "Document 02",
      title: "Autobiography",
      text: "Beyond the Kitchen: The Making of Chef Timmy Pramudyo. A personal journey through food, passion and purpose.",
      url: c.autobiography_url,
      file: "Timmy-Pramudyo-Beyond-the-Kitchen.pdf",
    },
  ];

  return (
    <section className="px-6 pb-28 pt-40">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Downloads</p>
        <h1 className="mt-5 max-w-4xl text-4xl uppercase md:text-6xl">CV &amp; Autobiography</h1>
        <hr className="rule mt-8 max-w-xl text-bone" />
        <p className="mt-6 max-w-2xl text-ash">Read them here in your browser, or save a copy as PDF.</p>

        <div className="mt-14 grid gap-px bg-graphite md:grid-cols-2">
          {docs.map((d) => (
            <article key={d.title} className="flex flex-col bg-ink p-8 md:p-10">
              <p className="eyebrow">{d.label}</p>
              <h2 className="mt-4 text-3xl">{d.title}</h2>
              <p className="mt-4 flex-1 text-ash">{d.text}</p>
              {d.url ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-light">View</a>
                  <a href={downloadUrl(d.url, d.file)} className="btn btn-ghost">Download PDF</a>
                </div>
              ) : (
                <p className="eyebrow mt-8">Coming soon</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
