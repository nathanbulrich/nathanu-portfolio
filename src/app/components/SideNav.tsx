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
      <nav className="hidden min-[1440px]:flex fixed left-[44px] top-[86px] flex-col gap-4 z-50">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`py-1 no-underline hover:no-underline transition-opacity ${
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
          className="py-1 text-left cursor-pointer opacity-40 hover:opacity-70 transition-opacity"
        >
          Contact
        </button>
      </nav>

      {/* Mobile/tablet top nav */}
      <header className="min-[1440px]:hidden px-6 py-5 md:px-12 lg:px-16">
        <div className="font-medium mb-3">Nathan Ulrich</div>
        <nav className="flex items-center gap-4 text-[15px]">
          {links.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`no-underline hover:no-underline transition-opacity ${
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
            className="cursor-pointer opacity-40 hover:opacity-70 transition-opacity"
          >
            Contact
          </button>
        </nav>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
