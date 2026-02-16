# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js App Router project with PostHog analytics. The integration includes automatic pageview tracking, session replay, error tracking, and custom event capture for key user interactions across the blog.

## Integration Summary

- **PostHog Client Initialization**: Configured in `instrumentation-client.ts` using the Next.js 15.3+ recommended approach with environment variables
- **Error Tracking**: Enabled automatic exception capture via `capture_exceptions: true`
- **Environment Variables**: Set up `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local` and `.env`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `theme_toggled` | User toggled between light and dark theme | `components/theme/ThemeToggle.tsx` |
| `newsletter_signup_submitted` | User submitted the newsletter signup form | `components/interactive/NewsletterSignup.tsx` |
| `bookmark_search_used` | User searched bookmarks with a query | `components/bookmarks/BookmarkList.tsx` |
| `bookmark_tag_toggled` | User toggled a tag filter on bookmarks | `components/bookmarks/BookmarkList.tsx` |
| `bookmark_clicked` | User clicked on a bookmark to view details | `components/bookmarks/BookmarkList.tsx` |
| `social_link_clicked` | User clicked a social link in the footer | `components/layout/Footer.tsx` |
| `navigation_clicked` | User clicked a navigation link in the header | `components/layout/Header.tsx` |
| `interest_clicked` | User clicked on an interest to view details | `components/interests/InterestList.tsx` |
| `back_to_blog_clicked` | User clicked the back to blogs link from a blog post | `components/blog/BackToBlogLink.tsx` |
| `blog_search_used` | User searched blog posts (pre-existing) | `components/blog/BlogList.tsx` |
| `blog_tag_toggled` | User toggled a tag filter on blog (pre-existing) | `components/blog/BlogList.tsx` |
| `blog_view_mode_changed` | User switched blog view mode (pre-existing) | `components/blog/BlogList.tsx` |
| `blog_post_clicked` | User clicked a blog post (pre-existing) | `components/blog/BlogList.tsx` |

## New Files Created

- `components/interests/InterestList.tsx` - Client component for interest list with click tracking
- `components/blog/BackToBlogLink.tsx` - Client component for back navigation with click tracking

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/101355/dashboard/1281187) - Your main analytics dashboard

### Insights
- [Content Engagement Trend](https://us.posthog.com/project/101355/insights/63ogeY2u) - Tracks clicks on blog posts, bookmarks, and interests over time
- [Search Usage](https://us.posthog.com/project/101355/insights/sAvWYuUY) - Tracks search activity across blog and bookmarks
- [Theme Preference Distribution](https://us.posthog.com/project/101355/insights/lrEoSg5c) - Tracks light vs dark theme preferences
- [Tag Filtering Activity](https://us.posthog.com/project/101355/insights/3acGVfPI) - Tracks tag filtering usage in blog and bookmarks
- [Social Outbound Clicks](https://us.posthog.com/project/101355/insights/3Uw21Q3m) - Tracks clicks on social links in the footer

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
