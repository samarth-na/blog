# Performance Optimization Plan

## Executive Summary

This document outlines a comprehensive performance optimization strategy for the Next.js 16 blog. The goal is to improve Core Web Vitals (LCP, INP, CLS), reduce bundle size, and enhance the user experience.

## Current State Analysis

- **Framework**: Next.js 16.1.6 (App Router, React 19.2.3)
- **Rendering**: SSG (via `generateStaticParams`) + ISR (1 hour revalidation)
- **Styling**: Tailwind CSS v4
- **Content**: MDX from GitHub repository
- **Analytics**: PostHog (via `instrumentation-client.ts`) + Vercel SpeedInsights
- **Fonts**: Google Fonts (3 families, 4 weights each) — config defaults to `"local"` but falls back to Google since `.woff2` files are missing
- **Theme**: Custom ThemeProvider (not `next-themes`)
- **Rich Text**: 15 `@tiptap/*` packages (editor suite)

---

## Key Findings & Priorities

### 1. Font Optimization (High Priority)

**Problem**: Loading 3 separate Google Fonts (Instrument Sans, Cormorant Garamond, IBM Plex Mono) with 4 weights each increases initial payload and can block text rendering.

**Impact**:
- Larger initial CSS/font payload (12 font files from external origin)
- Potential layout shift when fonts load and swap in
- External dependency on Google Fonts CDN
- LCP delays due to font loading

**Current State**:
- `lib/fonts.google.ts` loads fonts from Google Fonts with `display: "swap"`
- `config/fonts.ts` defines local font paths, and `FONT_SOURCE` defaults to `"local"` (the env-var check only sets `"google"` when explicitly `FONT_SOURCE=google`)
- `lib/fonts.ts` detects missing `.woff2` files and falls back to Google fonts regardless of config
- No `preload` is set on any font; no fallback font metric overrides exist

---

### 2. PostHog Bundle Impact (High Priority)

**Problem**: `posthog-js` (~40kb gzipped) is statically imported in **8 locations** across the client bundle. While PostHog is initialized once in `instrumentation-client.ts` (the Next.js 15+ recommended pattern), every component that imports it still pulls the module into its chunk.

**Affected files** (static `import posthog from "posthog-js"`):

| File | Event(s) captured |
|------|-------------------|
| `instrumentation-client.ts` | Initialization |
| `components/layout/Header.tsx` | `navigation_clicked` |
| `components/layout/Footer.tsx` | Footer interactions |
| `components/list/CardList.tsx` | `card_list_search_used`, `card_list_tag_toggled`, `card_list_item_clicked` |
| `components/list/List.tsx` | List interactions |
| `components/blog/TypeTabs.tsx` | Tab switches |
| `components/blog/BackToBlogLink.tsx` | Back-link clicks |
| `components/theme/ThemeToggle.tsx` | Theme toggle |

**Impact**:
- Multiple chunks include `posthog-js` references, increasing total JS payload
- Static imports mean the module is parsed even before any interaction
- Increased TTI and INP from main-thread script parsing

---

### 3. CSS Transition Performance (Medium Priority)

**Problem**: `app/globals.css:442-454` applies `transition: background-color 0.4s, color 0.4s, border-color 0.4s` using **wildcard attribute selectors** (`[class*="bg-"]`, `[class*="text-"]`, `[class*="border-"]`).

**Impact**:
- Wildcard attribute selectors are expensive for the browser's selector-matching engine
- These transitions fire on **every matching element** during theme changes, causing significant main-thread work
- Can degrade INP if a theme toggle triggers hundreds of simultaneous transitions
- Also applies transitions to elements that never change color, wasting compositor resources

---

### 4. SpeedInsights Loading (Medium Priority)

**Problem**: `@vercel/speed-insights` is statically imported in `app/layout.tsx` (line 1). It loads synchronously and adds to the critical bundle.

**Impact**:
- Adds to initial JS payload on every page
- Not needed for first paint or interactivity

---

### 5. Content Caching Strategy (Medium Priority)

