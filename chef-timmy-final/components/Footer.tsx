export default function Footer({
  instagram, linkedin, whatsapp,
}: { instagram: string; linkedin: string; whatsapp: string }) {
  const social = [
    { label: "WhatsApp", href: whatsapp },
    { label: "Instagram", href: instagram },
    { label: "LinkedIn", href: linkedin },
  ].filter((l) => l.href && l.href !== "#contact");
  const pages = [
    { label: "Gallery", href: "/gallery" },
    { label: "Downloads", href: "/downloads" },
  ];
  return (
    <footer id="contact" className="border-t border-graphite px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="wordmark text-lg">Timmy Pramudyo</p>
          <p className="eyebrow mt-3">Executive Chef · Bali, Indonesia</p>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {pages.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="eyebrow transition hover:text-bone">{l.label}</a>
            </li>
          ))}
          {social.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="eyebrow transition hover:text-bone">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="eyebrow mx-auto mt-14 max-w-7xl opacity-60">
        © {new Date().getFullYear()} Timmy Pramudyo
      </p>
    </footer>
  );
}
