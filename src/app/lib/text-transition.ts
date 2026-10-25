/** Hide the page around the persistent type selector, swap fonts, then reveal the settled layout. */
export function transitionText(root: HTMLElement, applyFont: () => void, fadeOutDuration: number, hiddenDelay: number, fadeInDuration: number, enabled = true, fadeOutBlur = 0, fadeInBlur = 0) {
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
  const filters = targets.map(el => getComputedStyle(el).filter);
  const blurred = (index: number, amount: number) =>
    `${filters[index] === 'none' ? '' : `${filters[index]} `}blur(${amount}px)`;
  let cancelled = false;
  let delayTimer: ReturnType<typeof setTimeout> | undefined;
  let releaseDelay: (() => void) | undefined;
  const animations: Animation[] = [];
  const clear = () => animations.forEach(animation => animation.cancel());
  const finished = (items: Animation[]) => Promise.all(items.map(animation => animation.finished.catch(() => {})));
  const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const run = async () => {
    if (!enabled || (fadeOutDuration === 0 && hiddenDelay === 0 && fadeInDuration === 0) || matchMedia('(prefers-reduced-motion: reduce)').matches) { applyFont(); return; }
    const outgoing = targets.map((el, i) => el.animate([
      { opacity: opacity[i], ...(fadeOutBlur > 0 ? { filter: filters[i] } : {}) },
      { opacity: 0, ...(fadeOutBlur > 0 ? { filter: blurred(i, fadeOutBlur) } : {}) },
    ], { duration: fadeOutDuration, easing: 'ease-in', fill: 'both' }));
    animations.push(...outgoing);
    await finished(outgoing);
    if (cancelled) return;
    applyFont();
    // Keep the page invisible for two frames while the new font layout settles.
    await Promise.all([
      frame().then(frame),
      new Promise<void>(resolve => {
        releaseDelay = resolve;
        delayTimer = setTimeout(resolve, hiddenDelay);
      }),
    ]);
    if (cancelled) return;
    const incoming = targets.map((el, i) => el.animate([
      { opacity: 0, ...(fadeInBlur > 0 ? { filter: blurred(i, fadeInBlur) } : {}) },
      { opacity: opacity[i], ...(fadeInBlur > 0 ? { filter: filters[i] } : {}) },
    ], { duration: fadeInDuration, easing: 'ease-out', fill: 'both' }));
    animations.push(...incoming);
    outgoing.forEach(animation => animation.cancel());
    await finished(incoming);
    if (!cancelled) clear();
  };
  void run();
  return () => { cancelled = true; clearTimeout(delayTimer); releaseDelay?.(); clear(); };
}
