'use client';

// Fitxa d'un producte de nutrició en un diàleg, en clicar-ne la targeta: la foto gran en el color de
// la marca, el sabor (que canvia la foto), per a què és i quan es pren, els valors per unitat i la
// resta de la fitxa (ingredients, al·lèrgens, com es pren). Només surt el que hi ha: els valors i
// els textos són els camps que la botiga omple al catàleg de la plataforma, i no se n'inventa cap.
// És només informació: ni preu ni «afegeix» (25-11-2026). Per afegir-ne, la reserva de lloguer.
//
// <dialog> natiu: atrapa el focus, es tanca amb Escape o clicant fora, i torna el focus a la targeta.

import { useTranslations } from 'next-intl';
import { nomSabor as nomSaborDe } from '@/lib/nom-traduit';
import { useEffect, useRef, type CSSProperties } from 'react';
import { colorSabor, descripcioDe, imatgeDe, temaDe } from '@/content/nutricio';
import type { ProducteNutricio } from '@/lib/plataforma/esquema';
import { Paquet } from './Paquet';
import styles from './DetallProducte.module.css';

type Props = {
  producte: ProducteNutricio | null;
  sabor: string | null;
  onSabor: (sabor: string) => void;
  onTanca: () => void;
};

export function DetallProducte({ producte, sabor, onSabor, onTanca }: Props) {
  const t = useTranslations('nutricio');
  const dialeg = useRef<HTMLDialogElement>(null);

  // Obert mentre hi ha producte; la pàgina de sota no fa scroll.
  useEffect(() => {
    const d = dialeg.current;
    if (!d) return;
    if (producte && !d.open) d.showModal();
    if (!producte && d.open) d.close();
    document.documentElement.style.overflow = producte ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [producte]);

  const p = producte;
  const triat = p ? (sabor ?? p.sabors[0]!.id) : null;
  const tema = temaDe(p?.marca ?? '');
  const img = p && triat ? imatgeDe(p, triat) : undefined;
  const nomSabor = (s: string) => (p ? nomSaborDe(p.sabors, s, t) : '');

  const valors = p
    ? ([
        ['kcal', p.kcal, t('detall.unitatKcal', { n: p.kcal ?? 0 })],
        ['carbohidrats', p.carbohidratsG, t('detall.unitatG', { n: p.carbohidratsG ?? 0 })],
        ['sucres', p.sucresG, t('detall.unitatG', { n: p.sucresG ?? 0 })],
        ['proteines', p.proteinesG, t('detall.unitatG', { n: p.proteinesG ?? 0 })],
        ['sodi', p.sodiMg, t('detall.unitatMg', { n: p.sodiMg ?? 0 })],
        ['cafeina', p.cafeinaMg, t('detall.unitatMg', { n: p.cafeinaMg ?? 0 })],
      ] as const).filter(([, v]) => v !== undefined)
    : [];
  const textos = p
    ? ([
        ['modeUs', p.modeUs],
        ['ingredients', p.ingredients],
        ['alergens', p.alergens],
      ] as const).filter(([, v]) => v)
    : [];

  return (
    <dialog
      ref={dialeg}
      className={styles.dialeg}
      aria-labelledby="detall-nutricio-nom"
      onClose={onTanca}
      onClick={(event) => {
        // Clicar el fons (fora de la capsa) el tanca.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      style={{ '--marca': tema.fons, '--marca-text': tema.text, '--marca-accent': tema.accent } as CSSProperties}
    >
      {p && triat && (
        <div className={styles.capsa}>
          <button type="button" className={styles.tancar} aria-label={t('detall.tancar')} onClick={() => dialeg.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>

          <div className={styles.foto}>
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element -- retalls amb transparència
              <img key={img} src={img} alt={`${p.marca} ${p.nom} · ${nomSabor(triat)}`} />
            ) : (
              <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={triat} nomSabor={nomSabor(triat)} />
            )}
            {p.cafeinaMg !== undefined && <span className={styles.cafeina}>{t('cafeina', { mg: p.cafeinaMg })}</span>}
          </div>

          <div className={styles.cos}>
            {p.marca && <p className={styles.marca}>{p.marca}</p>}
            <h2 id="detall-nutricio-nom" className={styles.nom}>
              {p.nom}
            </h2>
            <p className={styles.etiquetes}>
              <span>{t(`detall.tipus.${p.tipus}`)}</span>
              {p.format && <span>{p.format}</span>}
              {p.moments.map((m) => (
                <span key={m} data-moment>
                  {t(`moments.${m}`)}
                </span>
              ))}
            </p>

            {descripcioDe(p, t) && <p className={styles.descripcio}>{descripcioDe(p, t)}</p>}

            {p.sabors.length > 1 ? (
              <fieldset className={styles.sabors}>
                <legend>
                  {t('sabor')}: <strong>{nomSabor(triat)}</strong>
                </legend>
                <div role="radiogroup" aria-label={t('saborDe', { producte: p.nom })}>
                  {p.sabors.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={triat === s.id}
                      onClick={() => onSabor(s.id)}
                      style={{ '--sabor': colorSabor(s.id, s.nom) } as CSSProperties}
                    >
                      <span aria-hidden="true" />
                      {nomSabor(s.id)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              nomSabor(triat) && (
                <p className={styles.saborUnic}>
                  {t('sabor')}: <strong>{nomSabor(triat)}</strong>
                </p>
              )
            )}

            <h3 className={styles.subtitol}>{t('detall.valors')}</h3>
            {valors.length > 0 ? (
              <dl className={styles.valors}>
                {valors.map(([clau, , text]) => (
                  <div key={clau}>
                    <dt>{t(`detall.${clau}`)}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className={styles.senseValors}>{t('detall.senseValors')}</p>
            )}

            {textos.map(([clau, text]) => (
              <div key={clau} className={styles.text}>
                <h3 className={styles.subtitol}>{t(`detall.${clau}`)}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
