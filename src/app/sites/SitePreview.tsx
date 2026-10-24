"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useDialKit } from "dialkit";
import { useEffect, useRef, useState } from "react";
import { sites, slugForUrl, type Site } from "./sites-data";
import { useIsCoarsePointer } from "../lib/useIsCoarsePointer";

const WIDTH = 320;
const HEIGHT = 282;
const OFFSET = 24;
const EDGE_PAD = 16;

interface Props {
  site: Site | null;
  origin: { x: number; y: number };
}

export function SitePreview({ site, origin }: Props) {
  const coarse = useIsCoarsePointer();
  const reducedMotion = useReducedMotion();
  const { tilt, springDuration, bounce } = useDialKit("Site previews", {
    tilt: [2, 0, 5, 0.5],
    springDuration: [0.35, 0.15, 0.7, 0.05],
    bounce: [0.18, 0, 0.4, 0.02],
  });
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [site?.url]);

  useEffect(() => {
    if (!site || coarse) return;
    const handler = (e: Pick<MouseEvent, "clientX" | "clientY">) => {
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
        el.style.setProperty("--preview-x", `${Math.max(EDGE_PAD, Math.min(x, vw - WIDTH - EDGE_PAD))}px`);
        el.style.setProperty("--preview-y", `${Math.max(EDGE_PAD, Math.min(y, vh - HEIGHT - EDGE_PAD))}px`);
      });
    };
    handler({ clientX: origin.x, clientY: origin.y });
    document.addEventListener("mousemove", handler);
    return () => {
      document.removeEventListener("mousemove", handler);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [site, coarse, origin]);

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
      <motion.div
        key={site?.url ?? "empty"}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, rotate: 0, y: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: reducedMotion ? 0 : (sites.findIndex((item) => item.url === site?.url) % 2 ? tilt : -tilt), y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", visualDuration: springDuration, bounce }}
        className="rounded-xl overflow-hidden bg-[var(--theme-bg)] p-2"
        style={{
          width: WIDTH,
          height: HEIGHT,
          border: "1px solid var(--theme-border)",
          boxShadow: "0 18px 40px -12px rgba(0,0,0,0.22), 0 3px 8px -2px rgba(0,0,0,0.08)",
        }}
      >
        <div className="h-[190px] overflow-hidden rounded-md bg-[var(--theme-border)]">
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
        {site && (
          <div className="px-2 pt-3 text-[var(--theme-text)]">
            <div className="flex items-center justify-between gap-3 text-[13px] leading-5">
              <span className="truncate">{site.name}</span>
              <span className="opacity-40" aria-hidden>↗</span>
            </div>
            <p className="mt-1 truncate text-[11px] leading-4 opacity-50">{site.note}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
