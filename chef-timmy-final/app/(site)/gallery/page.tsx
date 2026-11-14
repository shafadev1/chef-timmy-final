import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { getAllGallery } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gallery | Timmy Pramudyo",
  description: "A gallery of dishes by Chef Timmy Pramudyo.",
};

export default async function GalleryPage() {
  const items = await getAllGallery();
  return (
    <section className="px-6 pb-28 pt-40">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-5 max-w-4xl text-4xl uppercase md:text-6xl">The only color is on the plate.</h1>
        <hr className="rule mt-8 max-w-xl text-bone" />
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <p className="mt-12 text-ash">Photos will appear here soon.</p>
        )}
      </div>
    </section>
  );
}
