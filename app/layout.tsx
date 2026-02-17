import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LAYOUT_CONFIG } from "@/data/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "samarth nagar",
  description: "my blog/portfolio/personal website ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSerif.variable} antialiased min-h-screen flex flex-col bg-background`}
      >
        <ThemeProvider>
          <div className="flex-1">
            <div className={`${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-6 py-12`}>
              <Header />
              <main>{children}</main>
            </div>
          </div>

          <div
            className={`w-full ${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-6 pb-12`}
          >
            <Footer />
          </div>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
