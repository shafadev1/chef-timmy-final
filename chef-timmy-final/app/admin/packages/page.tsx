"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function PackagesAdmin() {
  return (
    <ResourceManager
      table="packages"
      title="Private Chef Packages"
      description="Packages shown on the Private Chef page. Prices are in Rupiah."
      titleField="name"
      subtitleField="description"
      defaults={{ price_unit: "per guest", is_published: true }}
      fields={[
        { name: "name", label: "Package name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "price_from", label: "Starting price (Rp)", type: "number", placeholder: "1500000", help: "Leave empty to show 'Price on request'." },
        { name: "price_unit", label: "Price unit", type: "text", placeholder: "per guest" },
        { name: "min_guests", label: "Minimum guests", type: "number" },
        { name: "max_guests", label: "Maximum guests", type: "number" },
        { name: "includes", label: "Included (one per line)", type: "lines" },
        { name: "excludes", label: "Not included (one per line)", type: "lines" },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
