"use client";

import { DialRoot, useDialKit } from "dialkit";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const skeletonControls = {
  skeletonColor: "#f0f0f0",
  showSkeletons: false,
  replayReveal: { type: "action" as const, label: "Replay reveal" },
};

export function ProjectImageDialRoot() {
  return <DialRoot position="bottom-right" productionEnabled />;
}

export default function ProjectImageTuning({ children }: { children: ReactNode }) {
  const [replayPhase, setReplayPhase] = useState<"idle" | "reset" | "revealing">("idle");
  const replayTimers = useRef<number[]>([]);

  useEffect(() => () => {
    replayTimers.current.forEach(window.clearTimeout);
  }, []);

  const { skeletonColor, showSkeletons } = useDialKit("Project image skeletons", skeletonControls, {
    id: "project-image-skeletons",
    persist: true,
    onAction(path) {
      if (path !== "replayReveal") return;
      replayTimers.current.forEach(window.clearTimeout);
      setReplayPhase("reset");
      replayTimers.current = [
        window.setTimeout(() => setReplayPhase("revealing"), 500),
        window.setTimeout(() => setReplayPhase("idle"), 1700),
      ];
    },
  });

  return (
    <div
      className="project-image-tuning"
      data-show-skeletons={showSkeletons}
      data-replay-phase={replayPhase}
      style={{ "--project-skeleton-color": skeletonColor } as CSSProperties}
    >
      {children}
    </div>
  );
}
