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

export default function InterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="prose prose-sm max-w-none">{children}</div>;
}
