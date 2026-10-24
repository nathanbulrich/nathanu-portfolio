export type TextTransition = "Soft focus" | "Typesetter shift" | "Ink impression" | "Directional wipe" | "Layout glide";

/** Animate text blocks only; never clone interactive content or animate images. */
export function transitionText(root: HTMLElement, applyFont: () => void, direction: TextTransition, duration: number) {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6, a, button, label, li, span'))
    .filter(el => el.textContent?.trim() && !el.closest('[data-text-transition-ignore]') && !el.querySelector('img, video, canvas') && el.getClientRects().length);
  const elements = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el)));
  const visible = elements.filter(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
  let cancelled = false;
  let animations: Animation[] = [];
  const play = (frames: Keyframe[], time: number) => {
    animations = visible.map(el => el.animate(frames, { duration: time, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
    return Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  };
  const clear = () => animations.forEach(animation => animation.cancel());
  const run = async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || duration === 0) { applyFont(); return; }
    if (direction === 'Layout glide') {
      const before = visible.map(el => el.getBoundingClientRect());
      applyFont();
      animations = visible.map((el, i) => {
        const after = el.getBoundingClientRect();
        return el.animate([
          { transformOrigin: 'top left', transform: `translate(${before[i].x - after.x}px, ${before[i].y - after.y}px) scale(${after.width ? before[i].width / after.width : 1}, ${after.height ? before[i].height / after.height : 1})` },
          { transformOrigin: 'top left', transform: 'none' },
        ], { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
      return;
    }
    const outgoing: Record<Exclude<TextTransition, 'Layout glide'>, Keyframe[]> = {
      'Soft focus': [{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(3px)' }],
      'Typesetter shift': [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-5px)' }],
      'Ink impression': [{ opacity: 1 }, { opacity: 0 }],
      'Directional wipe': [{ clipPath: 'inset(-10% -3% -10% -3%)' }, { clipPath: 'inset(-10% -3% -10% 103%)' }],
    };
    await play(outgoing[direction], duration * .4);
    if (cancelled) return;
    applyFont();
    clear();
    const incoming: Record<Exclude<TextTransition, 'Layout glide'>, Keyframe[]> = {
      'Soft focus': [{ opacity: 0, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0px)' }],
      'Typesetter shift': [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(-1px)', offset: .75 }, { opacity: 1, transform: 'translateY(0)' }],
      'Ink impression': [{ opacity: 0, textShadow: '0 0 1px currentColor' }, { opacity: 1, textShadow: '0 0 0.6px currentColor', offset: .6 }, { opacity: 1, textShadow: '0 0 0px transparent' }],
      'Directional wipe': [{ clipPath: 'inset(-10% 103% -10% -3%)' }, { clipPath: 'inset(-10% -3% -10% -3%)' }],
    };
    await play(incoming[direction], duration * .6);
    if (!cancelled) clear();
  };
  void run();
  return () => { cancelled = true; clear(); };
}
