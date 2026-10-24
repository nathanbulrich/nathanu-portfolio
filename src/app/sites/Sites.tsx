"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useTypeStyle } from "../lib/TypeStyleContext";
import { sites, type Site } from "./sites-data";
import { SitePreview } from "./SitePreview";

export default function Sites() {
  const { typeStyle } = useTypeStyle();
  const [hovered, setHovered] = useState<Site | null>(null);
  return (
    <main className="min-h-screen">
      <div className="sites-layout pt-8 md:pt-[88px] lg:pt-[92px] pb-24 pl-0 md:pl-12 lg:pl-12 pr-0 md:pr-[44px]">
        <p className="max-w-[632px] leading-relaxed mb-12 px-6 md:px-0">
          A collection of wonderful websites that inspire.{typeStyle === "mono" && <br className="hidden md:block" />} Click around and enjoy what the talented craftspeople of the World Wide Web have to offer.
        </p>
        <div className="card-border md:rounded-lg w-full">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="py-5 pl-6 md:pl-8 pr-8 text-left font-normal text-[var(--theme-text)] border-b border-b-[var(--theme-border)]">Name</th>
                <th className="py-5 pr-8 text-left font-normal text-[var(--theme-text)] hidden md:table-cell border-b border-b-[var(--theme-border)]">Site</th>
                <th className="py-5 pr-6 md:pr-8 text-left font-normal text-[var(--theme-text)] hidden md:table-cell border-b border-b-[var(--theme-border)]">Note</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => {
                const { name, url, note } = site;
                return (
                  <tr
                    key={url}
                    className="group cursor-pointer hover:bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] transition-colors"
                    onClick={() => window.open(`https://${url}`, '_blank', 'noopener,noreferrer')}
                    onMouseEnter={() => setHovered(site)}
                    onMouseLeave={() => setHovered((current) => (current?.url === url ? null : current))}
                  >
                    <td className="py-5 pl-6 md:pl-8 pr-8 border-b border-b-[var(--theme-border)] group-last:border-b-0">
                      <span className="flex items-center gap-5">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${url}&sz=48`}
                          alt=""
                          width={24}
                          height={24}
                          className="shrink-0"
                          onLoad={(e) => {
                            const el = e.currentTarget;
                            if (el.naturalWidth < 24) {
                              el.style.display = 'none';
                              const circle = document.createElement('span');
                              Object.assign(circle.style, { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--theme-border)', display: 'inline-block', flexShrink: '0' });
                              el.parentElement?.insertBefore(circle, el);
                            }
                          }}
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = 'none';
                            const circle = document.createElement('span');
                            Object.assign(circle.style, { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--theme-border)', display: 'inline-block', flexShrink: '0' });
                            el.parentElement?.insertBefore(circle, el);
                          }}
                        />
                        {name}
                      </span>
                    </td>
                    <td className="py-5 pr-8 hidden md:table-cell border-b border-b-[var(--theme-border)] group-last:border-b-0">
                      <span className="opacity-40">{url}</span>
                    </td>
                    <td className="py-5 pr-6 md:pr-8 hidden md:table-cell border-b border-b-[var(--theme-border)] group-last:border-b-0"><span className="opacity-40">{note}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SitePreview site={hovered} />
    </main>
  );
}
