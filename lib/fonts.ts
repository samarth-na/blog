import localFont from "next/font/local";

const sans = localFont({
  src: [
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-SemiBold.woff2", weight: "600" },
    { path: "../assets/fonts/instrument-sans/InstrumentSans-Bold.woff2", weight: "700" },
  ],
  variable: "--font-app-sans",
  display: "optional",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const serif = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-SemiBold.woff2", weight: "600" },
    { path: "../assets/fonts/cormorant-garamond/CormorantGaramond-Bold.woff2", weight: "700" },
  ],
  variable: "--font-app-serif",
  display: "optional",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});

const mono = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff2", weight: "600" },
    { path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Bold.woff2", weight: "700" },
  ],
  variable: "--font-app-mono",
  display: "optional",
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
