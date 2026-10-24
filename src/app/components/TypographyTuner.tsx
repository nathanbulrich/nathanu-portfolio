"use client";

import { useEffect } from "react";
import { DialRoot, useDialKit } from "dialkit";

export default function TypographyTuner() {
  return (
    <>
      {process.env.NODE_ENV === "development" && <DevelopmentTypographyTuner />}
      <CaptionTuner />
      <DialRoot productionEnabled />
    </>
  );
}

function CaptionTuner() {
  const { size } = useDialKit("Project captions", {
    size: [20, 12, 36, 1],
  }, {
    id: "project-caption-typography",
    persist: true,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--caption-size", `${size}px`);
    return () => {
      document.documentElement.style.removeProperty("--caption-size");
    };
  }, [size]);

  return null;
}

function DevelopmentTypographyTuner() {
  const { typeSize } = useDialKit("Typography", {
    typeSize: [20, 16, 28, 1],
  }, {
    id: "global-typography",
    persist: true,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--type-size", `${typeSize}px`);
    return () => {
      document.documentElement.style.removeProperty("--type-size");
    };
  }, [typeSize]);

  return null;
}
