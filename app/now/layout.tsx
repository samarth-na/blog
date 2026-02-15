import type { MDXComponents } from "mdx/types";
import React from "react";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export function useMDXComponents(
  componentsFromProps: MDXComponents
): MDXComponents {
  return {
    ...mdxComponents,
    ...componentsFromProps,
  };
}

export default function NowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-sm max-w-none">
      <h1
        className="text-2xl font-medium pb-4 font-serif"
      >
        Now
      </h1>
      {children}
    </div>
  );
}
