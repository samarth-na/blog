# Alex Dev Blog

A minimal, text-only developer blog built with Next.js.

## Design System

### Theme

- **Teal accent** color scheme (teal-600 light, teal-500 dark)
- Clean, minimal aesthetic with small fonts and line borders
- No images, cards, or fancy UI elements
- Focus on typography and content

### Design Principles

- Text-only design with line borders connecting elements
- Small fonts (text-xs, text-sm)
- Consistent side margins
- Monospace for dates and code

## Pages

1. home page
    - summary of myself
    - aim/goals
    - list of fav blogs
    - bookmarks
    - footer
2. projects
3. prject page
4. articles list
    - weeklogs
    - thoughts
    - critical
    - review
5. article page
6. my story
    - story of mine
7. Contact
    - twitter/linkedin/email
8. Uses/Tools
    - nvim
    - fedora
    - ts/next
    - etc......
9. Now
    - devops,backend
10. Archive
    - unfiltered collection of all articles
11. Snippets
    - idk
12. Bookmarks
    - books
    - movies
    - shows
13. 404

## Development

### Layouts Reference

Reference layouts available at:

- `/ui`

### Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- TypeScript
- MDX for blog posts

### Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## Content

### Adding Blog Posts

Create MDX files in `content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
date: "2024-01-01"
tags: [tag1, tag2, tag3]
excerpt: "Brief description of the post"
---

Your content here...
```

## Features

- [x] Minimal text-only design
- [x] Teal accent color scheme
- [x] Dark mode support with toggle
- [x] Responsive layout
- [x] MDX blog posts with syntax highlighting
- [x] Blog search and tag filtering
- [x] Automatic read time calculation
- [ ] RSS feed

## License

MIT
