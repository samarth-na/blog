import { Cormorant_Garamond, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-serif",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-mono",
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "monospace",
  ],
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
