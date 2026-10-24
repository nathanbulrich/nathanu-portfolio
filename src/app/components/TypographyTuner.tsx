"use client";

import { useEffect } from "react";
import { DialRoot, useDialKit } from "dialkit";

export default function TypographyTuner() {
  return (
    <>
      {process.env.NODE_ENV === "development" && <DevelopmentTypographyTuner />}
      <DialRoot productionEnabled />
    </>
  );
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
