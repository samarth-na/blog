# Development Guidelines for AI Agents

## Environment Setup

- Check if server is running if it is **Do not** run `bun dev` or `bun run dev` - a development server is already running if there is no server you can run using `bun dev`
- When you need to check the application, fetch from the running dev server instead
- Use production builds (`bun run build`) to test major changes or verify final output

## Tooling

- **Linting**: Use Biome for all linting (do not use ESLint or Prettier)
- **Package Management**: Always use Bun, never npm
- Adding new dependency? → Use `bun add <package>`
- Removing dependency? → Use `bun remove <package>`
- Unsure about style? → Check existing components in `/components`

## Workflow

1. For quick checks during development, fetch from the existing dev server
2. Run builds only when verifying larger changes or preparing for deployment
3. Run `bun run lint` before committing to catch issues early
4. Run `bun run format` to auto-fix formatting issues

## ⚡ Core Philosophy: Reusable & Configurable Code

- **NO hardcoded values** - All strings, numbers, and configuration MUST come from constants/config files
- **NO monolithic components** - Break everything into small, reusable pieces
- **THINK in components** - Every UI element should be a potential building block
- **CONFIG over code** - If it can be configured, it should be configured

## 🚫 What NOT to Do (Anti-Patterns)

```tsx
// ❌ BAD: Hardcoded everything in one file
export default function Dashboard() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <div style={{ color: '#333' }}>Welcome back, John</div>
      <button style={{ backgroundColor: 'blue' }}>Save</button>
    </div>
  )
}

// ❌ BAD: Magic numbers and strings
if (items.length > 5) { ... } // What is 5? Why 5?
const apiUrl = 'https://api.example.com/v1' // Hardcoded URL

// ❌ BAD: Inline styles everywhere
<div style={{ margin: '20px', padding: '10px' }}>Content</div>

// ❌ BAD: Repeated code
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2">Save</button>
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2">Submit</button>
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2">Update</button>
```

## ✅ What TO Do (Best Practices)

```tsx
// ✅ GOOD: Config-driven with reusable components
// config/dashboard.ts
export const DASHBOARD_CONFIG = {
  title: "User Dashboard",
  welcomeMessage: "Welcome back",
  maxItemsPerPage: 5,
} as const;

// components/ui/Button.tsx
export function Button({ variant = "primary", children, ...props }) {
  return (
    <button className={buttonVariants({ variant })} {...props}>
      {children}
    </button>
  );
}

// app/dashboard/page.tsx
import { DASHBOARD_CONFIG } from "@/config/dashboard";
import { Button } from "@/components/ui/Button";

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>{DASHBOARD_CONFIG.title}</h1>
      <WelcomeMessage message={DASHBOARD_CONFIG.welcomeMessage} user={user} />
      <Button variant="primary">Save</Button>
    </div>
  );
}

// ✅ GOOD: Small, composable components
// components/layout/Container.tsx
export function Container({ children, size = "default" }) {
  return <div className={containerVariants({ size })}>{children}</div>;
}

// ✅ GOOD: Configuration over hardcoding
// data/config.ts
export const LAYOUT_CONFIG = {
  maxWidth: {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
  },
  spacing: {
    section: "space-y-8",
    container: "px-4 sm:px-6 py-8 sm:py-12",
  },
} as const;

// ✅ GOOD: Type-safe constants
const API_ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
  comments: "/api/comments",
} as const;

// ✅ GOOD: Extract repeated patterns into utilities
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 📁 Project Structure

```
/app                  - Next.js app directory (pages & routes)
  /api               - API routes
  /blog              - Blog listing page
  /[category]        - Dynamic category pages
  /thoughts          - Thoughts listing page
  /weeklogs          - Weekly logs page

/components          - React components
  /blog             - Blog-specific components
  /layout           - Layout components (Header, Footer, Container)
  /list             - List & card components
  /mdx              - MDX rendering components
  /theme            - Theme switching components
  /ui               - Reusable UI components

/config             - Configuration files
  fonts.ts          - Font configuration

/content            - MDX content files
  /blogs            - Blog post MDX files

/data               - Data & configuration
  config.ts         - Main site configuration

/lib                - Utility functions & helpers
  blog.ts           - Blog-related utilities
  content.ts        - Content fetching & parsing
  contentConfig.ts  - Content configuration
  frontmatter.ts    - Frontmatter parsing
  fonts.ts          - Font utilities

/public             - Static assets (images, etc.)
```

## 🎨 Styling Conventions

- Use Tailwind CSS classes (Tailwind v4)
- Use `cn()` utility for conditional classes
- Define color schemes in config
- Use CSS variables for theming
- Prefer Tailwind over custom CSS

## 🔧 Configuration Pattern

Every feature should have a config file:

```tsx
// data/config.ts - Main site config
export const LAYOUT_CONFIG = { ... }
export const NAVIGATION_CONFIG = { ... }
export const FOOTER_CONFIG = { ... }

// config/fonts.ts - Font config
export const FONT_CONFIG = { ... }

// lib/contentConfig.ts - Content config
export const CONTENT_CONFIG = { ... }
```

## 📝 Component Guidelines

1. **Keep components small** - Single responsibility
2. **Make them reusable** - Accept props for customization
3. **Use TypeScript** - Proper types for all props
4. **Export types** - Make component types available
5. **Document complex logic** - Add comments for non-obvious code

## 🐛 Debugging

- Use TypeScript compiler (`bun tsc --noEmit`) to catch type errors
- Use Biome (`bun run lint`) to catch code issues
- Check build output (`bun run build`) before deployment
- Use dev server for quick iteration

## 📦 Dependencies

When adding dependencies:

1. Check if functionality already exists in the project
2. Prefer smaller, focused packages over large frameworks
3. Verify the package is actively maintained
4. Consider bundle size impact
5. Use `bun add <package>` to install

## 🚀 Performance

- Use Next.js Image component for images
- Implement proper lazy loading
- Keep bundle size small
- Use static generation where possible
- Cache appropriately

## ✅ Before Committing

1. Run `bun run lint` - Check for code issues
2. Run `bun run format` - Auto-fix formatting
3. Run `bun tsc --noEmit` - Check TypeScript errors
4. Run `bun run build` - Verify production build works
5. Test in dev server - Ensure functionality works

## 🔑 Key Principles

1. **DRY** - Don't Repeat Yourself
2. **KISS** - Keep It Simple, Stupid
3. **YAGNI** - You Aren't Gonna Need It (yet)
4. **Composition over Inheritance** - Build with small pieces
5. **Configuration over Code** - Make it configurable

---
