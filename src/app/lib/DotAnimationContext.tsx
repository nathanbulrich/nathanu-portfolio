"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import type { DotAnimationStyle } from "../components/DotRow";

interface AnimationPhase {
  name: DotAnimationStyle;
  duration: number;
  reverseStagger?: boolean;
  /** Gap before next phase (overrides the user delay). Omit to use user delay. */
  gapAfter?: number;
}

const SEQUENCE: AnimationPhase[] = [
  { name: "bounce", duration: 2000 },
  { name: "spin", duration: 2000 },
  { name: "pop", duration: 2000 },
  { name: "flip", duration: 1200, gapAfter: 400 },
  { name: "flip-back", duration: 1200, reverseStagger: true },
];

interface DotAnimationContextValue {
  animation: DotAnimationStyle;
  cycle: number;
  reverseStagger: boolean;
  delay: number;
  setDelay: (ms: number) => void;
}

const DotAnimationContext = createContext<DotAnimationContextValue>({
  animation: "bounce",
  cycle: 0,
  reverseStagger: false,
  delay: 4000,
  setDelay: () => {},
});

export function DotAnimationProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [delay, setDelay] = useState(4000);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const current = SEQUENCE[index];
    const gap = current.gapAfter ?? delay;
    const totalWait = current.duration + gap;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % SEQUENCE.length);
      setCycle((c) => c + 1);
    }, totalWait);
  }, [index, delay]);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext]);

  const phase = SEQUENCE[index];

  return (
    <DotAnimationContext.Provider value={{
      animation: phase.name,
      cycle,
      reverseStagger: phase.reverseStagger ?? false,
      delay,
      setDelay,
    }}>
      {children}
    </DotAnimationContext.Provider>
  );
}

export function useDotAnimation() {
  return useContext(DotAnimationContext);
}
