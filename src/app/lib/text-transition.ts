/** Soft-focus text with a single layout change and compositor-only position interpolation. */
export function transitionText(root: HTMLElement, applyFont: () => void, duration: number, layoutDuration: number, textAnimation = true, layoutAnimation = true) {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6, a, button, label, li, span'))
    .filter(el => el.textContent?.trim() && !el.closest('[data-text-transition-ignore]') && !el.querySelector('img, video, canvas') && el.getClientRects().length);
  const elements = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el)));
  const visible = elements.filter(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
  const opacity = new Map(visible.map(el => [el, Number(getComputedStyle(el).opacity)]));
  let cancelled = false;
  const animations: Animation[] = [];
  const animate = (el: HTMLElement, frames: Keyframe[], time: number, easing = 'cubic-bezier(.22,1,.36,1)') => {
    const animation = el.animate(frames, { duration: time, easing, fill: 'both' });
    animations.push(animation);
    return animation;
  };
  const finished = (items: Animation[]) => Promise.all(items.map(animation => animation.finished.catch(() => {})));
  const clear = () => animations.forEach(animation => animation.cancel());
  const run = async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || (!textAnimation && !layoutAnimation)) { applyFont(); return; }
    const outgoing = textAnimation && duration > 0 ? visible.map(el => animate(el, [
      { opacity: opacity.get(el), filter: 'blur(0px)' },
      { opacity: 0, filter: 'blur(1.5px)' },
    ], duration * .4)) : [];
    await finished(outgoing);
    if (cancelled) return;

    // Measure once on either side of the font swap. Never animate height: that
    // reflows all following content each frame and repeatedly rasterizes images.
    const blocks = [...new Set([
      ...elements,
      ...root.querySelectorAll<HTMLElement>('main > div > *, main .card-border, main img, main svg, header, footer'),
    ])].filter(el => !el.closest('[data-text-transition-ignore]') && el.getClientRects().length && getComputedStyle(el).display !== 'inline');
    const before = new Map(blocks.map(el => [el, el.getBoundingClientRect()]));
    applyFont();
    const offsets = new Map(blocks.map(el => {
      const first = before.get(el)!;
      const last = el.getBoundingClientRect();
      return [el, { x: first.x - last.x, y: first.y - last.y }];
    }));
    const layout = layoutAnimation && layoutDuration > 0 ? blocks.flatMap(el => {
      const delta = offsets.get(el)!;
      let parent = el.parentElement;
      while (parent && !offsets.has(parent)) parent = parent.parentElement;
      const inherited = parent ? offsets.get(parent)! : { x: 0, y: 0 };
      // Subtract the ancestor's movement so nested text doesn't move twice.
      const x = delta.x - inherited.x;
      const y = delta.y - inherited.y;
      if (Math.abs(x) < .01 && Math.abs(y) < .01) return [];
      return [animate(el, [
        { translate: `${x}px ${y}px`, willChange: 'translate', easing: 'ease-in-out' },
        { translate: '0px 0px', willChange: 'translate', offset: .9 },
        { translate: '0px 0px', willChange: 'translate' },
      ], layoutDuration, 'linear')];
    }) : [];
    outgoing.forEach(animation => animation.cancel());
    const incoming = textAnimation && duration > 0 ? visible.map(el => animate(el, [
      { opacity: 0, filter: 'blur(1.5px)' },
      { opacity: opacity.get(el), filter: 'none' },
    ], duration * .6)) : [];
    // Do not keep blur(0) compositing on sharp text while the layout settles.
    await finished(incoming);
    incoming.forEach(animation => animation.cancel());
    await finished(layout);
    if (!cancelled) clear();
  };
  void run();
  return () => { cancelled = true; clear(); };
}