**Problem**: Content is fetched from GitHub with 1-hour revalidation (`REMOTE_REVALIDATE_SECONDS = 3600`). Basic `!response.ok` error handling exists but no `try/catch` for network failures.

**Impact**:
- GitHub API rate limits could cause silent failures
- Network errors (DNS, timeout) would throw unhandled exceptions
- Blog content that rarely changes doesn't need hourly revalidation

---

### 6. CLS (Cumulative Layout Shift) Issues

| Issue | Location | Impact |
|-------|----------|--------|
| Font fallback mismatch | `lib/fonts.google.ts` | `display: "swap"` causes text reflow when custom font loads |
| No explicit image dimensions | `CardList.tsx:208-213` | Uses `fill` without container dimensions in all cases |
| Page load animations | `app/page.tsx:5` | `animate-fade-in-down` shifts content during animation |

---

### 7. INP (Interaction to Next Paint) Issues

| Issue | Location | Impact |
|-------|----------|--------|
| PostHog in 7 components | Multiple client components | Static imports add parsing work on main thread |
| `clip-path` animation | `app/globals.css:409-418` | `clip-path` is not GPU-accelerated; causes layout/paint work |
| Wildcard CSS transitions | `app/globals.css:442-454` | Theme toggle triggers transitions on all matched elements |
| Custom ThemeProvider hydration | `components/theme/ThemeProvider.tsx` | Client-side DOM manipulation (`classList.toggle`) on mount |

---

### 8. Bundle Size — @tiptap Suite (Low Priority)

**Problem**: 15 `@tiptap/*` packages are listed in `package.json`. If any pages import the editor, these contribute significantly to bundle size.

**Impact**:
- Potentially large chunk for any route using the editor
- Should be code-split / dynamically imported if only used on specific pages

---

### 9. CSS Bundle Size (Low Priority)

**Problem**: Multiple CSS imports (`tw-animate-css`, `shadcn/tailwind.css`) may include unused styles.

**Impact**:
- Larger CSS bundle
- Potential unused styles in production

---

## Implementation Plan

### Phase 1: Font Optimization (HIGH PRIORITY)

#### Step 1.1: Change Font Display Strategy

**File**: `lib/fonts.google.ts`

Change `display: "swap"` to `display: "optional"` to prevent layout shift. The browser will use the custom font only if it's already cached; otherwise it sticks with the fallback — eliminating CLS from font swapping.

```typescript
// Before
display: "swap"

// After
display: "optional"
```

Apply to all three font declarations (sans, serif, mono).

#### Step 1.2: Add Font Preload for LCP Font

**File**: `lib/fonts.google.ts`

Add `preload: true` to the serif font (Cormorant Garamond), which is likely used in the LCP heading element:

```typescript
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-serif",
  display: "optional",
  preload: true,
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});
```

#### Step 1.3: Font Metric Overrides (CLS Fix)

**File**: `app/globals.css`

Add adjusted fallback font-face declarations so that fallback fonts match the custom fonts' metrics, preventing text reflow:

```css
@font-face {
  font-family: 'Fallback Sans';
  src: local('Arial');
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

@font-face {
  font-family: 'Fallback Serif';
  src: local('Times New Roman');
  size-adjust: 100%;
  ascent-override: 80%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

> Note: The exact override values should be fine-tuned using a tool like [Fontaine](https://github.com/unjs/fontaine) or the Chrome DevTools font rendering panel.

#### Step 1.4: Download Local Font Files

The local font paths are fully defined in `config/fonts.ts` but the actual `.woff2` files are missing. Download them:

```bash
mkdir -p assets/fonts/instrument-sans
mkdir -p assets/fonts/cormorant-garamond
mkdir -p assets/fonts/ibm-plex-mono

# Use google-webfonts-helper or fontsource to download .woff2 files
# Place them at the paths defined in config/fonts.ts
```

#### Step 1.5: Create Local Font Loader

**File**: `lib/fonts.local.ts` (new file)

```typescript
import localFont from "next/font/local";

