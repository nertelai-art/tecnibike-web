'use client';

// Escena de les marques de nutrició: un escenari fix dins d'un recorregut alt, amb un capítol per
// marca. Amb el scroll, els productes de cada marca (fotos reals retallades) entren girant sobre si
// mateixos, es queden de cara i surten mentre entra la marca següent; el fons pren el color de la
// marca. La coreografia és a escena-marques.ts (pura, amb proves); aquí només s'escriuen
// `transform` i `opacity` a les refs, sense re-renderitzar React.
//
// Es fa una sola vegada: quan s'arriba al final i el scroll s'atura, el recorregut es plega a
// l'alçada de l'escenari (compensant la posició perquè la pàgina no salti) i queda com un aparador
// de marques, on l'indicador de baix canvia de marca amb el mateix gir. Fins que no es torna a
// carregar la pàgina, no es repeteix.
//
// L'HTML del servidor és l'estat final de cada capítol, un sota l'altre: és el que es veu sense
// JavaScript i amb «menys moviment».

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { destacats, imatgeDe, temaDe } from '@/content/nutricio';
import type { ProducteNutricio } from '@/lib/plataforma/esquema';
import { useReducedMotion, useScrollProgress } from '@/lib/scroll-scene';
import { estatCapitol, estatProducte, marcaActiva, posicioRepos, type EstatProducte } from './escena-marques';
import { Paquet } from './Paquet';
import styles from './Nutricio.module.css';

const MAX_PRODUCTES = 4;
/** Quant de temps sense scroll per donar l'escena per acabada (plegar a mig scroll el tallaria). */
const ESPERA_PLEGAR_MS = 200;
/** Durada del canvi de marca a l'aparador, un cop plegada. */
const CANVI_MS = 900;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Si la foto és més ampla que alta (una caixa, una barreta), la peça es fa ampla. */
function marcaForma(img: HTMLImageElement | null) {
  if (!img) return;
  const aplica = () => {
    const peca = img.closest<HTMLElement>('[data-tipus]');
    if (peca && img.naturalWidth > img.naturalHeight * 1.1) peca.dataset.ample = 'true';
  };
  if (img.complete) aplica();
  else img.addEventListener('load', aplica, { once: true });
}
const noop = () => () => {};

type Props = {
  marques: readonly string[];
  productes: readonly ProducteNutricio[];
  /** En triar «Mira'n els productes» d'una marca. */
  onTria: (marca: string) => void;
};

/** El lloc al ventall (`x`) el posa el CSS amb `--lloc`; aquí només el que es mou. */
const transformDe = (e: Pick<EstatProducte, 'y' | 'girY' | 'girZ' | 'escala'>) =>
  `translate3d(0, ${e.y.toFixed(2)}%, 0) rotateZ(${e.girZ.toFixed(2)}deg) rotateY(${e.girY.toFixed(2)}deg) scale(${e.escala.toFixed(3)})`;

