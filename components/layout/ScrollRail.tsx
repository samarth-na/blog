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
          level: Math.min(Math.max(heading.level, 1), 3),
          active: activeHeadingId === heading.id,
          label: heading.text,
        }))
      : FALLBACK_LEVELS.map((level, index) => ({
          key: `fallback-${index}`,
          level,
          active: index === activeFallbackIndex,
          label: null,
        }));

  const hoveredMarker =
    hoveredMarkerIndex === null ? null : (railMarkers[hoveredMarkerIndex] ?? null);
  const markerPosition =
    hoveredMarkerIndex === null
      ? 50
      : railMarkers.length <= 1
        ? 50
        : (hoveredMarkerIndex / (railMarkers.length - 1)) * 100;

  return (
    <aside
      className="fixed right-1.5 top-1/2 z-40 -translate-y-1/2 sm:right-2.5"
      onMouseLeave={() => setHoveredMarkerIndex(null)}
    >
      <div className="relative flex h-[46vh] min-h-[170px] w-6 items-center justify-end">
        {hoveredMarker?.label ? (
          <div
            style={{ top: `${markerPosition}%` }}
            className="pointer-events-none absolute right-full mr-2 -translate-y-1/2"
          >
            <div className="max-w-[15rem] truncate whitespace-nowrap rounded-[3px]   px-2 py-1 text-[12px] leading-none text-foreground shadow-xl  bg-background backdrop-blur">
              {hoveredMarker.label}
            </div>
          </div>
        ) : null}

        <div className="relative z-10 flex h-full w-full flex-col items-end justify-between py-1.5">
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
              className={`${markerWidthClass(marker.level)} h-[2px] rounded-full transition-all duration-150 ${
                marker.active || hoveredMarkerIndex === index
                  ? "bg-black shadow-[0_0_8px_color-mix(in_oklch,var(--foreground)_45%,transparent)]"
                  : "bg-muted-foreground/45"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
