import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { getContentItem } from "@/lib/content";
import { getContentFileList } from "@/lib/contentConfig";

async function getInterest(
  slug: string,
): Promise<{ slug: string; content: string; title: string } | null> {
  const interest = await getContentItem("interests", slug);

  if (!interest) {
    return null;
  }

  return {
    slug,
    title: Array.isArray(interest.title) ? interest.title[0] : interest.title || slug,
    content: interest.content,
  };
}

export async function generateStaticParams() {
  const slugs = await getContentFileList("interests");
  return slugs.map((slug) => ({ slug }));
}

export default async function InterestPage({ params }: { params: Promise<{ slug: string }> }) {
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
          className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
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
