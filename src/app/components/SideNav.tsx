"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ContactModal from "./ContactModal";

export default function SideNav() {
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);

  const links = [
    { label: "Work", href: "/" },
    { label: "About", href: "/about" },
    { label: "Sites", href: "/sites" },
  ];

  return (
    <>
      {/* Desktop side nav — fixed in left gutter */}
      <nav className="hidden lg:flex fixed left-0 top-[86px] bottom-0 w-[228px] pl-[44px] flex-col gap-4 z-50">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`py-1 no-underline hover:no-underline transition-opacity duration-[30ms] ${
                isActive
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <button
          onClick={() => setContactOpen(true)}
          className="py-1 text-left cursor-pointer opacity-40 hover:opacity-70 hover:underline transition-opacity duration-[30ms]"
        >
          Contact
        </button>

        <div className="mt-auto pb-8 flex flex-col gap-4">
          <p className="py-1 opacity-40 text-[14px]">© Copyright 2026</p>
          <a href="https://usgraphics.com/products/berkeley-mono" target="_blank" rel="noopener noreferrer" className="py-1 opacity-40 hover:opacity-70 transition-opacity duration-[30ms] text-[14px]">Berkeley Mono <br />by U.S. Graphics</a>
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
