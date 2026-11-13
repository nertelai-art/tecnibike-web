'use client';

// Rajoles de pedals i extres amb foto, preu i unitats que queden, com les de Sescapada. Els pedals
// es trien d'un en un (ràdio); la resta, tants com es vulgui (casella). Un extra amb variants (la
// talla d'un casc), un cop triat, demana quina, amb les unitats que en queden.

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Extra } from '@/lib/plataforma/esquema';
import { optimitzable } from '@/lib/imatges';
import { formatEuros } from '@/lib/preus';
import styles from './Reserva.module.css';

/** A partir d'aquí no es diu el número exacte: «més de 15». */
const ESTOC_VISIBLE = 15;

type Props = {
  nom: string;
  extres: readonly Extra[];
  triats: readonly string[];
  lliures: Record<string, number | null>;
  multiple: boolean;
  onCanvi: (id: string) => void;
  /** La variant triada de cada extra que en té. */
  variants?: Readonly<Record<string, string>>;
  /** El que queda de cada variant d'un extra per a aquesta bici. */
  lliuresVariants?: (id: string) => Record<string, number | null>;
  onVariant?: (id: string, variant: string) => void;
  /** Els extres triats als quals encara falta la variant, si ja s'ha intentat enviar. */
  faltaVariant?: ReadonlySet<string>;
};

export function Extres({ nom, extres, triats, lliures, multiple, onCanvi, variants = {}, lliuresVariants, onVariant, faltaVariant }: Props) {
  const t = useTranslations('reserva');
  const locale = useLocale();

  return (
    <ul className={styles.extres}>
      {extres.map((e) => {
        const n = lliures[e.id];
        const triat = triats.includes(e.id);
        const esgotat = n === 0 && !triat;
        const nomExtra = e.nom ?? t(`extresNoms.${e.id}`);
        const preu = e.preu === 0 ? t('inclos') : e.cobrament === 'perDia' ? t('preuDia', { preu: formatEuros(e.preu, locale) }) : formatEuros(e.preu, locale);
        const ambVariants = Boolean(triat && e.variants?.length && onVariant);
        const queden = ambVariants ? (lliuresVariants?.(e.id) ?? {}) : {};
        const falta = faltaVariant?.has(e.id);
        return (
          <li key={e.id} data-amb-variants={ambVariants || undefined}>
            <label className={styles.extra} data-esgotat={esgotat || undefined}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={nom}
                value={e.id}
                checked={triat}
                disabled={esgotat}
                aria-label={`${nomExtra} · ${preu}`}
                onChange={() => onCanvi(e.id)}
              />
              <span className={styles.extraFoto}>
                {e.imatge ? (
                  <Image src={e.imatge} alt="" width={96} height={96} unoptimized={!optimitzable(e.imatge)} />
                ) : (
                  // Sense foto a la plataforma: una icona neutra, no un forat.
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.extraIcona}>
                    <path d="M21 7.5 12 3 3 7.5v9L12 21l9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9" />
                  </svg>
                )}
              </span>
              <span className={styles.extraText}>
                <strong>{nomExtra}</strong>
                <span>
                  {preu}
                  {e.ficticia && <span className="mostra">*</span>}
                </span>
                {n !== undefined && n !== null && (
                  <em data-poques={n <= 2 || undefined}>{n > ESTOC_VISIBLE ? t('estocMolts') : t('estoc', { n })}</em>
                )}
              </span>
            </label>
            {ambVariants && (
              <div className={styles.variants} role="radiogroup" aria-label={t('variantDe', { extra: nomExtra })} data-error={falta || undefined}>
                {e.variants!.map((v) => {
                  const q = queden[v.nom];
                  const triada = variants[e.id] === v.nom;
                  return (
                    <label key={v.nom} className={styles.variant} data-esgotada={(q === 0 && !triada) || undefined}>
                      <input type="radio" name={`${nom}-${e.id}`} value={v.nom} checked={triada} disabled={q === 0 && !triada} onChange={() => onVariant?.(e.id, v.nom)} />
                      <span>
                        {v.nom}
                        {q !== undefined && q !== null && <small>{t('disponibles', { n: q })}</small>}
                      </span>
                    </label>
                  );
                })}
                {falta && <em className={styles.errorSolt}>{t('camps.variant')}</em>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
