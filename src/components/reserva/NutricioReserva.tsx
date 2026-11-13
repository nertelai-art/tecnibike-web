'use client';

// Gels, barretes i begudes per a la ruta, amb la reserva: la botiga els deixa a punt amb la bici. És
// de la reserva sencera, no d'una bici. Cada producte es tria amb el sabor (una variant amb el seu
// estoc) i la quantitat; el que queda descompta el que ja és a la reserva.

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { Paquet } from '@/components/nutricio/Paquet';
import { colorSabor, imatgeDe, ORDRE_MARQUES, temaDe } from '@/content/nutricio';
import { optimitzable } from '@/lib/imatges';
import type { LiniaNutricio, ProducteNutricio } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { afegeixNutricio, MAX_QUANTITAT_NUTRICIO, nutricioLliure } from '@/lib/reserva';
import { Plegable } from './Plegable';
import styles from './Reserva.module.css';

/** Productes que es veuen abans de «Veure'n més», per no allargar el formulari. */
const VISIBLES = 6;

type Props = {
  productes: readonly ProducteNutricio[];
  linies: readonly LiniaNutricio[];
  /** `null` mentre es consulta. */
  disponibilitat: { nutricio: Record<string, Record<string, number | null>> } | null;
  onCanvi: (linies: LiniaNutricio[]) => void;
};

