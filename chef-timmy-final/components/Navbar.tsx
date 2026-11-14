"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#story", label: "Story" },
  { href: "/experience", label: "Experience" },
  { href: "/gallery", label: "Gallery" },
  { href: "/private-chef", label: "Private Chef" },
  { href: "/consulting", label: "Consulting" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-ink/90 to-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="wordmark text-sm md:text-base">Timmy Pramudyo</Link>
        <ul className="hidden gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="eyebrow transition hover:text-bone">{l.label}</a>
            </li>
          ))}
        </ul>
        <button
          aria-label="Menu"
          className="eyebrow md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open && (
        <ul className="bg-ink px-6 pb-8 md:hidden">
          {links.map((l) => (
            <li key={l.href} className="border-t border-graphite py-4">
              <a href={l.href} onClick={() => setOpen(false)} className="eyebrow">{l.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
