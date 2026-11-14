"use client";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/content";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);
  const current = active !== null ? shown[active] : null;

  useEffect(() => {
    if (active === null) return;
    const total = shown.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a === null ? a : (a + 1) % total));
      if (e.key === "ArrowLeft") setActive((a) => (a === null ? a : (a - 1 + total) % total));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, shown.length]);

  function pick(c: string) {
    setFilter(c);
    setActive(null);
  }

  return (
    <>
      {categories.length > 2 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => pick(c)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition ${
                filter === c ? "bg-bone text-ink" : "border border-graphite text-ash hover:text-bone"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3">
        {shown.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setActive(i)}
            aria-label={`Open ${g.title ?? "photo"}`}
            className="flex aspect-[4/5] cursor-zoom-in items-center justify-center overflow-hidden bg-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image_url} alt={g.title ?? "Dish"} loading="lazy" className="photo-food h-full w-full object-contain" />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Close"
            onClick={() => setActive(null)}
            className="eyebrow absolute right-5 top-5 px-3 py-2 text-bone"
          >
            Close ✕
          </button>
          {shown.length > 1 && (
            <>
              <button
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); setActive((active! - 1 + shown.length) % shown.length); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-6 text-3xl text-bone md:left-6"
              >
                ‹
              </button>
              <button
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); setActive((active! + 1) % shown.length); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-6 text-3xl text-bone md:right-6"
              >
                ›
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image_url}
            alt={current.title ?? "Dish"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-full object-contain"
          />
          {(current.title || current.story) && (
            <div className="mt-5 max-w-xl text-center" onClick={(e) => e.stopPropagation()}>
              {current.title && <p className="text-sm tracking-wide">{current.title}</p>}
              {current.story && <p className="mt-2 text-sm text-ash">{current.story}</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
