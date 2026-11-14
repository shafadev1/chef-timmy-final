"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function MenusAdmin() {
  return (
    <ResourceManager
      table="sample_menus"
      title="Sample Menus"
      description="Example tasting menus shown on the Private Chef page."
      titleField="name"
      subtitleField="description"
      defaults={{ is_published: true }}
      fields={[
        { name: "name", label: "Menu name", type: "text", required: true, placeholder: "Four-Course Tasting Menu" },
        { name: "description", label: "Short description", type: "textarea" },
        {
          name: "courses",
          label: "Courses (one per line)",
          type: "courses",
          placeholder: "Starter | Dish name | Short note",
          help: "Format: Course | Dish | Note. The note is optional.",
        },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
