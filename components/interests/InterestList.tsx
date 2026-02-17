"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { Interest } from "@/types/interest";

type InterestListProps = {
  interests: Interest[];
};

export function InterestList({ interests }: InterestListProps) {
  const handleInterestClick = (interest: Interest) => {
    posthog.capture("interest_clicked", {
      slug: interest.slug,
      title: interest.title,
    });
  };

  return (
    <div className="space-y-2 border-t border-border pt-8">
      {interests.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No interests found.
        </p>
      ) : (
        interests.map((interest) => (
          <article key={interest.slug} className="group">
            <Link
              href={`/interests/${interest.slug}`}
              onClick={() => handleInterestClick(interest)}
              className="block"
            >
              <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                {interest.title}
              </h2>
            </Link>
          </article>
        ))
      )}
    </div>
  );
}
