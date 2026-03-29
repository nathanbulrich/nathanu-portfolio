'use client';

import { useState, useEffect, useCallback } from 'react';

interface FlipParams {
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateZ: number;
  scale: number;
  duration: number;
  delay: number;
  easing: string;
}

interface ShadowParams {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  opacity: number;
}

const DEFAULT_PARAMS: FlipParams = {
  perspective: 1350,
  rotateX: 0,
  rotateY: 60,
  rotateZ: -5,
  translateZ: -10,
  scale: 0.6,
  duration: 1000,
  delay: 50,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const DEFAULT_SHADOW: ShadowParams = {
  offsetX: 0,
  offsetY: 4,
  blur: 25,
  spread: 0,
  opacity: 0.29,
};

const EASING_OPTIONS = [
  { label: 'Ease out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Ease in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { label: 'Snappy', value: 'cubic-bezier(0.2, 0, 0, 1)' },
  { label: 'Bounce', value: 'cubic-bezier(0.34, 2.2, 0.64, 1)' },
  { label: 'Linear', value: 'linear' },
];

export default function AvatarFlip() {
  const [params, setParams] = useState<FlipParams>(DEFAULT_PARAMS);
  const [shadow, setShadow] = useState<ShadowParams>(DEFAULT_SHADOW);
  const [showDebugger, setShowDebugger] = useState(true);
  const [activeTab, setActiveTab] = useState<'transform' | 'shadow'>('transform');
  const [animKey, setAnimKey] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger initial animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), params.delay);
    return () => clearTimeout(timer);
  }, [animKey, params.delay]);

  const replay = useCallback(() => {
    setHasAnimated(false);
    setAnimKey((k) => k + 1);
  }, []);

  const update = (key: keyof FlipParams, value: number | string) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const updateShadow = (key: keyof ShadowParams, value: number) => {
    setShadow((s) => ({ ...s, [key]: value }));
  };

  const boxShadowValue = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px rgba(0,0,0,${shadow.opacity})`;

  const fromTransform = `perspective(${params.perspective}px) rotateX(${params.rotateX}deg) rotateY(${params.rotateY}deg) rotateZ(${params.rotateZ}deg) translateZ(${params.translateZ}px) scale(${params.scale})`;
  const toTransform = 'perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale(1)';

  const copyCSS = () => {
    const css = `/* Avatar 3D Card Flip */
@keyframes avatar-flip-in {
  0% {
    transform: ${fromTransform};
    opacity: 0;
    box-shadow: none;
  }
  100% {
    transform: ${toTransform};
    opacity: 1;
    box-shadow: ${boxShadowValue};
  }
}

