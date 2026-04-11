import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LAYOUT_CONFIG } from "@/data/config";
import { fontVariables } from "@/lib/fonts";
import { getAllCategories } from "@/lib/getCategories";

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var p=window.matchMedia("(prefers-color-scheme:dark)").matches;if(t==="black"){document.documentElement.classList.add("dark","black")}else if(t==="dark"||(!t&&p)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark","black")}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Samarth",
  description: "my blog/portfolio/personal website ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getAllCategories();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body
        className={`${fontVariables} font-sans antialiased min-h-screen flex flex-col bg-background`}
      >
        <ThemeProvider>
          <ScrollRail />
          <div className="flex-1">
            <div className={`${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-4 sm:px-4 py-8 sm:py-4`}>
              <Header categories={categories} />
              <main className="sm:mx-2">{children}</main>
            </div>
          </div>

          <div
            className={`w-full ${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-4 sm:px-6 pb-8 sm:pb-8`}
          >
            <Footer />
          </div>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
