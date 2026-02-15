import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { contentConfig } from "@/lib/contentConfig";

async function getInterest(slug: string): Promise<{ slug: string; content: string; title: string } | null> {
  const url = `${contentConfig.baseUrl}/interests/${slug}.mdx`;
  const response = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return null;
  }

  const content = await response.text();
  
  const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
  const title = titleMatch ? titleMatch[1] : slug;
  
  const bodyContent = content.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    title,
    content: bodyContent,
  };
}

export default async function InterestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interest = await getInterest(slug);

  if (!interest) {
    notFound();
  }

  return (
    <article>
      <div className="mb-4">
        <Link 
          href="/interests" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← back to interests
        </Link>
      </div>
      <MDXRemote
        source={interest.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}
