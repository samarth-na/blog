import { mdxComponents } from "@/components/mdx/MDXComponents";
import type { MDXComponents } from "mdx/types";
import type React from "react";

export function useMDXComponents(componentsFromProps: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...componentsFromProps,
  };
}

export default function NowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose max-w-none">
      <p className="text-[11px] tracking-[0.24em] uppercase font-mono text-muted-foreground mb-3">
        / Current Snapshot
      </p>
      <h1 className="text-3xl md:text-4xl font-medium pb-4 font-serif leading-[0.92] tracking-[-0.012em]">
        Now
      </h1>
      {children}
    </div>
  );
}