export function NutricioReserva({ productes, linies, disponibilitat, onCanvi }: Props) {
  const t = useTranslations('nutricio');
  const tr = useTranslations('reserva');
  const locale = useLocale();
  const id = useId();
  const marques = ORDRE_MARQUES.filter((m) => productes.some((p) => p.marca === m));
  const altres = [...new Set(productes.map((p) => p.marca))].filter((m) => !marques.includes(m as (typeof ORDRE_MARQUES)[number]));
  const totes = [...marques, ...altres];
  const [marca, setMarca] = useState<string | null>(null);
  const [sabors, setSabors] = useState<Record<string, string>>({});
  const [tots, setTots] = useState(false);
  // Sense marca triada, les marques s'intercalen: els primers ja n'ensenyen de totes.
  const posicio = (p: ProducteNutricio) => productes.filter((x) => x.marca === p.marca).indexOf(p) * totes.length + totes.indexOf(p.marca);
  const filtrats = productes.filter((p) => !marca || p.marca === marca).sort((a, b) => (marca ? 0 : posicio(a) - posicio(b)));
  const visibles = tots ? filtrats : filtrats.slice(0, VISIBLES);
  const euros = (c: number) => formatEuros(c, locale);
  const nomSabor = (p: ProducteNutricio, s: string) => p.sabors.find((x) => x.id === s)?.nom ?? t(`sabors.${s}`);
  const canviaQuantitat = (i: number, q: number) =>
    onCanvi(q <= 0 ? linies.filter((_, j) => j !== i) : linies.map((l, j) => (j === i ? { ...l, quantitat: Math.min(MAX_QUANTITAT_NUTRICIO, q) } : l)));

  return (
    <fieldset className={`${styles.grup} ${styles.nutricio}`}>
      <legend className="sr-only">{t('reserva.titol')}</legend>
      <Plegable
        titol={t('reserva.titol')}
        resum={
          linies.length > 0
            ? t('reserva.unitats', { n: linies.reduce((n, l) => n + l.quantitat, 0), preu: euros(linies.reduce((n, l) => n + (productes.find((x) => x.id === l.producteId)?.preu ?? 0) * l.quantitat, 0)) })
            : t('reserva.opcional')
        }
      >
        <p className={styles.ajuda}>{t('reserva.intro')}</p>

        <div className={styles.filtreMarques} role="group" aria-label={t('marca')}>
          <button type="button" aria-pressed={marca === null} onClick={() => (setMarca(null), setTots(false))}>
            {t('totes')}
          </button>
          {totes.map((m) => (
            <button key={m} type="button" aria-pressed={marca === m} onClick={() => (setMarca(m), setTots(false))} style={{ '--marca': temaDe(m).fons } as React.CSSProperties}>
              <span aria-hidden="true" />
              {m}
            </button>
          ))}
        </div>

        <ul id={`${id}-productes`} className={styles.nutricioProductes}>
          {visibles.map((p) => {
            const sabor = sabors[p.id] ?? p.sabors.find((s) => nutricioLliure(disponibilitat, linies, p.id, s.id) !== 0)?.id ?? p.sabors[0]!.id;
            const queden = nutricioLliure(disponibilitat, linies, p.id, sabor);
            const esgotat = queden === 0;
            const enReserva = linies.find((l) => l.producteId === p.id && l.sabor === sabor)?.quantitat ?? 0;
            const img = imatgeDe(p, sabor);
            return (
              <li key={p.id} className={styles.nutricioProducte} style={{ '--marca': temaDe(p.marca).fons, '--marca-accent': temaDe(p.marca).accent } as React.CSSProperties}>
                <div className={styles.nutricioFoto}>
                  {img ? (
                    <Image key={img} src={img} alt="" width={112} height={144} unoptimized={!optimitzable(img)} />
                  ) : (
                    <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={sabor} />
                  )}
                </div>
                <div className={styles.nutricioText}>
                  <p className={styles.nutricioMarca}>{p.marca}</p>
                  <p className={styles.nutricioNom}>{p.nom}</p>
                  <p className={styles.nutricioDades}>
                    {p.format}
                    {p.carbohidratsG !== undefined && <> · {t('carbohidrats', { g: p.carbohidratsG })}</>}
                    {p.cafeinaMg !== undefined && <span data-cafeina>{t('cafeina', { mg: p.cafeinaMg })}</span>}
                  </p>
                  <p className={styles.nutricioPreu}>
                    {t('perUnitat', { preu: euros(p.preu) })}
                    {p.ficticia && <span className="mostra">*</span>}
                  </p>
                </div>
                <div className={styles.nutricioTria}>
                  {p.sabors.length > 1 ? (
                    <label className={styles.camp}>
                      <span className="sr-only">{t('sabor')}</span>
                      <select value={sabor} onChange={(e) => setSabors((s) => ({ ...s, [p.id]: e.target.value }))}>
                        {p.sabors.map((s) => {
                          const q = nutricioLliure(disponibilitat, linies, p.id, s.id);
                          return (
                            <option key={s.id} value={s.id} disabled={q === 0}>
                              {nomSabor(p, s.id)}
                              {q === 0 ? ` · ${t('esgotat')}` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  ) : (
                    <p className={styles.nutricioSaborUnic}>
                      <span aria-hidden="true" style={{ background: colorSabor(sabor) }} />
                      {nomSabor(p, sabor)}
                    </p>
                  )}
                  {queden !== undefined && queden !== null && <em data-poques={queden <= 2 || undefined}>{tr('estoc', { n: queden })}</em>}
                  <button
                    type="button"
                    className={styles.nutricioAfegir}
                    disabled={esgotat || enReserva >= MAX_QUANTITAT_NUTRICIO}
                    onClick={() => onCanvi(afegeixNutricio(linies, p.id, sabor))}
                    aria-label={t('afegirA', { producte: `${p.marca} ${p.nom}`, sabor: nomSabor(p, sabor) })}
                  >
                    {t('afegir')}
                    {enReserva > 0 && <span className={styles.nutricioCompte}>{enReserva}</span>}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {filtrats.length > VISIBLES && (
          <button type="button" className={styles.nutricioMes} aria-expanded={tots} aria-controls={`${id}-productes`} onClick={() => setTots((x) => !x)}>
            {tots ? t('veureMenys') : t('veureMes', { n: filtrats.length - VISIBLES })}
          </button>
        )}

        {linies.length > 0 && (
          <div className={styles.nutricioTriats} aria-live="polite">
            <p id={`${id}-triats`} className={styles.etiquetaGrup}>
              {t('reserva.triats')}
            </p>
            <ul aria-labelledby={`${id}-triats`}>
              {linies.map((l, i) => {
                const p = productes.find((x) => x.id === l.producteId);
                if (!p) return null;
                const queden = nutricioLliure(disponibilitat, linies, l.producteId, l.sabor);
                return (
                  <li key={`${l.producteId}-${l.sabor}`}>
                    <span className={styles.nutricioPunt} aria-hidden="true" style={{ background: colorSabor(l.sabor) }} />
                    <span className={styles.nutricioLinia}>
                      <strong>
                        {p.marca} {p.nom}
                      </strong>
                      <small>{nomSabor(p, l.sabor)}</small>
                    </span>
                    <span className={styles.quantitat}>
                      <button type="button" onClick={() => canviaQuantitat(i, l.quantitat - 1)} aria-label={t('menys', { producte: p.nom })}>
                        −
                      </button>
                      <output aria-label={t('quantitat')}>{l.quantitat}</output>
                      <button
                        type="button"
                        onClick={() => canviaQuantitat(i, l.quantitat + 1)}
                        disabled={queden === 0 || l.quantitat >= MAX_QUANTITAT_NUTRICIO}
                        aria-label={t('mes', { producte: p.nom })}
                      >
                        +
                      </button>
                    </span>
                    <span className={styles.nutricioImport}>{euros(p.preu * l.quantitat)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Plegable>
    </fieldset>
  );
}
