# Alex Dev Blog

A minimal, text-only developer blog built with Next.js.

## Design System

### Theme

- **Soft Pop** theme from tweakcn
- Clean, minimal aesthetic with small fonts and line borders
- No images, cards, or fancy UI elements
- Focus on typography and content

### Design Principles

- Text-only design with line borders connecting elements
- Small fonts (text-xs, text-sm)
- Consistent side margins
- Monospace for dates and code

### Colors

- Primary: Purple (#7866d1)
- Secondary: Teal (#6ccac4)
- Accent: Yellow (#f5d565)
- Background: Light gray (#f8f7f4)
- Dark mode supported

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

### Commands

```bash
# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint
bun run lint
```

## Content

### Adding Articles

Create markdown files in `content/articles/` with frontmatter:

```markdown
---
title: "Article Title"
date: "2026-02-12"
category: "development"
excerpt: "Brief description"
---

Your content here...
```

### Adding Projects

Create markdown files in `content/projects/` with frontmatter:

```markdown
---
title: "Project Name"
date: "2026-02-12"
tech: ["Next.js", "TypeScript"]
link: "https://..."
---

Project description...
```

## Features

- [x] Minimal text-only design
- [x] Soft pop theme
- [x] Dark mode support
- [x] Responsive layout
- [ ] RSS feed
- [ ] Search
- [ ] Categories/Tags

## License

MIT