const sans = localFont({
  src: [
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-app-sans",
  display: "optional",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const serif = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-app-serif",
  display: "optional",
  preload: true,
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});

const mono = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-app-mono",
  display: "optional",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
```

#### Step 1.6: Update Font Loader to Support Local Fonts

**File**: `lib/fonts.ts`

Replace the current fallback logic with a proper dynamic import pattern:

```typescript
import { FONT_SOURCE } from "@/config/fonts";

// Use dynamic require based on font source
// Note: top-level conditional exports are not valid JS,
// so we use a lazy evaluation pattern instead.
let _fontVariables: string;

export function getFontVariables(): string {
  if (_fontVariables) return _fontVariables;

  if (FONT_SOURCE === "local") {
    try {
      const localFonts = require("./fonts.local");
      _fontVariables = localFonts.fontVariables;
    } catch {
      console.warn("Local font files not found, falling back to Google Fonts");
      const googleFonts = require("./fonts.google");
      _fontVariables = googleFonts.fontVariables;
    }
  } else {
    const googleFonts = require("./fonts.google");
    _fontVariables = googleFonts.fontVariables;
  }

  return _fontVariables;
}

// For backward compatibility with existing import
export { fontVariables } from "./fonts.google";
export const activeFontSource = FONT_SOURCE;
```

> **Alternative (simpler):** Keep two separate entry points and switch in `app/layout.tsx` based on an env variable, avoiding runtime branching entirely.

---

### Phase 2: PostHog Optimization (HIGH PRIORITY)

#### Step 2.1: Use PostHog via Hook Instead of Direct Import

Since PostHog is already initialized in `instrumentation-client.ts`, components don't need to import `posthog-js` directly. Create a thin wrapper hook:

**File**: `hooks/usePostHog.ts` (new file)

```typescript
"use client";

import { useCallback } from "react";

export function usePostHogCapture() {
  const capture = useCallback((event: string, properties?: Record<string, unknown>) => {
    // Dynamically import only when capturing, if not already loaded
    import("posthog-js").then((mod) => {
      mod.default.capture(event, properties);
    });
  }, []);

  return { capture };
}
```

Then update all 7 consuming components to use this hook instead of `import posthog from "posthog-js"`. This ensures posthog-js is only loaded once (via the instrumentation file) and individual components don't add it to their own chunks.

#### Step 2.2: Lazy Load SpeedInsights

**File**: `app/layout.tsx`

```typescript
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
  { ssr: false }
);
```

---

### Phase 3: CSS Transition Optimization (MEDIUM PRIORITY)

#### Step 3.1: Replace Wildcard Selectors with Scoped Transitions

**File**: `app/globals.css`

The current wildcard selectors `[class*="bg-"]`, `[class*="text-"]`, `[class*="border-"]` match potentially hundreds of elements. Replace with targeted selectors:

```css
/* Before (expensive — matches ALL elements with bg-/text-/border- classes) */
[class*="bg-"],
[class*="text-"],
[class*="border-"] {
  transition: background-color 0.4s ease-in-out, color 0.4s ease-in-out, border-color 0.4s ease-in-out;
}

/* After (targeted — only transition elements that actually change on theme switch) */
html, body {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* Only apply to major layout containers */
.bg-background,
.bg-card,
.bg-muted,
.border-border {
  transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}
```

#### Step 3.2: Consider Disabling Transitions During Theme Change

Since the ThemeProvider is custom (`components/theme/ThemeProvider.tsx`), add transition suppression during theme toggle to avoid jank:

```typescript
const setTheme = useCallback((newTheme: Theme) => {
  // Temporarily disable transitions to prevent jank
  document.documentElement.classList.add("no-transitions");
  applyThemeToDOM(newTheme);
  setThemeState(newTheme);

  // Re-enable after a frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transitions");
    });
  });

  window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: newTheme } }));
}, []);
```

With the corresponding CSS:

```css
.no-transitions,
.no-transitions * {
  transition: none !important;
}
```

---

### Phase 4: CLS (Layout Shift) Fixes

#### Step 4.1: Explicit Image Dimensions

Verify all `<Image>` components specify `width` and `height` or are inside containers with explicit dimensions. In `CardList.tsx:208-213`, the `fill` prop is used inside an `aspect-video` container — verify this container has a defined width to prevent collapse.

#### Step 4.2: Optimize Animations

**File**: `app/globals.css`

Replace `clip-path` header animation with GPU-accelerated `transform`:

```css
/* Before (triggers layout/paint) */
@keyframes headerReveal {
  from { clip-path: inset(0 100% 0 0); opacity: 0; }
  to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
}

