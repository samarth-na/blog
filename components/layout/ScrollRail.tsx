"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HeadingItem = {
  id: string;
  text: string;
  level: number;
  top: number;
};

const HEADING_SELECTOR = "main h1, main h2, main h3";
const SCROLL_OFFSET = 132;
const FALLBACK_LEVELS = [1, 2, 3, 2, 3, 2, 3, 2, 3, 2];

function markerWidthClass(level: number): string {
  if (level <= 1) {
    return "w-6";
  }

  if (level === 2) {
    return "w-4";
  }

  return "w-3";
}

function shouldRenderRail(pathname: string): boolean {
  if (pathname === "/" || pathname === "/now") {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 2;
}

function normalizeHeadingText(text: string | null | undefined, index: number): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  return normalized || `Section ${index + 1}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createUniqueHeadingId(text: string, usedIds: Set<string>, element: Element): string {
  const base = slugify(text) || "section";
  let candidate = base;
  let suffix = 2;

  while (
    usedIds.has(candidate) ||
    (document.getElementById(candidate) && document.getElementById(candidate) !== element)
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}

export function ScrollRail() {
  const pathname = usePathname();
  const shouldRender = useMemo(() => shouldRenderRail(pathname), [pathname]);

  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(null);

  const headingsRef = useRef<HeadingItem[]>([]);
  const refreshRafRef = useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    const root = document.documentElement;
    const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 0);
    const nextProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    setScrollProgress((prev) => (Math.abs(prev - nextProgress) > 0.001 ? nextProgress : prev));

    const currentHeadings = headingsRef.current;
    if (currentHeadings.length === 0) {
      setActiveHeadingId(null);
      return;
    }

    const activationLine = window.scrollY + SCROLL_OFFSET;
    let nextActiveHeadingId = currentHeadings[0].id;

    for (const heading of currentHeadings) {
      if (heading.top <= activationLine) {
        nextActiveHeadingId = heading.id;
      } else {
        break;
      }
    }

    setActiveHeadingId((prev) => (prev === nextActiveHeadingId ? prev : nextActiveHeadingId));
  }, []);

  const collectHeadings = useCallback(() => {
    const headingElements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
    );
    const usedIds = new Set<string>();

    const nextHeadings = headingElements.map((element, index) => {
      const text = normalizeHeadingText(element.textContent, index);
      let id = element.id.trim();

      if (!id || usedIds.has(id)) {
        id = createUniqueHeadingId(text, usedIds, element);
        element.id = id;
      } else {
        usedIds.add(id);
      }

      return {
        id,
        text,
        level: Number(element.tagName.slice(1)) || 2,
        top: element.getBoundingClientRect().top + window.scrollY,
      };
    });

    headingsRef.current = nextHeadings;
    setHeadings(nextHeadings);
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      headingsRef.current = [];
      setHeadings([]);
      setActiveHeadingId(null);
      setScrollProgress(0);
      setHoveredMarkerIndex(null);
      return;
    }

    const refresh = () => {
      if (refreshRafRef.current) {
        window.cancelAnimationFrame(refreshRafRef.current);
      }

      refreshRafRef.current = window.requestAnimationFrame(() => {
        collectHeadings();
        updateScrollState();
      });
    };

    const mainElement = document.querySelector("main");
    const observer =
      mainElement !== null
        ? new MutationObserver(() => {
            refresh();
          })
        : null;

    if (observer && mainElement) {
      observer.observe(mainElement, {
        childList: true,
        subtree: true,
      });
    }

    const onScroll = () => {
      updateScrollState();
    };

    const onResize = () => {
      refresh();
    };

    refresh();
    const delayedRefresh = window.setTimeout(refresh, 140);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(delayedRefresh);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (refreshRafRef.current) {
        window.cancelAnimationFrame(refreshRafRef.current);
      }
    };
  }, [collectHeadings, shouldRender, updateScrollState]);

  if (!shouldRender) {
    return null;
  }

  const activeFallbackIndex = Math.round(scrollProgress * (FALLBACK_LEVELS.length - 1));
  const railMarkers =
    headings.length > 0
      ? headings.map((heading) => ({
          key: heading.id,
          targetId: heading.id,
          level: Math.min(Math.max(heading.level, 1), 3),
          active: activeHeadingId === heading.id,
          label: heading.text,
        }))
      : FALLBACK_LEVELS.map((level, index) => ({
          key: `fallback-${index}`,
          targetId: null,
          level,
          active: index === activeFallbackIndex,
          label: null,
        }));

  const jumpToHeading = (targetId: string | null) => {
    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const y = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({
      top: Math.max(y, 0),
      behavior: "smooth",
    });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  const markerGapPx =
    railMarkers.length <= 1
      ? 0
      : Math.min(20, Math.max(12, Math.floor(140 / (railMarkers.length - 1))));

  return (
    <aside
      className="fixed right-1.5 top-1/2 z-40 -translate-y-1/2 sm:right-2.5"
      onMouseLeave={() => setHoveredMarkerIndex(null)}
    >
      <div className="relative flex h-[46vh] min-h-[170px] w-6 items-center justify-end">
        <div className="relative z-10 flex h-full w-full items-center justify-center py-1.5">
          <div className="flex flex-col items-end" style={{ rowGap: `${markerGapPx}px` }}>
            {railMarkers.map((marker, index) => (
              <button
                key={marker.key}
                type="button"
                onMouseEnter={() => setHoveredMarkerIndex(index)}
                onFocus={() => setHoveredMarkerIndex(index)}
                onBlur={() =>
                  setHoveredMarkerIndex((current) => (current === index ? null : current))
                }
                aria-label={marker.label ?? "Section marker"}
                className={`relative ${markerWidthClass(marker.level)} h-[2px] rounded-full transition-all duration-150 ${
                  marker.active || hoveredMarkerIndex === index
                    ? "bg-gray-900 dark:bg-white shadow-[0_0_8px_color-mix(in_oklch,var(--foreground)_45%,transparent)]"
                    : "bg-muted-foreground/45"
                }`}
              >
                {hoveredMarkerIndex === index && marker.label ? (
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      jumpToHeading(marker.targetId);
                    }}
                    className="absolute right-full top-1/2 mr-2 max-w-[15rem] -translate-y-1/2 cursor-pointer truncate whitespace-nowrap rounded-[6px] bg-background/75 px-2 py-1 text-[12px] leading-none text-foreground shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/55"
                  >
                    {marker.label}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
