import { getSiteContent, getStats, getGallery, whatsappLink } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [c, stats, gallery] = await Promise.all([getSiteContent(), getStats(), getGallery(6)]);
  const wa = whatsappLink(c);
  const expertise = c.core_expertise.split("|").filter(Boolean);

  return (
    <>
      {/* HERO: foto monokrom, warna hanya dari hidangan */}
      <section
        className="relative flex min-h-screen items-end bg-ink bg-cover bg-top"
        style={{ backgroundImage: `url('${c.hero_image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40">
          <p className="eyebrow rise">{c.hero_role}</p>
          <h1 className="hero-name rise rise-2 mt-5 text-4xl md:text-6xl lg:text-7xl">{c.hero_title}</h1>
          <hr className="rule rise rise-2 mt-8 max-w-xl text-bone" />
          <p className="subtitle rise rise-3 mt-6 max-w-xl text-2xl md:text-3xl">{c.hero_tagline}</p>
          <div className="rise rise-3 mt-10 flex flex-wrap gap-4">
            <a href="/private-chef" className="btn btn-light">Book A Private Chef</a>
            {(c.cv_url || c.autobiography_url) && (
              <a href="/downloads" className="btn btn-ghost">CV &amp; Autobiography</a>
            )}
          </div>
        </div>
      </section>

      {/* ANGKA PENCAPAIAN */}
      <section className="border-y border-graphite">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <li key={i} className="border-graphite px-6 py-12 md:border-l md:first:border-l-0">
              <p className="text-5xl font-bold">{s.value}</p>
              <p className="eyebrow mt-3">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* STORY: panel hitam-putih + panel terang bergaya editorial */}
      <section id="story" className="grid md:grid-cols-2">
        <div
          className="photo-bw min-h-[28rem] bg-charcoal bg-cover bg-center"
          style={c.story_image ? { backgroundImage: `url('${c.story_image}')` } : undefined}
        />
        <div className="paper flex flex-col justify-center px-8 py-20 md:px-16">
          <p className="eyebrow text-paper-ink/60">The Making of a Chef</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{c.story_title}</h2>
          <p className="mt-6 max-w-lg">{c.story_body}</p>
          <blockquote className="subtitle mt-10 max-w-md border-t border-paper-ink/30 pt-6 text-2xl">
            “{c.story_quote}”
            <footer className="eyebrow mt-3 text-paper-ink/60">Chef Timmy Pramudyo</footer>
          </blockquote>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="experience" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 max-w-3xl text-4xl md:text-5xl">From the pass to the boardroom.</h2>
          <p className="mt-6 max-w-2xl text-ash">{c.profile_text}</p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {expertise.map((e) => (
              <li key={e} className="chip">{e}</li>
            ))}
          </ul>
          <a href="/experience" className="btn btn-ghost mt-10">Full Experience</a>
        </div>
      </section>

      {/* BEYOND THE PLATE: satu blok kecil */}
      <section id="beyond-the-plate" className="border-t border-graphite px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          {c.btp_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.btp_image} alt={c.btp_title} className="photo-bw aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="aspect-[4/3] w-full bg-charcoal" />
          )}
          <div>
            <p className="eyebrow">Off the line</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{c.btp_title}</h2>
            <p className="mt-4 text-ash">{c.btp_body}</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
           <section id="gallery" className="border-t border-graphite px-6 py-28">
  <div className="mx-auto max-w-7xl">
    <p className="eyebrow">Gallery</p>
    <h2 className="mt-4 text-4xl md:text-5xl">The only color is on the plate.</h2>
    <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
      {gallery.length > 0
        ? gallery.map((g) => (
            <div key={g.id} className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image_url} alt={g.title ?? "Dish"} className="photo-food h-full w-full object-contain" />
            </div>
          ))
        : Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="eyebrow flex aspect-[4/5] items-center justify-center border border-graphite">
              Photo {i + 1}
            </div>
          ))}
    </div>
    <div className="mt-12 text-center">
      <a href="/gallery" className="btn btn-ghost">View all photos</a>
    </div>
  </div>
</section>

      {/* PRIVATE CHEF */}
      <section id="private-chef" className="paper px-6 py-28 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-paper-ink/60">Private Chef</p>
          <h2 className="mt-4 text-4xl md:text-6xl">An evening, cooked for you.</h2>
          <p className="mx-auto mt-6 max-w-xl">
            Intimate dinners, tasting menus and private events, designed around your guests and prepared at your table.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/private-chef" className="btn btn-dark">View Packages</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">Enquire on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* CONSULTING */}
      <section className="border-t border-graphite px-6 py-28 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">F&amp;B Consulting</p>
          <h2 className="mt-4 text-4xl md:text-6xl">Opening a hotel, restaurant, cafe or catering business?</h2>
          <p className="mx-auto mt-6 max-w-xl text-ash">
            Concept, menu, team and systems, built with you over three to six months.
          </p>
          <a href="/consulting" className="btn btn-light mt-10">Explore Consulting</a>
        </div>
      </section>
    </>
  );
}