/* After (GPU-accelerated, no layout/paint) */
@keyframes headerReveal {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-header-reveal {
  animation: headerReveal 0.6s ease-out forwards;
  opacity: 0;
  will-change: transform, opacity;
}
```

Add `contain: layout style` to the fade-in animation wrapper to prevent layout shift:

```css
.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out 0.1s forwards;
  opacity: 0;
  contain: layout style;
}
```

#### Step 4.3: Reserve Space for Animated Content

**File**: `app/page.tsx`

Add minimum height to prevent layout shift during animation:

```tsx
<div className="space-y-6 animate-fade-in-down max-w-3xl min-h-[300px]">
  {/* content */}
</div>
```

---

### Phase 5: Content Caching Optimization

#### Step 5.1: Increase Revalidation for Stable Content

**File**: `lib/contentConfig.ts`

Blog content changes infrequently. Increase revalidation:

```typescript
// Current: 3600 (1 hour)
// Recommended: 86400 (24 hours) for published content
const REMOTE_REVALIDATE_SECONDS = 86400;
```

#### Step 5.2: Add Network Error Handling

**File**: `lib/contentConfig.ts`

Wrap fetch calls in try/catch to handle network failures gracefully:

```typescript
const getRemoteTree = cache(async (): Promise<string[]> => {
  try {
    const response = await fetch(contentConfig.treeApiUrl, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: contentConfig.revalidate },
    });

    if (!response.ok) {
      console.error(`Failed to fetch remote tree: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return (data.tree ?? [])
      .filter((entry: { type: string; path: string }) => entry.type === "blob" && entry.path.endsWith(".mdx"))
      .map((entry: { path: string }) => entry.path);
  } catch (error) {
    console.error("Network error fetching remote tree:", error);
    return [];
  }
});
```

---

### Phase 6: Next.js Config Improvements

**File**: `next.config.ts`

The following are **already configured** (no changes needed):
- `compress: true`
- `poweredByHeader: false`
- PostHog proxy rewrites
- `skipTrailingSlashRedirect: true`

**Recommended additions**:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**" },
  ],
  // Add these:
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
},
```

---

### Phase 7: Metadata Optimization

**File**: `app/layout.tsx`

The current metadata is minimal (`title: "Samarth"`, basic description). Add comprehensive metadata:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Samarth - Software Architect",
    template: "%s | Samarth",
  },
  description: "Personal blog and portfolio of Samarth, a software architect and full-stack engineer.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Samarth - Software Architect",
    description: "Personal blog and portfolio",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

### Phase 8: @tiptap Code Splitting (Low Priority)

If the rich text editor is only used on specific pages (e.g., an admin/editor route), ensure it's dynamically imported:

```typescript
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
```

This prevents the ~100kb+ tiptap suite from being included in the main bundle.

---

## Verification Steps

After implementing changes, verify improvements:

1. **Build Analysis**:
   ```bash
   npm run build
   # Check build output for route sizes and chunk breakdown
   ```

2. **Lighthouse Audit**:
   - Run Chrome DevTools Lighthouse in Incognito mode
   - Focus on Performance, Accessibility, and Best Practices scores

3. **Core Web Vitals Targets**:
   - LCP (Largest Contentful Paint): < 2.5s
   - INP (Interaction to Next Paint): < 200ms
   - CLS (Cumulative Layout Shift): < 0.1

4. **Bundle Analysis**:
   ```bash
   # Add @next/bundle-analyzer to inspect chunk sizes
   ANALYZE=true npm run build
   ```

5. **PageSpeed Insights**:
   - Test production URL at https://pagespeed.web.dev
   - Review both mobile and desktop scores

---

## Expected Improvements

| Metric | Current (Est.) | After Optimization | Primary Fix |
|--------|----------------|-------------------|-------------|
| Font Loading | 3 external requests, 12 files | 0 external (local) or preloaded | Phase 1 |
| JS Bundle Size | ~150kb | ~100-110kb | Phase 2 (PostHog + SpeedInsights) |
| TTI (Time to Interactive) | ~1.2s | ~800ms | Phase 2 |
| LCP (Largest Contentful Paint) | ~2.5s | ~1.8s | Phase 1 |
| CLS (Cumulative Layout Shift) | ~0.1 | ~0.02-0.05 | Phase 1 + 4 |
| INP (Interaction to Next Paint) | ~200ms | ~100-150ms | Phase 2 + 3 |
| Theme Toggle Performance | Hundreds of transitions | Targeted transitions only | Phase 3 |

---

## Implementation Priority Summary

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 1 | Font `display: "optional"` | Low | HIGH |
| 2 | Add font preload for serif | Low | HIGH |
| 3 | Replace wildcard CSS transitions | Low | HIGH |
| 4 | PostHog wrapper hook (remove 7 static imports) | Medium | HIGH |
| 5 | Font metric overrides (CLS) | Medium | HIGH |
| 6 | Explicit image dimensions | Medium | HIGH |
| 7 | Replace `clip-path` with `transform` animation | Low | MEDIUM |
| 8 | Lazy load SpeedInsights | Low | MEDIUM |
| 9 | Self-host fonts (download .woff2) | High | HIGH |
| 10 | Disable transitions during theme change | Low | MEDIUM |
| 11 | Image config (avif/webp, cache TTL) | Low | MEDIUM |
| 12 | Content revalidation + error handling | Low | LOW |
| 13 | Comprehensive metadata | Low | LOW |
| 14 | @tiptap code splitting | Medium | LOW-MEDIUM |

---

## Timeline

- **Phase 1 (Fonts)**: 1-2 hours
- **Phase 2 (PostHog + SpeedInsights)**: 1 hour
- **Phase 3 (CSS Transitions)**: 30 minutes
- **Phase 4 (CLS Fixes)**: 30 minutes
- **Phase 5 (Caching)**: 30 minutes
- **Phase 6-7 (Config + Metadata)**: 30 minutes
- **Phase 8 (@tiptap)**: 30 minutes
- **Testing & Verification**: 1 hour

**Total Estimated Time**: 5-7 hours

---

## Notes

- `generateStaticParams()` in `[category]/[slug]/page.tsx` is correctly implemented with `Promise.all` for parallel fetching
- PostHog rewrites in `next.config.ts` are properly configured for proxy mode
- PostHog initialization in `instrumentation-client.ts` follows the Next.js 15+ recommended pattern
- Image optimization via `next/image` is used in `CardList.tsx` (with `fill` prop)
- SpeedInsights is present in `app/layout.tsx` (static import — should be made dynamic)
- The inline `<script>` in `<head>` for theme detection (FOUC prevention) is a good pattern
- `compress: true` and `poweredByHeader: false` are already set in `next.config.ts`
- The custom ThemeProvider does **not** use `next-themes` — it's a hand-rolled implementation using React context and direct DOM manipulation

---

## Quick Wins (Start Here)

1. **Change font display to `optional`** — 5 min, high impact on CLS
2. **Add font preload for serif** — 5 min, high impact on LCP
3. **Replace wildcard CSS transitions** — 10 min, high impact on INP during theme toggle
4. **Replace `clip-path` animation with `transform`** — 10 min, medium impact on INP
5. **Lazy load SpeedInsights** — 5 min, medium impact on bundle size
6. **Add `formats` and `minimumCacheTTL` to images config** — 5 min, medium impact
