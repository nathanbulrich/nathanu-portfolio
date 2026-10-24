/** Hide the page around the persistent type selector, swap fonts, then reveal the settled layout. */
export function transitionText(root: HTMLElement, applyFont: () => void, duration: number, enabled = true) {
  const targets: HTMLElement[] = [];
  const collect = (parent: HTMLElement) => {
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement) || child.matches('[data-text-transition-ignore]')) continue;
      if (child.querySelector('[data-text-transition-ignore]') || getComputedStyle(child).display === 'contents') collect(child);
      else if (child.getClientRects().length) targets.push(child);
    }
  };
  collect(root);
  const opacity = targets.map(el => Number(getComputedStyle(el).opacity));
  let cancelled = false;
  const animations: Animation[] = [];
  const clear = () => animations.forEach(animation => animation.cancel());
  const finished = (items: Animation[]) => Promise.all(items.map(animation => animation.finished.catch(() => {})));
  const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const run = async () => {
    if (!enabled || duration === 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) { applyFont(); return; }
    const outgoing = targets.map((el, i) => el.animate([
      { opacity: opacity[i] }, { opacity: 0 },
    ], { duration: duration * .4, easing: 'ease-in', fill: 'both' }));
    animations.push(...outgoing);
    await finished(outgoing);
    if (cancelled) return;
    applyFont();
    // Keep the page invisible for two frames while the new font layout settles.
    await frame();
    await frame();
    if (cancelled) return;
    const incoming = targets.map((el, i) => el.animate([
      { opacity: 0 }, { opacity: opacity[i] },
    ], { duration: duration * .6, easing: 'ease-out', fill: 'both' }));
    animations.push(...incoming);
    outgoing.forEach(animation => animation.cancel());
    await finished(incoming);
    if (!cancelled) clear();
  };
  void run();
  return () => { cancelled = true; clear(); };
}
