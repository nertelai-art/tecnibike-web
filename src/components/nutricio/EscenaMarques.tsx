'use client';

// Escena de nutrició: un escenari fix dins d'un recorregut alt. Primer, un capítol per marca: els
// productes (fotos reals retallades) entren girant sobre si mateixos, es queden de cara i surten
// mentre entra la marca següent; el fons pren el color de la marca. Quan l'última marca és de cara,
// el capítol final és el catàleg: els seus productes surten girant, entra el fons clar i les
// targetes surten d'una en una amb un bot. La coreografia és a escena-marques.ts (pura, amb proves);
// aquí només s'escriuen estils a les refs, sense re-renderitzar React.
//
// Es fa una sola vegada: quan s'arriba al final i el scroll s'atura, el recorregut es plega i el
// catàleg queda al seu lloc com una secció normal (la pàgina no salta). Fins que no es torna a
// carregar la pàgina, no es repeteix.
//
// L'HTML del servidor és l'estat final: les marques una sota l'altra i el catàleg. És el que es veu
// sense JavaScript i amb «menys moviment».

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { destacats, imatgeDe, temaDe } from '@/content/nutricio';
import type { ProducteNutricio } from '@/lib/plataforma/esquema';
import { useReducedMotion, useScrollProgress } from '@/lib/scroll-scene';
import {
  estatCapitolEscena,
  estatCataleg,
  estatProducteEscena,
  marcaActivaEscena,
  posicioRepos,
  type EstatProducte,
} from './escena-marques';
import { Paquet } from './Paquet';
import styles from './Nutricio.module.css';

const MAX_PRODUCTES = 4;
/** Quant de temps sense scroll per donar l'escena per acabada (plegar a mig scroll el tallaria). */
const ESPERA_PLEGAR_MS = 200;
const noop = () => () => {};

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

type Props = {
  marques: readonly string[];
  productes: readonly ProducteNutricio[];
  /** En triar «Mira'n els productes» d'una marca: filtra el catàleg (l'escena hi porta). */
  onTria: (marca: string) => void;
  /** El catàleg: l'últim capítol de l'escena i, un cop plegada, una secció normal. */
  cataleg: ReactNode;
};

/** El lloc al ventall (`x`) el posa el CSS amb `--lloc`; aquí només el que es mou. */
const transformDe = (e: Pick<EstatProducte, 'y' | 'girY' | 'girZ' | 'escala'>) =>
  `translate3d(0, ${e.y.toFixed(2)}%, 0) rotateZ(${e.girZ.toFixed(2)}deg) rotateY(${e.girY.toFixed(2)}deg) scale(${e.escala.toFixed(3)})`;

export function EscenaMarques({ marques, productes, onTria, cataleg }: Props) {
  const t = useTranslations('nutricio');
  const reduit = useReducedMotion();
  const client = useSyncExternalStore(noop, () => true, () => false);
  const animada = client && !reduit;
  const total = marques.length;

  const pista = useRef<HTMLDivElement>(null);
  const escenari = useRef<HTMLDivElement>(null);
  const capCataleg = useRef<HTMLDivElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const peces = useRef<(HTMLDivElement | null)[]>([]);
  const punts = useRef<(HTMLLIElement | null)[]>([]);
  const plegada = useRef(false);
  const espera = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const perMarca = marques.map((m) => destacats(productes.filter((p) => p.marca === m), MAX_PRODUCTES));

  const dibuixa = useCallback(
    (p: number) => {
      const activa = marcaActivaEscena(p, total);
      const tema = temaDe(marques[activa]!);
      escenari.current?.style.setProperty('--fons-escena', tema.fons);
      escenari.current?.style.setProperty('--text-escena', tema.text);
      punts.current.forEach((punt, i) => punt && (punt.dataset.actiu = String(i === activa)));

      for (let m = 0; m < total; m++) {
        const text = textos.current[m];
        if (text) {
          const c = estatCapitolEscena(p, m, total);
          text.style.opacity = c.text.toFixed(3);
          text.style.transform = `translateY(${c.textY.toFixed(1)}px)`;
          text.style.visibility = c.text <= 0 ? 'hidden' : 'visible';
        }
        const quants = perMarca[m]!.length;
        for (let i = 0; i < quants; i++) {
          const peca = peces.current[m * MAX_PRODUCTES + i];
          if (!peca) continue;
          const e = estatProducteEscena(p, m, total, i, quants);
          peca.style.opacity = e.opacitat.toFixed(3);
          peca.style.transform = transformDe(e);
          peca.style.visibility = e.opacitat <= 0 ? 'hidden' : 'visible';
        }
      }

      // El catàleg: el fons clar, el títol i els filtres, i cada targeta amb el seu bot.
      const cat = capCataleg.current;
      if (cat) {
        const c = estatCataleg(p, total);
        cat.style.setProperty('--fons-cataleg', c.fons.toFixed(3));
        cat.style.setProperty('--cap', c.cap.toFixed(3));
        cat.dataset.actiu = String(c.fons >= 1);
        const targetes = cat.querySelectorAll<HTMLElement>('[data-pop]');
        targetes.forEach((targeta, i) => targeta.style.setProperty('--pop', c.pop(i, targetes.length).toFixed(3)));
        // «Veure'n més» i els botons del peu, amb l'última targeta.
        cat.style.setProperty('--peu', Math.min(1, c.pop(targetes.length - 1, targetes.length)).toFixed(3));
        escenari.current?.style.setProperty('--indicador', (1 - c.fons).toFixed(3));
      }
    },
    [total, marques, perMarca],
  );

  /** Plega el recorregut sense que la pàgina salti: el catàleg es queda on era. */
  const plega = useCallback(() => {
    const el = pista.current;
    const cat = capCataleg.current;
    if (!el || !cat || plegada.current) return;
    const abans = cat.getBoundingClientRect().top;
    plegada.current = true;
    el.dataset.plegada = 'true';
    const despres = cat.getBoundingClientRect().top;
    if (despres !== abans) window.scrollBy({ top: despres - abans, behavior: 'instant' });
  }, []);

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

  /** Porta l'escena fins a una posició del recorregut (0–1). */
  const anarAProgres = (p: number) => {
    const el = pista.current;
    if (!el) return;
    const recorregut = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + p * recorregut, behavior: 'smooth' });
  };

  /** Filtra el catàleg per la marca i hi porta: amb l'escena, fins al final del recorregut. */
  const tria = (marca: string) => {
    onTria(marca);
    if (animada && !plegada.current) anarAProgres(1);
    else capCataleg.current?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div ref={pista} className={styles.pista} data-animada={animada || undefined} style={{ '--capitols': total + 1 } as React.CSSProperties}>
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
                <button type="button" className={styles.capitolBoto} onClick={() => tria(m)}>
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
              {/* El mig del tram de cada marca: les marques fan total − ½ trams i el catàleg, un. */}
              <button type="button" onClick={() => anarAProgres((i + 0.5) / (total + 0.5))}>
                {m}
              </button>
            </li>
          ))}
        </ol>
        <div ref={capCataleg} className={styles.capitolCataleg}>
          {cataleg}
        </div>
      </div>
    </div>
  );
}
