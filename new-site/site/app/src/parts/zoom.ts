// Click a diagram to see it fitted to the window, as on the Hugo site. Click, Escape or scrolling closes it.
export const zoomDiagram = (fig: HTMLElement) => {
  const svg = fig.querySelector('svg');
  if (!svg || document.querySelector('.zoom-bg')) return;
  const bg = document.createElement('div');
  bg.className = 'zoom-bg';
  bg.setAttribute('role', 'dialog');
  bg.setAttribute('aria-label', fig.getAttribute('aria-label') ?? 'Diagram');
  bg.tabIndex = -1;
  const clone = svg.cloneNode(true) as SVGElement;
  clone.removeAttribute('width'); clone.removeAttribute('height');
  bg.appendChild(clone);
  const close = () => { bg.classList.remove('on'); setTimeout(() => bg.remove(), 200); removeEventListener('keydown', onKey); removeEventListener('scroll', close); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
  bg.addEventListener('click', close);
  addEventListener('keydown', onKey);
  // Scrolling closes it, as on the Hugo site; listen after the opening click has settled.
  setTimeout(() => addEventListener('scroll', close, { once: true }), 300);
  document.body.appendChild(bg);
  setTimeout(() => { bg.classList.add('on'); bg.focus({ preventScroll: true }); }, 20);
};
