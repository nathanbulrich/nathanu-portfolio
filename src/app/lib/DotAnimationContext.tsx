"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import type { DotAnimationStyle } from "../components/DotRow";

interface AnimationPhase {
  name: DotAnimationStyle;
  duration: number;
  reverseStagger?: boolean;
  gapAfter?: number;
}

const SEQUENCE: AnimationPhase[] = [
  { name: "flip", duration: 1200, gapAfter: 200 },
  { name: "flip-back", duration: 1200, reverseStagger: true },
  { name: "bounce", duration: 2000 },
  { name: "spin", duration: 2000 },
  { name: "pop", duration: 2000 },
];

const CYCLE_DELAY = 2000; // ms pause between animations
const RESUME_DELAY = 4000; // ms after hover before resuming

interface DotAnimationContextValue {
  animation: DotAnimationStyle;
  cycle: number;
  reverseStagger: boolean;
  paused: boolean;
  setHovering: (hovering: boolean) => void;
}

const DotAnimationContext = createContext<DotAnimationContextValue>({
  animation: "bounce",
  cycle: 0,
  reverseStagger: false,
  paused: false,
  setHovering: () => {},
});

export function DotAnimationProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCountRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % SEQUENCE.length);
    setCycle((c) => c + 1);
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (paused) return;
    const current = SEQUENCE[index];
    const wait = current.duration + (current.gapAfter ?? CYCLE_DELAY);
    timerRef.current = setTimeout(advance, wait);
  }, [index, paused, clearTimer, advance]);

  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [scheduleNext, clearTimer]);

  const setHovering = useCallback((hovering: boolean) => {
    if (hovering) {
      hoverCountRef.current++;
      setPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    } else {
      hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
      if (hoverCountRef.current === 0) {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          resumeTimerRef.current = null;
          advance();
          setPaused(false);
        }, RESUME_DELAY);
      }
    }
  }, [advance]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const phase = SEQUENCE[index];

  return (
    <DotAnimationContext.Provider value={{
      animation: phase.name,
      cycle,
      reverseStagger: phase.reverseStagger ?? false,
      paused,
      setHovering,
    }}>
      {children}
    </DotAnimationContext.Provider>
  );
}

export function useDotAnimation() {
  return useContext(DotAnimationContext);
}
