export type FontSource = "google" | "local";

type GoogleFontConfig = {
  subsets: Array<"latin" | "latin-ext" | "cyrillic" | "cyrillic-ext" | "vietnamese">;
  weight: Array<"100" | "200" | "300" | "400" | "500" | "600" | "700">;
};

type LocalFontConfig = {
  files: Array<{
    path: string;
    weight: string;
    style?: "normal" | "italic";
  }>;
};

type FontRoleConfig = {
  variable: `--font-app-${"sans" | "serif" | "mono"}`;
  fallback: string;
  google: GoogleFontConfig;
  local: LocalFontConfig;
};

type FontPreset = {
  sans: FontRoleConfig;
  serif: FontRoleConfig;
  mono: FontRoleConfig;
};

export const FONT_SOURCE: FontSource = process.env.FONT_SOURCE === "google" ? "google" : "local";

export const ACTIVE_FONT_PRESET = "editorial" as const;

export const FONT_PRESETS: Record<typeof ACTIVE_FONT_PRESET, FontPreset> = {
  editorial: {
    sans: {
      variable: "--font-app-sans",
      fallback: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      google: {
        subsets: ["latin"],
        weight: ["400", "500", "600", "700"],
      },
      local: {
        files: [
          { path: "assets/fonts/instrument-sans/InstrumentSans-Regular.woff2", weight: "400" },
          { path: "assets/fonts/instrument-sans/InstrumentSans-Medium.woff2", weight: "500" },
          { path: "assets/fonts/instrument-sans/InstrumentSans-SemiBold.woff2", weight: "600" },
          { path: "assets/fonts/instrument-sans/InstrumentSans-Bold.woff2", weight: "700" },
        ],
      },
    },
    serif: {
      variable: "--font-app-serif",
      fallback: 'ui-serif, Georgia, "Times New Roman", serif',
      google: {
        subsets: ["latin"],
        weight: ["400", "500", "600", "700"],
      },
      local: {
        files: [
          {
            path: "assets/fonts/cormorant-garamond/CormorantGaramond-Regular.woff2",
            weight: "400",
          },
          {
            path: "assets/fonts/cormorant-garamond/CormorantGaramond-Medium.woff2",
            weight: "500",
          },
          {
            path: "assets/fonts/cormorant-garamond/CormorantGaramond-SemiBold.woff2",
            weight: "600",
          },
          {
            path: "assets/fonts/cormorant-garamond/CormorantGaramond-Bold.woff2",
            weight: "700",
          },
        ],
      },
    },
    mono: {
      variable: "--font-app-mono",
      fallback:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      google: {
        subsets: ["latin"],
        weight: ["400", "500", "600", "700"],
      },
      local: {
        files: [
          { path: "assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.woff2", weight: "400" },
          { path: "assets/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2", weight: "500" },
          { path: "assets/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff2", weight: "600" },
          { path: "assets/fonts/ibm-plex-mono/IBMPlexMono-Bold.woff2", weight: "700" },
        ],
      },
    },
  },
};
