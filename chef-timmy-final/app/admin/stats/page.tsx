"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function StatsAdmin() {
  return (
    <ResourceManager
      table="stats"
      title="Highlights"
      description="The numbers strip on the home page (for example '200+' with 'Team members led')."
      titleField="value"
      subtitleField="label"
      defaults={{ is_published: true }}
      fields={[
        { name: "value", label: "Number", type: "text", required: true, placeholder: "200+" },
        { name: "label", label: "Label", type: "text", required: true, placeholder: "Team members led" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
