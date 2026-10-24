"use client";

import { useEffect, useRef, useState } from "react";
import { useDialKitController } from "dialkit";
import { DOT_COLORS } from "./lib/theme-definitions";
import styles from "./motion-lab.module.css";

const experiments = [
  { name: "Traveling wave", tag: "01 / FLOW", description: "A soft sine wave passes from color to color.", speed: 0.8, amplitude: 30, phase: 0.65 },
  { name: "Orbital dance", tag: "02 / ORBIT", description: "Six little planets trace overlapping ellipses.", speed: 0.65, amplitude: 38, phase: 1.05 },
  { name: "Magnetic gather", tag: "03 / ATTRACTION", description: "The row pulls into a cluster, then gently releases.", speed: 0.55, amplitude: 42, phase: 0.25 },
  { name: "Squishy ripple", tag: "04 / ELASTIC", description: "A playful pulse stretches and squeezes each dot.", speed: 0.8, amplitude: 30, phase: 0.7 },
];

function Experiment({ index, paused, replay }: { index: number; paused: boolean; replay: number }) {
  const experiment = experiments[index];
  const time = useRef(0);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [localPaused, setLocalPaused] = useState(false);
  const [localReplay, setLocalReplay] = useState(0);
  const { values, setValue, resetValues } = useDialKitController(experiment.name, {
    speed: [experiment.speed, 0.15, 2, 0.05],
    amplitude: [experiment.amplitude, 0, 60, 1],
    phase: [experiment.phase, 0, 1.5, 0.05],
    size: [28, 16, 40, 1],
    reverse: false,
  }, { id: `dot-lab-${index}`, persist: true });

  useEffect(() => { time.current = 0; }, [replay, localReplay]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    function animate(now: number) {
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!paused && !localPaused && !media.matches) time.current += delta * values.speed * (values.reverse ? -1 : 1);
      dots.current.forEach((dot, i) => {
        if (!dot) return;
        const t = time.current * Math.PI * 2;
        const phase = t - i * values.phase;
        const a = values.amplitude;
        let x = 0, y = 0, sx = 1, sy = 1;
        if (!media.matches) {
          if (index === 0) y = Math.sin(phase) * a;
          if (index === 1) { x = Math.cos(phase) * a * 0.65; y = Math.sin(phase) * a; }
          if (index === 2) {
            const pull = (1 - Math.cos(t)) / 2;
            x = (2.5 - i) * 44 * pull * (a / 60);
            y = Math.sin(i * values.phase + t) * a * 0.3 * pull;
          }
          if (index === 3) {
            const pulse = Math.pow((Math.sin(phase) + 1) / 2, 4) * a / 60;
            sx = 1 + pulse * 0.65; sy = 1 - pulse * 0.4; y = -pulse * 20;
          }
        }
        dot.style.transform = `translate(${x}px, ${y}px) scale(${sx}, ${sy})`;
      });
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [index, values.speed, values.amplitude, values.phase, values.reverse, paused, localPaused]);

  return <article className={styles.card}>
    <div className={styles.cardHeader}><span>{experiment.tag}</span><span className={styles.status}>{paused || localPaused ? "PAUSED" : "LOOPING"}</span></div>
    <div className={styles.stage} aria-label={`${experiment.name} animation preview`}>
      <div className={styles.baseline} />
      <div className={styles.dots}>{DOT_COLORS.map((color, i) => <span key={color.name} ref={el => { dots.current[i] = el; }} style={{ background: color.hex, width: values.size, height: values.size }} />)}</div>
    </div>
    <div className={styles.info}><h2>{experiment.name}</h2><p>{experiment.description}</p></div>
    <div className={styles.controls}>
      {([
        ["speed", "Speed", 0.15, 2, 0.05, "×"],
        ["amplitude", "Travel", 0, 60, 1, "px"],
        ["phase", "Phase offset", 0, 1.5, 0.05, ""],
        ["size", "Dot size", 16, 40, 1, "px"],
      ] as const).map(([key, label, min, max, step, suffix]) => <label key={key} className={styles.slider}>
        <span>{label}<output>{Number(values[key].toFixed(2))}{suffix}</output></span>
        <input aria-label={`${experiment.name} ${label}`} type="range" min={min} max={max} step={step} value={values[key]} onChange={e => setValue(key, Number(e.target.value))} />
      </label>)}
    </div>
    <div className={styles.actions}>
      <label className={styles.reverse}><input type="checkbox" checked={values.reverse} onChange={e => setValue("reverse", e.target.checked)} />Reverse</label>
      <button aria-pressed={localPaused} onClick={() => setLocalPaused(!localPaused)}>{localPaused ? "Play" : "Pause"}</button>
      <button onClick={() => setLocalReplay(v => v + 1)}>Replay</button>
      <button onClick={() => { resetValues(); setLocalPaused(false); setLocalReplay(v => v + 1); }}>Reset</button>
    </div>
  </article>;
}

export default function Home() {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  return <main className={styles.lab}>
    <header className={styles.header}>
      <div><div className={styles.eyebrow}><span className={styles.mark}>✳</span> SMALL DETAILS, BIG PERSONALITY</div><h1>Dot motion lab<span>.</span></h1><p>Six colors. Four ways to move. Find the rhythm that feels right.</p></div>
      <div className={styles.toolbar}><button onClick={() => setReplay(v => v + 1)}>↻ Replay all</button><button className={styles.primary} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "▶ Play all" : "Ⅱ Pause all"}</button></div>
    </header>
    <div className={styles.grid}>{experiments.map((experiment, index) => <Experiment key={experiment.name} index={index} paused={paused} replay={replay} />)}</div>
    <footer className={styles.footer}><span>PLAY, TUNE, REPEAT</span><span>Changes are live · Controls also available in Properties</span></footer>
  </main>;
}
