'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export function useShouldDisableTilt() {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua) || window.matchMedia('(pointer: coarse)').matches;
    setDisabled(isSafari || isMobile);
  }, []);
  return disabled;
}

interface TiltConfig {
  maxTilt?: number;
  perspective?: number;
  returnSpeed?: number;
  glare?: boolean;
  glareOpacity?: number;
}

const DEFAULTS: Required<TiltConfig> = {
  maxTilt: 15,
  perspective: 600,
  returnSpeed: 1000,
  glare: true,
  glareOpacity: 0.1,
};

const noopHandler = () => {};

export function useTilt(config: TiltConfig = {}) {
  const opts = { ...DEFAULTS, ...config };
  const ref = useRef<HTMLDivElement>(null);
  const disabled = useShouldDisableTilt();
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || disabled) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltStyle({
        rotateX: -y * opts.maxTilt,
        rotateY: x * opts.maxTilt,
      });
      setGlarePos({
        x: (x + 0.5) * 100,
        y: (y + 0.5) * 100,
      });
    },
    [opts.maxTilt, disabled]
  );

  const onMouseEnter = useCallback(() => {
    if (!disabled) setIsHovering(true);
  }, [disabled]);

  const onMouseLeave = useCallback(() => {
    if (disabled) return;
    setIsHovering(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  }, [disabled]);

  const transform = isHovering
    ? `perspective(${opts.perspective}px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`
    : `perspective(${opts.perspective}px) rotateX(0deg) rotateY(0deg)`;

  const transition = isHovering
    ? 'transform 100ms ease-out'
    : `transform ${opts.returnSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

  const glareBackground = opts.glare
    ? `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${opts.glareOpacity}), transparent 60%)`
    : 'none';

  return {
    ref,
    tiltStyle,
    isHovering,
    handlers: { onMouseMove, onMouseEnter, onMouseLeave },
    style: { transform, transition },
    glareBackground,
    opts,
  };
}
