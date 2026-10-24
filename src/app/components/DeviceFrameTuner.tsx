"use client";

import { useDialKit } from "dialkit";
import { useEffect } from "react";

export default function DeviceFrameTuner() {
  const { cornerRoundness, tightShadow, wideShadow, border } = useDialKit("Device frames", {
    cornerRoundness: [18, 0, 30, 1],
    border: {
      enabled: true,
      color: "#000000",
      opacity: [12, 0, 100, 1],
      thickness: [1, 0, 8, 0.25],
      alignment: { type: "select", options: ["Inside", "Outside"], default: "Inside" },
    },
    tightShadow: {
      enabled: true,
      color: "#000000",
      opacity: [12, 0, 100, 1],
      blur: [3, 0, 100, 1],
      offsetX: [0, -100, 100, 1],
      offsetY: [2, -100, 100, 1],
    },
    wideShadow: {
      enabled: true,
      color: "#000000",
      opacity: [7, 0, 100, 1],
      blur: [24, 0, 100, 1],
      offsetX: [0, -100, 100, 1],
      offsetY: [10, -100, 100, 1],
    },
  }, {
    id: "project-device-frames",
    persist: true,
  });

  const shadowFilter = [tightShadow, wideShadow]
    .filter((shadow) => shadow.enabled)
    .map((shadow) => {
      const color = `color-mix(in srgb, ${shadow.color} ${shadow.opacity}%, transparent)`;
      return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${color})`;
    })
    .join(" ") || "none";

  useEffect(() => {
    document.documentElement.style.setProperty("--device-shadow", shadowFilter);
    return () => {
      document.documentElement.style.removeProperty("--device-shadow");
    };
  }, [shadowFilter]);

  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty("--device-border-color", `color-mix(in srgb, ${border.color} ${border.opacity}%, transparent)`);
    // Clip half the centered stroke to preserve the requested pixel thickness.
    style.setProperty("--device-border-width", `${border.enabled ? border.thickness * 2 : 0}px`);
    style.setProperty("--device-border-clip", border.alignment === "Outside" ? "url(#device-border-outside)" : "url(#squircle)");
    return () => {
      style.removeProperty("--device-border-color");
      style.removeProperty("--device-border-width");
      style.removeProperty("--device-border-clip");
    };
  }, [border.enabled, border.color, border.opacity, border.thickness, border.alignment]);

  // Scale the original continuous corners proportionally across every device.
  const x = cornerRoundness / 100;
  const y = x * (0.065 / 0.14);
  const cx = x * (0.046 / 0.14);
  const cy = y * (0.023 / 0.065);
  const path = `M ${x},0 L ${1 - x},0
    C ${1 - cx},0 1,${cy} 1,${y}
    L 1,${1 - y} C 1,${1 - cy} ${1 - cx},1 ${1 - x},1
    L ${x},1 C ${cx},1 0,${1 - cy} 0,${1 - y}
    L 0,${y} C 0,${cy} ${cx},0 ${x},0 Z`;

  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <path id="device-frame-outline" d={path} vectorEffect="non-scaling-stroke" />
        <clipPath id="squircle" clipPathUnits="objectBoundingBox">
          <path d={path} />
        </clipPath>
        <clipPath id="device-border-outside" clipPathUnits="objectBoundingBox">
          <path d={`M -1,-1 H 2 V 2 H -1 Z ${path}`} clipRule="evenodd" />
        </clipPath>
      </defs>
    </svg>
  );
}
