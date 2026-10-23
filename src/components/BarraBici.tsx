'use client';

// Barra de scroll de la pàgina d'inici: una bici real (la Pinarello de la flota, retallada en capes)
// baixa per la vora dreta a mesura que es fa scroll, i les rodes giren la distància que recorre,
// com si rodés per la vora de la pantalla. Es pot arrossegar com el polze d'una barra normal.
// Només amb ratolí i pantalla ampla; si no, queda la barra del navegador (CSS a globals.css).

import { useEffect, useRef, type PointerEvent } from 'react';
import styles from './BarraBici.module.css';

/** Llargada de la bici a la pantalla, en px (va en vertical). */
const LLARG = 96;
/** Mesures de la foto, en fraccions de la llargada (scripts de recursos: capes de la bici). */
const PROPORCIO = 224 / 360;
const RODES = [
  { src: '/img/bici-scroll/roda-darrera.webp', x: 0.2231, y: 0.6546, d: 0.4324 },
  { src: '/img/bici-scroll/roda-davant.webp', x: 0.7817, y: 0.6499, d: 0.4288 },
];

export function BarraBici() {
  const barra = useRef<HTMLDivElement>(null);
  const bici = useRef<HTMLDivElement>(null);
  const rodes = useRef<(HTMLImageElement | null)[]>([]);
  const arrossega = useRef<{ desplaçament: number } | null>(null);

  // Posició i gir directament del scroll, sense inèrcia: la bici només es mou quan es mou la pàgina.
  useEffect(() => {
    let frame = 0;
    const pinta = () => {
      frame = 0;
      const maxim = document.documentElement.scrollHeight - window.innerHeight;
      const progres = maxim > 0 ? Math.min(1, Math.max(0, window.scrollY / maxim)) : 0;
      const recorregut = (barra.current?.clientHeight ?? window.innerHeight) - LLARG;
      const y = progres * recorregut;
      if (bici.current) bici.current.style.transform = `translate3d(0, ${y}px, 0)`;
      rodes.current.forEach((roda, i) => {
        const radi = ((RODES[i]?.d ?? 0.43) * LLARG) / 2;
        if (roda) roda.style.transform = `rotate(${(y / radi) * (180 / Math.PI)}deg)`;
      });
    };
    const programa = () => {
      if (!frame) frame = requestAnimationFrame(pinta);
    };
    pinta();
    window.addEventListener('scroll', programa, { passive: true });
    window.addEventListener('resize', programa);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', programa);
      window.removeEventListener('resize', programa);
    };
  }, []);

  const anarA = (clientY: number, suau: boolean) => {
    const caixa = barra.current?.getBoundingClientRect();
    if (!caixa) return;
    const progres = Math.min(1, Math.max(0, (clientY - caixa.top - (arrossega.current?.desplaçament ?? LLARG / 2)) / (caixa.height - LLARG)));
    const maxim = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: progres * maxim, behavior: suau ? 'smooth' : 'instant' });
  };

  const baixa = (e: PointerEvent<HTMLDivElement>) => {
    const caixa = bici.current?.getBoundingClientRect();
    if (!caixa) return;
    e.preventDefault();
    if (e.target instanceof Node && bici.current?.contains(e.target)) {
      // Agafada per la bici: es manté el punt on s'ha agafat.
      arrossega.current = { desplaçament: e.clientY - caixa.top };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.arrossegant = 'true';
    } else {
      anarA(e.clientY, true);
    }
  };
  const mou = (e: PointerEvent<HTMLDivElement>) => {
    if (arrossega.current) anarA(e.clientY, false);
  };
  const deixa = (e: PointerEvent<HTMLDivElement>) => {
    arrossega.current = null;
    delete e.currentTarget.dataset.arrossegant;
  };

  return (
    <div ref={barra} className={styles.barra} data-barra-bici="" aria-hidden="true" onPointerDown={baixa} onPointerMove={mou} onPointerUp={deixa} onPointerCancel={deixa}>
      <div className={styles.carril} />
      <div ref={bici} className={styles.bici} style={{ width: LLARG * PROPORCIO, height: LLARG }}>
        {/* La bici és horitzontal a la foto: es gira perquè la roda del davant quedi avall. */}
        <div className={styles.giratori} style={{ width: LLARG, height: LLARG * PROPORCIO }}>
          {RODES.map((r, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- capes petites que giren per CSS
            <img
              key={r.src}
              ref={(el) => {
                rodes.current[i] = el;
              }}
              src={r.src}
              alt=""
              draggable={false}
              className={styles.roda}
              style={{ left: `${(r.x - r.d / 2) * 100}%`, top: `${r.y * 100}%`, width: `${r.d * 100}%`, marginTop: -(r.d * LLARG) / 2 }}
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element -- capa del quadre, per sobre de les rodes */}
          <img src="/img/bici-scroll/quadre.webp" alt="" draggable={false} className={styles.quadre} />
        </div>
      </div>
    </div>
  );
}
