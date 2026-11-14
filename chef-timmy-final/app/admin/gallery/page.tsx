"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function GalleryAdmin() {
  return (
    <ResourceManager
      table="gallery_items"
      title="Gallery"
      description="All food photos live here and appear on the Gallery page. Use the star to choose which 6 appear on the home page. Use 'Upload photos' to add many at once."
      titleField="title"
      subtitleField="category"
      thumbField="image_url"
      addLabel="Add one photo"
      defaults={{ category: "Main Course", is_published: true, is_signature: false, is_featured: false }}
      flagField={{ name: "is_featured", label: "home page", max: 6 }}
      bulkImage={{ field: "image_url", folder: "gallery" }}
      fields={[
        { name: "image_url", label: "Photo", type: "image", required: true },
        { name: "title", label: "Dish name", type: "text" },
        { name: "category", label: "Category", type: "select", options: ["Appetizer", "Main Course", "Dessert", "Behind the Kitchen"] },
        { name: "story", label: "Story behind the dish", type: "textarea", help: "2 to 4 sentences. Shown for signature dishes." },
        { name: "is_signature", label: "Signature dish", type: "checkbox" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
