"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function ConsultingStepsAdmin() {
  return (
    <ResourceManager
      table="consulting_steps"
      title="Consulting Process"
      description="The stages under 'How a project works'. Use the arrows to change the order."
      titleField="title"
      subtitleField="description"
      defaults={{ is_published: true }}
      fields={[
        { name: "title", label: "Stage name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
