"use client";

import { useTypeStyle } from "../lib/TypeStyleContext";

const styles = [
  { key: "mono" as const, font: "'Berkeley Mono', monospace" },
  { key: "serif" as const, font: "Georgia, serif" },
  { key: "sans" as const, font: "'Inter', sans-serif" },
];

export default function TypeSwitcher() {
  const { typeStyle, setTypeStyle } = useTypeStyle();

  return (
    <div className="flex gap-1">
      {styles.map(({ key, font }) => (
        <button
          key={key}
          onClick={() => setTypeStyle(key)}
          className={`w-[34px] h-[34px] flex items-center justify-center cursor-pointer rounded transition-all duration-[30ms] text-[19px] ${
            typeStyle !== key ? "hover:opacity-60 hover:bg-[color-mix(in_srgb,var(--theme-text)_3%,transparent)]" : ""
          }`}
          style={{
            fontFamily: font,
            opacity: typeStyle === key ? 1 : 0.4,
            border: "1px solid var(--theme-border)",
            background: typeStyle === key ? "color-mix(in srgb, var(--theme-text) 5%, transparent)" : undefined,
          }}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
        >
          A
        </button>
      ))}
    </div>
  );
}
