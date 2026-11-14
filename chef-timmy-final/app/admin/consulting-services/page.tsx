"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function ConsultingServicesAdmin() {
  return (
    <ResourceManager
      table="consulting_services"
      title="Consulting Services"
      description="The cards under 'What you get' on the Consulting page. These also appear as checkboxes in the enquiry form."
      titleField="title"
      subtitleField="description"
      defaults={{ is_published: true }}
      fields={[
        { name: "title", label: "Service name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
