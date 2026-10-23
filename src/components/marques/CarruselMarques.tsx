'use client';

// Carrusel de les marques de la botiga: passa sol, a poc a poc i sense final (la llista es repeteix),
// i s'atura quan s'hi posa el ratolí, el dit o el focus. També es pot moure amb les fletxes,
// arrossegant o amb el teclat. En canviar de categoria, les targetes surten i entren amb un fos.
// Cada marca obre WhatsApp per preguntar si en tenen. Amb moviment reduït no passa sol.

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { CATEGORIES_MARCA, MARQUES, type CategoriaMarca } from '@/content/marques';
import { enllacWhatsapp } from '@/lib/contacte';
import { useReducedMotion } from '@/lib/scroll-scene';
import styles from './CarruselMarques.module.css';

type Filtre = CategoriaMarca | 'totes';

/** Velocitat del pas automàtic, en px per segon. */
const VELOCITAT = 36;
/** Temps que dura la sortida de les targetes en canviar de categoria (igual que al CSS). */
const SORTIDA_MS = 280;

export function CarruselMarques() {
  const t = useTranslations('marques');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLUListElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const arrossegament = useRef<{ x: number; scroll: number; mogut: boolean } | null>(null);
  const acabaDArrossegar = useRef(false);
  const aturat = useRef({ ratoli: false, focus: false, dit: false, fletxa: 0, fora: false });
  const [filtre, setFiltre] = useState<Filtre>('totes');
  const [sortint, setSortint] = useState(false);
  const [copies, setCopies] = useState(2);

  const marques = filtre === 'totes' ? MARQUES : MARQUES.filter((m) => m.categoria === filtre);

  /** Amplada d'una llista sencera de targetes, amb els espais. */
  const ampladaLlista = (el: HTMLElement) => {
    const pas = el.querySelector('li')?.getBoundingClientRect().width ?? 0;
    return (pas + parseFloat(getComputedStyle(el).columnGap || '0')) * marques.length;
  };

  // Quantes còpies de la llista calen perquè sempre n'hi hagi més enllà de la vora dreta.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const mesura = () => {
      const amplada = ampladaLlista(el);
      if (amplada > 0) setCopies(Math.max(2, Math.ceil(el.clientWidth / amplada) + 1));
    };
    mesura();
    window.addEventListener('resize', mesura);
    return () => window.removeEventListener('resize', mesura);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- només depèn de quantes marques hi ha
  }, [marques.length]);

  // Pas automàtic i bucle infinit: en passar una llista sencera, es torna enrere exactament una
  // llista (es veu igual) i no s'arriba mai al final.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let frame = 0;
    let abans = performance.now();
    let posicio = el.scrollLeft;
    const tic = (ara: number) => {
      const dt = Math.min(0.05, (ara - abans) / 1000);
      abans = ara;
      const a = aturat.current;
      const amplada = ampladaLlista(el);
      // Si l'usuari l'ha mogut (fletxes, dit, roda), es continua des d'on l'ha deixat.
      if (Math.abs(el.scrollLeft - posicio) > 2) posicio = el.scrollLeft;
      const quiet = reduced || a.ratoli || a.focus || a.dit || a.fora || ara < a.fletxa || document.hidden;
      if (!quiet) posicio += VELOCITAT * dt;
      if (amplada > 0 && posicio >= amplada) posicio -= amplada;
      if (Math.abs(el.scrollLeft - posicio) > 0.5) el.scrollLeft = posicio;
      if (barra.current && amplada > 0) barra.current.style.transform = `scaleX(${Math.min(1, posicio / amplada)})`;
      frame = requestAnimationFrame(tic);
    };
    frame = requestAnimationFrame(tic);
    const observador = new IntersectionObserver(([e]) => {
      aturat.current.fora = !e?.isIntersecting;
    });
    observador.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observador.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- només depèn de quantes marques hi ha
  }, [marques.length, reduced]);

  const triaFiltre = (c: Filtre) => {
    if (c === filtre || sortint) return;
    if (reduced) {
      setFiltre(c);
      pista.current?.scrollTo({ left: 0 });
      return;
    }
    // Primer surten les targetes; després es canvia la llista, que entra amb un fos esglaonat.
    setSortint(true);
    window.setTimeout(() => {
      setFiltre(c);
      pista.current?.scrollTo({ left: 0 });
      setSortint(false);
    }, SORTIDA_MS);
  };

  const passa = (sentit: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    aturat.current.fletxa = performance.now() + 1600;
    // Enrere des del començament: primer se salta a la mateixa vista una llista més enllà.
    if (sentit < 0 && el.scrollLeft < el.clientWidth) el.scrollLeft += ampladaLlista(el);
    el.scrollBy({ left: sentit * el.clientWidth * 0.6, behavior: reduced ? 'auto' : 'smooth' });
  };

  // Arrossegar amb el ratolí (amb el dit ja ho fa el navegador).
  const baixa = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse') {
      aturat.current.dit = true;
      return;
    }
    if (e.button !== 0) return;
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
    if (e.pointerType !== 'mouse') window.setTimeout(() => (aturat.current.dit = false), 1800);
  };

  const repetides = Array.from({ length: copies }, (_, copia) => marques.map((m, i) => ({ m, copia, i }))).flat();

  return (
    <div className={styles.carrusel}>
      <div className={`contenidor ${styles.controls}`}>
        <div className={styles.filtres} role="group" aria-label={t('filtre')}>
          {(['totes', ...CATEGORIES_MARCA] as const).map((c) => (
            <button key={c} type="button" aria-pressed={filtre === c} onClick={() => triaFiltre(c)}>
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <div className={styles.fletxes}>
          <button type="button" onClick={() => passa(-1)} aria-label={t('anterior')}>
            ←
          </button>
          <button type="button" onClick={() => passa(1)} aria-label={t('seguent')}>
            →
          </button>
        </div>
      </div>

      <ul
        ref={pista}
        className={styles.pista}
        data-sortint={sortint || undefined}
        tabIndex={0}
        aria-label={t('carrusel', { n: marques.length })}
        onPointerDown={baixa}
        onPointerMove={mou}
        onPointerUp={deixa}
        onPointerCancel={deixa}
        onMouseEnter={() => (aturat.current.ratoli = true)}
        onMouseLeave={() => (aturat.current.ratoli = false)}
        onFocus={() => (aturat.current.focus = true)}
        onBlur={() => (aturat.current.focus = false)}
        onClickCapture={(e) => {
          if (acabaDArrossegar.current) {
            e.preventDefault();
            e.stopPropagation();
            acabaDArrossegar.current = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {repetides.map(({ m, copia, i }) => (
          // Les còpies només hi són per al bucle: el lector de pantalla llegeix la primera.
          <li key={`${filtre}-${copia}-${m.nom}`} aria-hidden={copia > 0 || undefined} style={{ '--i': Math.min(i, 8) } as CSSProperties}>
            <a
              className={styles.targeta}
              href={enllacWhatsapp(t('missatge', { marca: m.nom }))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('pregunta', { marca: m.nom })}
              tabIndex={copia > 0 ? -1 : undefined}
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
      </div>
    </div>
  );
}
