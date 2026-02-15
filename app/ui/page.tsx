import { Container } from "../../components/layout/Container";
import { BlogArticleView } from "../../components/content/ArticleView";
import { BlogPostList, type PostItem } from "../../components/content/PostList";
import { BlogAboutSection } from "../../components/content/AboutSection";
import { BlogNewsletterSignup } from "../../components/interactive/NewsletterSignup";
import { BlogSocialLinks } from "../../components/interactive/SocialLinks";
import { BlogCategories } from "../../components/interactive/Categories";
import { BlogTags } from "../../components/interactive/Tags";
import { BlogPagination } from "../../components/interactive/Pagination";

const POSTS: PostItem[] = [
  { id: 1, title: "sample post one", date: "feb 12, 2026", words: 500 },
  { id: 2, title: "sample post two", date: "feb 10, 2026", words: 750 },
  { id: 3, title: "sample post three", date: "feb 8, 2026", words: 600 },
];

const CATEGORIES = [
  "development",
  "design",
  "tutorial",
  "thoughts",
  "personal",
];
const TAGS = ["javascript", "typescript", "react", "css", "design"];

export default function UiPage() {
  return (
    <div className="">
      <Container>
        <main className="space-y-16">
          <section>
            <p className="text-xs text-muted-foreground mb-6">article view</p>
            <BlogArticleView
              title="how to build a blog with next.js"
              date="feb 12, 2026"
              category="development"
              readTime="5 min read"
              content={[
                "This is the body of a blog post. It contains multiple paragraphs of text that explain the content.",
                "The text should be readable and well-structured. Each paragraph adds value to the reader.",
              ]}
            />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">
              newsletter signup
            </p>
            <BlogNewsletterSignup />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">social links</p>
            <BlogSocialLinks />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">categories</p>
            <BlogCategories categories={CATEGORIES} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">tags</p>
            <BlogTags tags={TAGS} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">pagination</p>
            <BlogPagination currentPage={1} totalPages={5} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">post list</p>
            <BlogPostList posts={POSTS} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">about section</p>
            <BlogAboutSection bio="developer based in sf. i build things and write about code, design, and everything in between." />
          </section>
        </main>
      </Container>
    </div>
  );
}
