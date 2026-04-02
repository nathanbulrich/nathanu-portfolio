"use client";

import { useEffect, useCallback, useState } from "react";
import { useTilt } from "../lib/useTilt";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { ref: tiltRef, handlers: tiltHandlers, style: tiltStyle, glareBackground } = useTilt({
    maxTilt: 10,
    perspective: 800,
    glareOpacity: 0.08,
  });

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const copyEmail = () => {
    navigator.clipboard.writeText("nateulrich@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contacts = [
    {
      label: "Twitter",
      value: "@nbulrich",
      href: "https://x.com/nbulrich",
    },
    {
      label: "LinkedIn",
      value: "nathan-ulrich",
      href: "https://www.linkedin.com/in/nathan-ulrich/",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        ref={tiltRef}
        className={`relative bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-[16px] px-10 py-10 max-w-[400px] w-full mx-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: visible
            ? `${tiltStyle.transform} scale(1)`
            : `perspective(800px) rotateX(0deg) rotateY(0deg) scale(0.95)`,
          transition: visible
            ? `opacity 200ms ease, ${tiltStyle.transition}`
            : 'opacity 200ms ease, transform 200ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={tiltHandlers.onMouseMove}
        onMouseEnter={tiltHandlers.onMouseEnter}
        onMouseLeave={tiltHandlers.onMouseLeave}
      >
        {/* Glare overlay */}
        {glareBackground !== 'none' && (
          <div
            className="absolute inset-0 rounded-[16px] pointer-events-none"
            style={{ background: glareBackground }}
          />
        )}
        <h2 className="text-lg font-medium mb-8">Contact</h2>

        <div className="space-y-6">
          <div>
            <div className="text-[13px] opacity-40 mb-1">Email</div>
            <button
              onClick={copyEmail}
              className={`cursor-pointer ${copied ? "" : "hover:underline"}`}
            >
              {copied ? "Copied!" : "nateulrich@gmail.com"}
            </button>
          </div>
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
