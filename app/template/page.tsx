import { getContentItems } from "@/lib/content";
import { ContentList } from "@/components/content/ContentList";

export default function TemplatePage() {
  // Change "template" to your content type (e.g., "hobbies")
  const items = getContentItems("template", "date", "desc");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
        Template
      </h1>
      <ContentList 
        items={items} 
        basePath="/template"  // Change to your route
      />
    </div>
  );
}
