"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { slugForUrl, type Site } from "./sites-data";
import { useIsCoarsePointer } from "../lib/useIsCoarsePointer";

const WIDTH = 320;
const HEIGHT = 200;
const OFFSET = 24;
const EDGE_PAD = 16;

interface Props {
  site: Site | null;
}

export function SitePreview({ site }: Props) {
  const coarse = useIsCoarsePointer();
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [site?.url]);

  useEffect(() => {
    if (!site || coarse) return;
    const handler = (e: MouseEvent) => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = ref.current;
        if (!el) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = e.clientX + OFFSET;
        let y = e.clientY + OFFSET;
        if (x + WIDTH > vw - EDGE_PAD) x = e.clientX - WIDTH - OFFSET;
        if (y + HEIGHT > vh - EDGE_PAD) y = e.clientY - HEIGHT - OFFSET;
        el.style.setProperty("--preview-x", `${x}px`);
        el.style.setProperty("--preview-y", `${y}px`);
      });
    };
    document.addEventListener("mousemove", handler);
    return () => {
      document.removeEventListener("mousemove", handler);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [site, coarse]);

  if (coarse) return null;

  const slug = site ? slugForUrl(site.url) : null;
  const visible = site != null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{
        transform: "translate3d(var(--preview-x, -9999px), var(--preview-y, -9999px), 0)",
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 120ms ease-out" : "opacity 80ms ease-out",
        width: WIDTH,
        height: HEIGHT,
      }}
    >
      <div
        className="rounded-lg overflow-hidden bg-[var(--theme-bg)]"
        style={{
          width: WIDTH,
          height: HEIGHT,
          border: "1px solid var(--theme-border)",
          boxShadow: "0 8px 24px -6px rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.05)",
        }}
      >
        {slug && !errored ? (
          <Image
            src={`/images/site-thumbnails/${slug}.webp`}
            alt=""
            width={640}
            height={400}
            sizes="320px"
            priority={false}
            className="w-full h-full object-cover object-top"
            onError={() => setErrored(true)}
          />
        ) : site ? (
          <div className="w-full h-full flex items-center justify-center px-4 text-center text-sm opacity-60">
            {site.name}
          </div>
        ) : null}
      </div>
    </div>
  );
}
