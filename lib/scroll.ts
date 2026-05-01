function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function smoothScrollTo(targetY: number, duration = 860) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;

  const startTime = performance.now();

  function tick(now: number) {
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + diff * easeOutQuart(t));
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