.avatar-flip-in {
  animation: avatar-flip-in ${params.duration}ms ${params.easing} ${params.delay}ms both;
}`;
    navigator.clipboard.writeText(css);
  };

  return (
    <div className="relative">
      {/* Avatar with 3D flip */}
      <div
        key={animKey}
        style={{
          perspective: `${params.perspective}px`,
          width: 160,
          height: 160,
        }}
      >
        <img
          src="/images/site-pic.png"
          alt="Nathan Ulrich"
          className="w-[160px] h-[160px] rounded-[12px] object-cover"
          draggable={false}
          style={{
            transform: hasAnimated ? toTransform : fromTransform,
            opacity: hasAnimated ? 1 : 0,
            boxShadow: hasAnimated ? boxShadowValue : 'none',
            transition: hasAnimated
              ? `transform ${params.duration}ms ${params.easing}, opacity ${params.duration * 0.4}ms ease, box-shadow ${params.duration}ms ${params.easing}`
              : 'none',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* Debugger toggle */}
      <button
        onClick={() => setShowDebugger((s) => !s)}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 text-xs rounded-md"
        style={{
          background: 'var(--theme-text)',
          color: 'var(--theme-bg)',
        }}
      >
        {showDebugger ? 'Hide' : 'Show'} 3D Debugger
      </button>

      {/* Debugger panel */}
      {showDebugger && (
        <div
          className="fixed top-12 right-4 z-50 w-[280px] rounded-lg p-4 space-y-3 text-xs overflow-y-auto max-h-[calc(100vh-80px)]"
          style={{
            background: 'var(--theme-bg)',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">3D Flip Debugger</span>
            <button
              onClick={replay}
              className="px-2 py-1 rounded text-xs"
              style={{
                background: 'var(--theme-text)',
                color: 'var(--theme-bg)',
              }}
            >
              Replay
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            {(['transform', 'shadow'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 px-2 py-1.5 rounded text-xs capitalize"
                style={{
                  background: activeTab === tab ? 'var(--theme-text)' : 'transparent',
                  color: activeTab === tab ? 'var(--theme-bg)' : 'var(--theme-text-secondary)',
                  border: activeTab === tab ? 'none' : '1px solid var(--theme-border)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'transform' && (
            <>
              <Slider
                label="Perspective"
                value={params.perspective}
                min={100}
                max={2000}
                step={50}
                unit="px"
                onChange={(v) => update('perspective', v)}
              />
              <Slider
                label="Rotate X"
                value={params.rotateX}
                min={-360}
                max={360}
                step={5}
                unit="deg"
                onChange={(v) => update('rotateX', v)}
              />
              <Slider
                label="Rotate Y"
                value={params.rotateY}
                min={-360}
                max={360}
                step={5}
                unit="deg"
                onChange={(v) => update('rotateY', v)}
              />
              <Slider
                label="Rotate Z"
                value={params.rotateZ}
                min={-360}
                max={360}
                step={5}
                unit="deg"
                onChange={(v) => update('rotateZ', v)}
              />
              <Slider
                label="Translate Z"
                value={params.translateZ}
                min={-500}
                max={500}
                step={10}
                unit="px"
                onChange={(v) => update('translateZ', v)}
              />
              <Slider
                label="Scale"
                value={params.scale}
                min={0}
                max={2}
                step={0.05}
                unit="x"
                onChange={(v) => update('scale', v)}
              />
              <Slider
                label="Duration"
                value={params.duration}
                min={100}
                max={3000}
                step={50}
                unit="ms"
                onChange={(v) => update('duration', v)}
              />
              <Slider
                label="Delay"
                value={params.delay}
                min={0}
                max={2000}
                step={50}
                unit="ms"
                onChange={(v) => update('delay', v)}
              />

              {/* Easing picker */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: 'var(--theme-text-secondary)' }}>Easing</span>
                </div>
                <select
                  value={params.easing}
                  onChange={(e) => update('easing', e.target.value)}
                  className="w-full px-2 py-1.5 rounded text-xs"
                  style={{
                    background: 'var(--theme-bg)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  {EASING_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current transform preview */}
              <div
                className="mt-3 p-2 rounded text-[10px] leading-relaxed break-all"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                <div className="font-medium mb-1" style={{ color: 'var(--theme-text)' }}>
                  Start transform:
                </div>
                {fromTransform}
              </div>
            </>
          )}

          {activeTab === 'shadow' && (
            <>
              <Slider
                label="Offset X"
                value={shadow.offsetX}
                min={-40}
                max={40}
                step={1}
                unit="px"
                onChange={(v) => updateShadow('offsetX', v)}
              />
              <Slider
                label="Offset Y"
                value={shadow.offsetY}
                min={-40}
                max={40}
                step={1}
                unit="px"
                onChange={(v) => updateShadow('offsetY', v)}
              />
              <Slider
                label="Blur"
                value={shadow.blur}
                min={0}
                max={80}
                step={1}
                unit="px"
                onChange={(v) => updateShadow('blur', v)}
              />
              <Slider
                label="Spread"
                value={shadow.spread}
                min={-20}
                max={20}
                step={1}
                unit="px"
                onChange={(v) => updateShadow('spread', v)}
              />
              <Slider
                label="Opacity"
                value={shadow.opacity}
                min={0}
                max={1}
                step={0.01}
                unit=""
                onChange={(v) => updateShadow('opacity', v)}
              />

              {/* Current shadow preview */}
              <div
                className="mt-3 p-2 rounded text-[10px] leading-relaxed break-all"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                <div className="font-medium mb-1" style={{ color: 'var(--theme-text)' }}>
                  box-shadow:
                </div>
                {boxShadowValue}
              </div>
            </>
          )}

          {/* Copy CSS button */}
          <button
            onClick={copyCSS}
            className="w-full px-3 py-2 rounded text-xs mt-2"
            style={{
              background: 'var(--theme-text)',
              color: 'var(--theme-bg)',
            }}
          >
            Copy CSS Keyframes
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              setParams(DEFAULT_PARAMS);
              setShadow(DEFAULT_SHADOW);
              replay();
            }}
            className="w-full px-3 py-1.5 rounded text-xs"
            style={{
              border: '1px solid var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ color: 'var(--theme-text-secondary)' }}>{label}</span>
        <span className="tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded appearance-none cursor-pointer"
        style={{
          background: 'var(--theme-border)',
          accentColor: 'var(--theme-text)',
        }}
      />
    </div>
  );
}
