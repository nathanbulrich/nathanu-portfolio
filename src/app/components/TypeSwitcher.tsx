"use client";

import { useTypeStyle } from "../lib/TypeStyleContext";

const styles = [
  { key: "serif" as const, font: "Georgia, serif" },
  { key: "mono" as const, font: "'Berkeley Mono', monospace" },
  { key: "sans" as const, font: "'Inter', sans-serif" },
];

export default function TypeSwitcher() {
  const { typeStyle, setTypeStyle } = useTypeStyle();

  return (
    <div className="flex gap-[6px]">
      {styles.map(({ key, font }) => (
        <button
          key={key}
          onClick={() => setTypeStyle(key)}
          className={`group w-[38px] h-[38px] flex items-center justify-center cursor-pointer rounded transition-all duration-[30ms] text-[19px] ${
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
          <span className="inline-block transition-transform duration-150 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:transform-none">
            A
          </span>
        </button>
      ))}
    </div>
  );
}