export function EscenaMarques({ marques, productes, onTria }: Props) {
  const t = useTranslations('nutricio');
  const reduit = useReducedMotion();
  const client = useSyncExternalStore(noop, () => true, () => false);
  const animada = client && !reduit;
  const total = marques.length;

  const pista = useRef<HTMLDivElement>(null);
  const escenari = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const peces = useRef<(HTMLDivElement | null)[]>([]);
  const punts = useRef<(HTMLLIElement | null)[]>([]);

  const perMarca = marques.map((m) => destacats(productes.filter((p) => p.marca === m), MAX_PRODUCTES));
  /** Plegada: ja no segueix el scroll; ensenya `marca` i, mentre canvia, la que se'n va. */
  const plegada = useRef<{ marca: number; anim: number } | null>(null);
  const espera = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * Pinta una marca. `pm`, `mm` i `tot` són els paràmetres del model: amb el scroll, el progrés real,
   * la marca i el total; en canviar de marca a l'aparador, una marca «del mig» d'un recorregut de
   * tres, que entra i surt (la primera i l'última del de debò no ho fan). `null`: amagada.
   */
  const pintaMarca = useCallback(
    (m: number, model: { pm: number; mm: number; tot: number } | null) => {
      const text = textos.current[m];
      const c = model ? estatCapitol(model.pm, model.mm, model.tot) : { text: 0, textY: 0 };
      if (text) {
        text.style.opacity = c.text.toFixed(3);
        text.style.transform = `translateY(${c.textY.toFixed(1)}px)`;
        text.style.visibility = c.text <= 0 ? 'hidden' : 'visible';
      }
      const quants = perMarca[m]!.length;
      for (let i = 0; i < quants; i++) {
        const peca = peces.current[m * MAX_PRODUCTES + i];
        if (!peca) continue;
        const e = model ? estatProducte(model.pm, model.mm, model.tot, i, quants) : null;
        const opacitat = e?.opacitat ?? 0;
        peca.style.opacity = opacitat.toFixed(3);
        if (e) peca.style.transform = transformDe(e);
        peca.style.visibility = opacitat <= 0 ? 'hidden' : 'visible';
      }
    },
    [perMarca],
  );

  /** Marca el fons i l'indicador amb la marca activa. */
  const activa = useCallback(
    (m: number) => {
      const tema = temaDe(marques[m]!);
      escenari.current?.style.setProperty('--fons-escena', tema.fons);
      escenari.current?.style.setProperty('--text-escena', tema.text);
      punts.current.forEach((punt, i) => punt && (punt.dataset.actiu = String(i === m)));
    },
    [marques],
  );

  const dibuixa = useCallback(
    (p: number) => {
      activa(marcaActiva(p, total));
      for (let m = 0; m < total; m++) pintaMarca(m, { pm: p, mm: m, tot: total });
    },
    [total, activa, pintaMarca],
  );

  /** Plega el recorregut sense que la pàgina salti: el que hi ha a sota es queda on era. */
  const plega = useCallback(() => {
    const el = pista.current;
    if (!el || plegada.current) return;
    const abans = el.getBoundingClientRect().bottom;
    plegada.current = { marca: total - 1, anim: 0 };
    el.dataset.plegada = 'true';
    const despres = el.getBoundingClientRect().bottom;
    if (despres !== abans) window.scrollBy({ top: despres - abans, behavior: 'instant' });
    dibuixa(1);
  }, [dibuixa, total]);

  const pinta = useCallback(
    (p: number) => {
      if (!animada || plegada.current) return;
      dibuixa(p);
      clearTimeout(espera.current);
      if (p >= 1) espera.current = setTimeout(plega, ESPERA_PLEGAR_MS);
    },
    [animada, dibuixa, plega],
  );
  useEffect(() => () => clearTimeout(espera.current), []);
  const progres = useScrollProgress(pista, pinta);
  // En hidratar (o si canvia el moviment reduït), el primer fotograma sense esperar cap scroll.
  useEffect(() => pinta(progres.current), [pinta, progres]);

  /** Porta l'escena al mig del capítol d'una marca: amb el scroll, o ja plegada, girant-hi. */
  const anarA = (i: number) => {
    const el = pista.current;
    if (!el || !animada) return onTria(marques[i]!);
    const fet = plegada.current;
    if (fet) {
      if (fet.marca === i) return;
      cancelAnimationFrame(fet.anim);
      const surt = fet.marca;
      fet.marca = i;
      activa(i);
      // Directe, sense passar per les marques del mig: la que hi ha surt girant i entra la triada.
      // Al model, una marca del mig d'un recorregut de tres: t (local) → p = (t + 1) / 3.
      const delMig = (t: number) => ({ pm: (t + 1) / 3, mm: 1, tot: 3 });
      let inici: number | undefined;
      const pas = (ara: number) => {
        inici ??= ara;
        const k = easeInOut(Math.min(1, (ara - inici) / CANVI_MS));
        for (let m = 0; m < total; m++) {
          if (m === surt) pintaMarca(m, delMig(0.5 + 0.8 * k));
          else if (m === i) pintaMarca(m, delMig(-0.15 + 0.65 * k));
          else pintaMarca(m, null);
        }
        if (k < 1) fet.anim = requestAnimationFrame(pas);
      };
      fet.anim = requestAnimationFrame(pas);
      return;
    }
    const recorregut = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / total) * recorregut, behavior: 'smooth' });
  };

  return (
    <div ref={pista} className={styles.pista} data-animada={animada || undefined} style={{ '--capitols': total } as React.CSSProperties}>
      <div ref={escenari} className={styles.escenari}>
        <p className="sr-only">{t('escenaSr')}</p>
        {marques.map((m, mi) => {
          const tema = temaDe(m);
          const seus = productes.filter((p) => p.marca === m).length;
          return (
            <div key={m} className={styles.capitol} data-marca={tema.clau} style={{ '--fons': tema.fons, '--text': tema.text, '--accent': tema.accent } as React.CSSProperties}>
              <div className={styles.capitolText} ref={(el) => void (textos.current[mi] = el)}>
                <p className={styles.capitolNumero}>
                  {String(mi + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span>
                </p>
                <h3 className={styles.capitolNom}>{m}</h3>
                <p className={styles.capitolLema}>{t.has(`marques.${tema.clau}`) ? t(`marques.${tema.clau}`) : ''}</p>
                <button type="button" className={styles.capitolBoto} onClick={() => onTria(m)}>
                  {t('veure', { n: seus })} <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className={styles.capitolProductes} aria-hidden="true">
                {perMarca[mi]!.map((p, i) => {
                  const sabor = p.sabors[0]!.id;
                  const img = imatgeDe(p, sabor);
                  const repos = posicioRepos(i, perMarca[mi]!.length);
                  return (
                    <div
                      key={p.id}
                      className={styles.peca}
                      data-tipus={p.tipus}
                      ref={(el) => void (peces.current[mi * MAX_PRODUCTES + i] = el)}
                      style={{ '--lloc': repos.x, transform: transformDe({ ...repos, girY: 0, escala: 1 }) } as React.CSSProperties}
                    >
                      <div className={styles.cara}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- retalls petits amb transparència, girats en 3D */}
                        {img ? <img ref={marcaForma} src={img} alt="" loading="lazy" decoding="async" /> : <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={sabor} />}
                      </div>
                      <div className={styles.dors}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- el dors: la mateixa silueta, fosca */}
                        {img ? <img src={img} alt="" loading="lazy" decoding="async" /> : <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={sabor} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <ol className={styles.indicador} aria-label={t('marca')}>
          {marques.map((m, i) => (
            <li key={m} ref={(el) => void (punts.current[i] = el)} data-actiu={i === 0}>
              <button type="button" onClick={() => anarA(i)}>
                {m}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
