'use client';

// Carrusel de les marques de la botiga: es passa amb les fletxes, arrossegant amb el ratolí, amb el
// dit o amb el teclat (la pista és una regió amb scroll). Es pot filtrar per categoria. Cada marca
// obre WhatsApp per preguntar si en tenen.

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { CATEGORIES_MARCA, MARQUES, type CategoriaMarca } from '@/content/marques';
import { enllacWhatsapp } from '@/lib/contacte';
import { useReducedMotion } from '@/lib/scroll-scene';
import styles from './CarruselMarques.module.css';

type Filtre = CategoriaMarca | 'totes';

export function CarruselMarques() {
  const t = useTranslations('marques');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLUListElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const arrossegament = useRef<{ x: number; scroll: number; mogut: boolean } | null>(null);
  const acabaDArrossegar = useRef(false);
  const [filtre, setFiltre] = useState<Filtre>('totes');
  const [extrems, setExtrems] = useState({ inici: true, final: false });

  const marques = filtre === 'totes' ? MARQUES : MARQUES.filter((m) => m.categoria === filtre);

  // Fletxes i barra de progrés segons on és la pista.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let frame = 0;
    const mesura = () => {
      frame = 0;
      const maxim = el.scrollWidth - el.clientWidth;
      const progres = maxim > 0 ? el.scrollLeft / maxim : 1;
      if (barra.current) {
        barra.current.style.width = `${Math.min(100, (el.clientWidth / el.scrollWidth) * 100)}%`;
        barra.current.style.left = `${progres * (100 - (el.clientWidth / el.scrollWidth) * 100)}%`;
      }
      setExtrems({ inici: el.scrollLeft <= 2, final: el.scrollLeft >= maxim - 2 });
    };
    const programa = () => {
      if (!frame) frame = requestAnimationFrame(mesura);
    };
    el.scrollTo({ left: 0 });
    mesura();
    el.addEventListener('scroll', programa, { passive: true });
    window.addEventListener('resize', programa);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', programa);
      window.removeEventListener('resize', programa);
    };
  }, [filtre]);

  const passa = (sentit: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: sentit * el.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  };

  // Arrossegar amb el ratolí (amb el dit ja ho fa el navegador).
  const baixa = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrossegament.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft, mogut: false };
  };
  const mou = (e: PointerEvent<HTMLUListElement>) => {
    const a = arrossegament.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    if (!a.mogut && Math.abs(dx) > 5) {
      a.mogut = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.arrossegant = 'true';
    }
    if (a.mogut) e.currentTarget.scrollLeft = a.scroll - dx;
  };
  const deixa = (e: PointerEvent<HTMLUListElement>) => {
    acabaDArrossegar.current = arrossegament.current?.mogut ?? false;
    arrossegament.current = null;
    delete e.currentTarget.dataset.arrossegant;
  };

  return (
    <div className={styles.carrusel}>
      <div className={`contenidor ${styles.controls}`}>
        <div className={styles.filtres} role="group" aria-label={t('filtre')}>
          {(['totes', ...CATEGORIES_MARCA] as const).map((c) => (
            <button key={c} type="button" aria-pressed={filtre === c} onClick={() => setFiltre(c)}>
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <div className={styles.fletxes}>
          <button type="button" onClick={() => passa(-1)} disabled={extrems.inici} aria-label={t('anterior')}>
            ←
          </button>
          <button type="button" onClick={() => passa(1)} disabled={extrems.final} aria-label={t('seguent')}>
            →
          </button>
        </div>
      </div>

      <ul
        ref={pista}
        className={styles.pista}
        tabIndex={0}
        aria-label={t('carrusel', { n: marques.length })}
        onPointerDown={baixa}
        onPointerMove={mou}
        onPointerUp={deixa}
        onPointerCancel={deixa}
        onClickCapture={(e) => {
          if (acabaDArrossegar.current) {
            e.preventDefault();
            e.stopPropagation();
            acabaDArrossegar.current = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {marques.map((m) => (
          <li key={m.nom}>
            <a
              className={styles.targeta}
              href={enllacWhatsapp(t('missatge', { marca: m.nom }))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('pregunta', { marca: m.nom })}
            >
              <span className={styles.logo}>
                {m.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats)
                  <img src={`/img/marques/${m.logo}`} alt="" loading="lazy" draggable={false} data-vector={m.logo.endsWith('.svg') || undefined} />
                ) : (
                  <span className={styles.logoText}>{m.nom}</span>
                )}
              </span>
              <span className={styles.peu}>
                <strong>{m.nom}</strong>
                <span>{m.tipus.map((tipus) => t(`tipus.${tipus}`)).join(' · ')}</span>
              </span>
              <span className={styles.preguntar} aria-hidden="true">
                {t('preguntar')} →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className={`contenidor ${styles.peuCarrusel}`}>
        <div className={styles.progres} aria-hidden="true">
          <div ref={barra} />
        </div>
        <p className={styles.ajuda}>{t('pista')}</p>
      </div>
    </div>
  );
}
