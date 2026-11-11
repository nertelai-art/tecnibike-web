'use client';

// Escena de les marques de nutrició: un escenari fix dins d'un recorregut alt, amb un capítol per
// marca. Amb el scroll, els productes de cada marca (fotos reals retallades) entren girant sobre si
// mateixos, es queden de cara i surten mentre entra la marca següent; el fons pren el color de la
// marca. La coreografia és a escena-marques.ts (pura, amb proves); aquí només s'escriuen
// `transform` i `opacity` a les refs, sense re-renderitzar React.
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

  const pinta = useCallback(
    (p: number) => {
      if (!animada) return;
      const activa = marcaActiva(p, total);
      const tema = temaDe(marques[activa]!);
      escenari.current?.style.setProperty('--fons-escena', tema.fons);
      escenari.current?.style.setProperty('--text-escena', tema.text);
      punts.current.forEach((punt, i) => punt && (punt.dataset.actiu = String(i === activa)));
      for (let m = 0; m < total; m++) {
        const text = textos.current[m];
        if (text) {
          const c = estatCapitol(p, m, total);
          text.style.opacity = c.text.toFixed(3);
          text.style.transform = `translateY(${c.textY.toFixed(1)}px)`;
          text.style.visibility = c.text <= 0 ? 'hidden' : 'visible';
        }
        const quants = perMarca[m]!.length;
        for (let i = 0; i < quants; i++) {
          const peca = peces.current[m * MAX_PRODUCTES + i];
          if (!peca) continue;
          const e = estatProducte(p, m, total, i, quants);
          peca.style.opacity = e.opacitat.toFixed(3);
          peca.style.transform = transformDe(e);
          peca.style.visibility = e.opacitat <= 0 ? 'hidden' : 'visible';
        }
      }
    },
    [animada, total, marques, perMarca],
  );
  const progres = useScrollProgress(pista, pinta);
  // En hidratar (o si canvia el moviment reduït), el primer fotograma sense esperar cap scroll.
  useEffect(() => pinta(progres.current), [pinta, progres]);

  /** Porta l'escena al mig del capítol d'una marca. */
  const anarA = (i: number) => {
    const el = pista.current;
    if (!el || !animada) return onTria(marques[i]!);
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
