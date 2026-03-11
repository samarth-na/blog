import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LAYOUT_CONFIG } from "@/data/config";
import { fontVariables } from "@/lib/fonts";
import { getAllCategories } from "@/lib/getCategories";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${fontVariables} font-sans antialiased min-h-screen flex flex-col bg-background`}
      >
        <ThemeProvider>
          <ScrollRail />
          <div className="flex-1">
            <div className={`${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-6 py-12`}>
              <Header categories={categories} />
              <main className="mx-2">{children}</main>
            </div>
          </div>

          <div className={`w-full ${LAYOUT_CONFIG.maxWidth["2xl"]} mx-auto px-6 pb-12`}>
            <Footer />
          </div>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
