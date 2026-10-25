"use client";

import { DialRoot, useDialKit } from "dialkit";
import type { CSSProperties, ReactNode } from "react";

const skeletonControls = {
  skeletonColor: "#ececf0",
  showSkeletons: false,
};

export function ProjectImageDialRoot() {
  return <DialRoot position="bottom-right" productionEnabled />;
}

export default function ProjectImageTuning({ children }: { children: ReactNode }) {
  const { skeletonColor, showSkeletons } = useDialKit("Project image skeletons", skeletonControls, {
    id: "project-image-skeletons",
    persist: true,
  });

  return (
    <div
      className="project-image-tuning"
      data-show-skeletons={showSkeletons}
      style={{ "--project-skeleton-color": skeletonColor } as CSSProperties}
    >
      {children}
    </div>
  );
}
