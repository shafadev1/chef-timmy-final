"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function ExperienceAdmin() {
  return (
    <ResourceManager
      table="experiences"
      title="Experience"
      description="Career, ventures, consulting and partnerships shown on the Experience page. Use the arrows to reorder inside the same group."
      titleField="organization"
      subtitleField="role"
      defaults={{ category: "employment", is_published: true }}
      fields={[
        { name: "organization", label: "Organization", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true },
        { name: "location", label: "Location", type: "text" },
        { name: "period", label: "Year / period", type: "text", placeholder: "2019 or 2019 - 2022" },
        { name: "category", label: "Group", type: "select", options: ["employment", "venture", "consulting", "partnership"], help: "employment = Career, venture = Ventures Founded" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
