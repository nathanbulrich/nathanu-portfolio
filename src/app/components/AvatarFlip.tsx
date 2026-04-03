'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useShouldDisableTilt } from '../lib/useTilt';

export default function AvatarFlip() {
  const tiltDisabled = useShouldDisableTilt();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !hasAnimated || tiltDisabled) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltStyle({ rotateX: -y * 10, rotateY: x * 10 });
      setGlarePos({ x: (x + 0.5) * 100, y: (y + 0.5) * 100 });
    },
    [hasAnimated, tiltDisabled]
  );

  const handleMouseEnter = useCallback(() => {
    if (hasAnimated && !tiltDisabled) setIsHovering(true);
  }, [hasAnimated, tiltDisabled]);

  const handleMouseLeave = useCallback(() => {
    if (tiltDisabled) return;
    setIsHovering(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  }, [tiltDisabled]);

  const fromTransform = 'perspective(1350px) rotateX(0deg) rotateY(60deg) rotateZ(-5deg) translateZ(-10px) scale(0.6)';
  const toTransform = 'perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale(1)';
  const boxShadow = '0px 4px 25px 0px rgba(0,0,0,0.29)';

  const currentTransform = hasAnimated
    ? isHovering
      ? `perspective(600px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale(1)`
      : toTransform
    : fromTransform;

  const currentTransition = !hasAnimated
    ? 'none'
    : isHovering
      ? 'transform 100ms ease-out, opacity 400ms ease, box-shadow 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease, box-shadow 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: isHovering ? '600px' : '1350px',
        width: 160,
        height: 160,
        cursor: 'default',
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: currentTransform,
          opacity: hasAnimated ? 1 : 0,
          boxShadow: hasAnimated ? boxShadow : 'none',
          transition: currentTransition,
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          borderRadius: 12,
        }}
      >
        <Image
          src="/images/site-pic.png"
          alt="Nathan Ulrich"
          width={160}
          height={160}
          priority
          className="rounded-[12px] object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 rounded-[12px] pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.1), transparent 60%)`,
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        />
      </div>
    </div>
  );
}
