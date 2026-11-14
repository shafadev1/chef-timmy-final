"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function FaqAdmin() {
  return (
    <ResourceManager
      table="faqs"
      title="FAQ"
      description="Questions shown on the Private Chef page. Answers that still say 'Edit this answer' stay hidden until you replace them."
      titleField="question"
      subtitleField="answer"
      defaults={{ is_published: true }}
      fields={[
        { name: "question", label: "Question", type: "text", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "is_published", label: "Visible on website", type: "checkbox" },
      ]}
    />
  );
}
