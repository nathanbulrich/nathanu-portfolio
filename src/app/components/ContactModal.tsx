"use client";

import { useEffect, useCallback } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const contacts = [
    {
      label: "Email",
      value: "nateulrich@gmail.com",
      href: "mailto:nateulrich@gmail.com",
    },
    {
      label: "Twitter",
      value: "@nbulrich",
      href: "https://x.com/nbulrich",
    },
    {
      label: "LinkedIn",
      value: "nathanulrich",
      href: "https://www.linkedin.com/in/nathanulrich",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg px-10 py-10 max-w-[400px] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-lg font-medium mb-8">Contact</h2>

        <div className="space-y-6">
          {contacts.map(({ label, value, href }) => (
            <div key={label}>
              <div className="text-[13px] opacity-40 mb-1">{label}</div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
