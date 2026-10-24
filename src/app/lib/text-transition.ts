/** Soft-focus transition with real height interpolation so downstream content flows smoothly. */
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
      { opacity: 0, filter: 'blur(3px)' },
    ], duration * .4)) : [];
    await finished(outgoing);
    if (cancelled) return;

    // Measure actual layout heights, not transformed bounds. Animating height rather
    // than scaling glyphs lets paragraphs, images and following sections reflow together.
    const blocks = elements.filter(el => ['block', 'flow-root', 'list-item'].includes(getComputedStyle(el).display));
    const before = blocks.map(el => getComputedStyle(el).height);
    applyFont();
    const after = blocks.map(el => getComputedStyle(el).height);
    const layout = layoutAnimation && layoutDuration > 0 ? blocks.flatMap((el, i) => {
      if (before[i] === after[i] || !before[i].endsWith('px') || !after[i].endsWith('px')) return [];
      // A symmetric ease avoids the long subpixel crawl of the text fade curve.
      // Hold the exact final height briefly so removing the effect cannot shift it.
      return [animate(el, [{ height: before[i], easing: 'ease-in-out' }, { height: after[i], offset: .9 }, { height: after[i] }], layoutDuration, 'linear')];
    }) : [];
    outgoing.forEach(animation => animation.cancel());
    const incoming = textAnimation && duration > 0 ? visible.map(el => animate(el, [
      { opacity: 0, filter: 'blur(3px)' },
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
