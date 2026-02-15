import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { fetchContent } from "@/lib/contentConfig";

async function getBookmark(slug: string): Promise<{ slug: string; content: string; title: string; image?: string } | null> {
  const fileContent = await fetchContent("bookmarks", slug);
  
  if (!fileContent) {
    return null;
  }
  
  const titleMatch = fileContent.match(/^title:\s*([^\n]+)/m);
  const imageMatch = fileContent.match(/^image:\s*([^\n]+)/m);
  
  const title = titleMatch ? titleMatch[1].trim() : slug;
  const image = imageMatch ? imageMatch[1].trim() : undefined;
  
  const bodyContent = fileContent.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    title,
    image,
    content: bodyContent,
  };
}

export default async function BookmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bookmark = await getBookmark(slug);

  if (!bookmark) {
    notFound();
  }

  return (
    <article>
      <div className="mb-4">
        <Link 
          href="/bookmarks" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← back to bookmarks
        </Link>
      </div>
      
      {bookmark.image && (
        <div className="aspect-video overflow-hidden bg-muted mb-6">
          <Image
            src={bookmark.image}
            alt={bookmark.title}
            width={800}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <MDXRemote
        source={bookmark.content}
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
