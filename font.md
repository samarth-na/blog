# Font System Notes

## Current setup

The app currently loads fonts in `app/layout.tsx` with `next/font/google`:

- `Geist`
- `Geist_Mono`
- `IBM_Plex_Serif`

Those font loaders generate CSS variables and classes, and the variables are attached on the `<body>` element.

This part is good because `next/font` is the correct Next.js approach for font loading and optimization.

## What is not ideal right now

The current implementation works, but the font system is split across multiple places and is harder to test quickly.

- `app/layout.tsx` defines the font loaders.
- `app/globals.css` still hardcodes font family names like `DM Sans`, `Space Mono`, `Georgia`, and `"IBM Plex Serif"`.
- font-related CSS variables are repeated in `@theme inline`, `:root`, and `.dark`.
- there is no single place to swap font families for fast testing.
- production and experimentation use the same setup, which makes it less flexible.

## Performance notes

### What is already good

- `next/font/google` is already better than adding raw Google Fonts `<link>` tags.
- Next.js self-hosts and optimizes these fonts, which helps reduce layout shift and avoids extra third-party font requests at runtime.
- fonts are loaded at the app level instead of scattered across components.

### What can be improved

- use one source of truth for all font families
- remove duplicated font declarations from CSS
- stop hardcoding family names in multiple places
- reduce the number of weights to only the ones actually used
- use local `.woff2` files in production for full control and predictable deploy behavior

### Expected performance result

This is not a massive speed rewrite, but it should improve the font pipeline in a few practical ways:

- smaller and cleaner CSS
- fewer unnecessary font files if weights are reduced
- simpler swapping between font sets during testing
- safer production deployments because deployed fonts live inside the repo
- easier long-term maintenance

## Goal

Build a simpler font system with these rules:

1. use local fonts in deployment
2. have one central place to configure fonts
3. make it easy to test many font combinations quickly
4. support two font modes:
   - testing mode uses Google fonts through Next.js
   - deployment mode uses local project fonts
5. keep all font usage connected to shared CSS variables and Tailwind tokens

# aim

- Cormorant Garamond (serif) - Headings, section titles, stat numbers, pull quotes
- Instrument Sans (sans-serif) - Body text (default)
- IBM Plex Mono (monospace) - Eyebrow labels, tags, buttons, meta lines, dates

Key patterns:

- Headings use serif with tight line-height (0.95) and slight letter-spacing (-0.012em)
- Body text uses sans-serif with relaxed line-height (1.55)
- Labels/metadata use mono with wide tracking (0.18em-0.32em) at small sizes (10-11px)
- Dark mode inverts the palette while keeping the same typefaces

## Proposed implementation

### 1. Create one font config file

Add a file like `config/fonts.ts`.

This becomes the single source of truth for:

- active font preset
- font source mode: `google` or `local`
- the `sans`, `serif`, and `mono` font choices
- fallback stacks

This is the file to edit when testing lots of fonts.

### 2. Create one font loader module

Add a file like `lib/fonts.ts`.

This file should:

- read the config from `config/fonts.ts`
- choose `next/font/google` or `next/font/local`
- create the font variables for `sans`, `serif`, and `mono`
- export one combined string or object for use in `app/layout.tsx`

This keeps font logic out of the layout file.

### 3. Simplify `app/layout.tsx`

After the refactor, `app/layout.tsx` should not choose fonts directly.

It should only:

- import the prepared font variables from `lib/fonts.ts`
- apply them to `<body>`

That makes the layout cleaner and easier to maintain.

### 4. Clean up `app/globals.css`

`app/globals.css` should stop hardcoding specific font family names.

Instead it should map the app font variables into shared tokens:

- `--font-sans`
- `--font-serif`
- `--font-mono`

Then the rest of the app should use:

- `font-sans`
- `font-serif`
- `font-mono`

Any heading rules should use variables like `var(--font-serif)` instead of a literal family name.

### 5. Store local fonts inside the project

Use a structure like this:

```text
assets/fonts/
  geist/
    Geist-Regular.woff2
    Geist-Medium.woff2
    Geist-Bold.woff2
  geist-mono/
    GeistMono-Regular.woff2
    GeistMono-Medium.woff2
  ibm-plex-serif/
    IBMPlexSerif-Regular.woff2
    IBMPlexSerif-Medium.woff2
    IBMPlexSerif-Bold.woff2
```

Rules:

- prefer `.woff2`
- include only the weights actually used
- keep files grouped by family
- keep file names predictable

## How the toggle should work

Use an environment variable.

Recommended values:

- `FONT_SOURCE=google`
- `FONT_SOURCE=local`

Recommended usage:

- `.env.local` uses `FONT_SOURCE=google` for quick testing
- production deployment uses `FONT_SOURCE=local`

If the variable is missing, default to `local`.

This is better than a UI toggle because font loading through `next/font` is cleaner and more predictable when chosen at build or server render time.

## Simple config shape

The config should stay small.

Example shape:

- `FONT_SOURCE`
- `ACTIVE_FONT_PRESET`
- `FONT_PRESETS`

Each preset contains:

- `sans`
- `serif`
- `mono`

Each role contains:

- css variable name
- fallback stack
- google config
- local config

This gives one place to swap fonts without editing layout and CSS every time.

## Plan for the changes

### Step 1

Create `config/fonts.ts` as the single font control file.

### Step 2

Add local font files under `assets/fonts`.

### Step 3

Create `lib/fonts.ts` to load either Google or local fonts from the config.

### Step 4

Update `app/layout.tsx` so it only applies exported font variables.

### Step 5

Update `app/globals.css` to use only shared font variables and Tailwind tokens.

### Step 6

Remove hardcoded font family names and duplicated declarations.

### Step 7

Set environment defaults:

- local testing mode can use Google-hosted fonts
- deployment uses local fonts from the project

### Step 8

Test both modes to make sure:

- font paths work
- font weights match expected usage
- no fallback fonts appear unexpectedly
- the app still renders correctly on first load

## Recommended final architecture

- `config/fonts.ts` controls everything
- `lib/fonts.ts` loads the chosen source
- `app/layout.tsx` only consumes the prepared variables
- `app/globals.css` only uses tokens and CSS vars
- `assets/fonts/...` stores deployment font assets

# font that will be used

Cormorant Garamond (serif) - Headings, section titles, stat numbers, pull quotes
Instrument Sans (sans-serif) - Body text (default)
IBM Plex Mono (monospace) - Eyebrow labels, tags, buttons, meta lines, dates

## Why this change is worth doing

- much easier to try many fonts quickly
- one clear place to manage typography
- cleaner separation between testing and deployment
- better control over production font assets
- simpler maintenance over time
