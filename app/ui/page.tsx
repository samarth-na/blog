import { Container } from "../../components/layout/Container";
import { BlogArticleView } from "../../components/content/ArticleView";
import { BlogPostList } from "../../components/content/PostList";
import { BlogAboutSection } from "../../components/content/AboutSection";
import { BlogNewsletterSignup } from "../../components/interactive/NewsletterSignup";
import { BlogSocialLinks } from "../../components/interactive/SocialLinks";
import { BlogCategories } from "../../components/interactive/Categories";
import { BlogTags } from "../../components/interactive/Tags";
import { BlogPagination } from "../../components/interactive/Pagination";
import {
  MOCK_POSTS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_ARTICLE_CONTENT,
  MOCK_BIO,
} from "../../data/mocks";

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
              content={MOCK_ARTICLE_CONTENT}
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
            <BlogCategories categories={MOCK_CATEGORIES} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">tags</p>
            <BlogTags tags={MOCK_TAGS} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">pagination</p>
            <BlogPagination currentPage={1} totalPages={5} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">post list</p>
            <BlogPostList posts={MOCK_POSTS} />
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">about section</p>
            <BlogAboutSection bio={MOCK_BIO} />
          </section>
        </main>
      </Container>
    </div>
  );
}
