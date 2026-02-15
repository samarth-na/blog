import { getContentItems } from "@/lib/content";
import { ContentList } from "@/components/content/ContentList";

export default async function TemplatePage() {
  const items = await getContentItems("template", "date", "desc");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium font-serif">
        Template
      </h1>
      <ContentList 
        items={items} 
        basePath="/template"
      />
    </div>
  );
}
