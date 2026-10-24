"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDialKit } from "dialkit";
import ContactModal from "./ContactModal";
import TypeSwitcher from "./TypeSwitcher";
import { useTypeStyle } from "../lib/TypeStyleContext";

function CosmosLabel({ stemLength, strokeWidth, iconSize }: { stemLength: number; strokeWidth: number; iconSize: number }) {
  const stemOffset = stemLength / Math.SQRT2;
  return (
    <span className="relative inline-flex items-center">
      <span className="group-hover:underline group-focus-visible:underline">Cosmos</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={{ width: `${iconSize}em`, height: `${iconSize}em` }}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        className="pointer-events-none absolute left-full translate-y-[1px] ml-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        <path d={`M${12.5 - stemOffset} ${3.5 + stemOffset} 12.5 3.5M3.5 3.5h9v9`} />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </span>
  );
}

export default function SideNav() {
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);
  const { typeStyle } = useTypeStyle();
  const arrow = useDialKit("Cosmos Arrow", {
    stemLength: [Math.hypot(11, 11), 6, 16, 0.25],
    strokeWidth: [1.5, 0.5, 3, 0.1],
    iconSize: [0.65, 0.4, 1.2, 0.05],
  }, {
    id: "cosmos-arrow",
    persist: true,
  });

  const links = [
    { label: "Work", href: "/" },
    { label: "About", href: "/about" },
    { label: "Sites", href: "/sites" },
  ];

  return (
    <>
      {/* Desktop side nav — fixed in left gutter */}
      <nav className="hidden lg:flex fixed left-0 top-[86px] bottom-0 w-[228px] pl-[44px] flex-col gap-4 z-50">
        {links.map(({ label, href }, i) => {
          const isActive = pathname === href;
          const padding = i === 0 ? "pb-1.5 pt-1" : "pt-2 pb-1.5";
          return (
            <Link
              key={href}
              href={href}
              className={`${padding} no-underline hover:no-underline transition-opacity duration-[30ms] ${
                isActive
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <a
          href="https://www.cosmos.so/nathanu"
          target="_blank"
          rel="noopener noreferrer"
          className="group pt-2 pb-1.5 no-underline hover:no-underline opacity-40 hover:opacity-70 focus-visible:opacity-70 transition-opacity duration-[30ms]"
        >
          <CosmosLabel {...arrow} />
        </a>
        <button
          onClick={() => setContactOpen(true)}
          className="py-1.5 text-left cursor-pointer opacity-40 hover:opacity-70 hover:underline transition-opacity duration-[30ms]"
        >
          Contact
        </button>

        <div className="mt-auto pb-8 flex flex-col gap-3">
          <p className="text-[14px]">
            {typeStyle === "mono" ? (
              <a href="https://usgraphics.com/products/berkeley-mono" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-70 transition-opacity duration-[30ms]">Berkeley Mono</a>
            ) : typeStyle === "serif" ? (
              <a href="https://en.wikipedia.org/wiki/Georgia_(typeface)" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-70 transition-opacity duration-[30ms]">Georgia</a>
            ) : (
              <a href="https://rsms.me/inter/" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-70 transition-opacity duration-[30ms]">Inter</a>
            )}
          </p>
          <TypeSwitcher />
        </div>
      </nav>

      {/* Mobile/tablet top nav */}
      <header className="lg:hidden px-6 pt-11 pb-5 md:px-12 lg:px-16">
        <nav className="flex items-center gap-6">
          {links.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`no-underline hover:no-underline transition-opacity duration-[30ms] ${
                  isActive
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <a
            href="https://www.cosmos.so/nathanu"
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline hover:no-underline opacity-40 hover:opacity-70 focus-visible:opacity-70 transition-opacity duration-[30ms]"
          >
            <CosmosLabel {...arrow} />
          </a>
          <button
            onClick={() => setContactOpen(true)}
            className="cursor-pointer opacity-40 hover:opacity-70 hover:underline transition-opacity duration-[30ms]"
          >
            Contact
          </button>
        </nav>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
