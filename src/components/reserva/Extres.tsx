'use client';

// Rajoles de pedals i extres amb foto, preu i unitats que queden, com les de Sescapada. Els pedals
// es trien d'un en un (ràdio); la resta, tants com es vulgui (casella).

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Extra } from '@/lib/plataforma/esquema';
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
};

export function Extres({ nom, extres, triats, lliures, multiple, onCanvi }: Props) {
  const t = useTranslations('reserva');
  const locale = useLocale();

  return (
    <ul className={styles.extres}>
      {extres.map((e) => {
        const n = lliures[e.id];
        const triat = triats.includes(e.id);
        const esgotat = n === 0 && !triat;
        const preu = e.preu === 0 ? t('inclos') : e.cobrament === 'perDia' ? t('preuDia', { preu: formatEuros(e.preu, locale) }) : formatEuros(e.preu, locale);
        return (
          <li key={e.id}>
            <label className={styles.extra} data-esgotat={esgotat || undefined}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={nom}
                value={e.id}
                checked={triat}
                disabled={esgotat}
                aria-label={`${t(`extresNoms.${e.id}`)} · ${preu}`}
                onChange={() => onCanvi(e.id)}
              />
              <span className={styles.extraFoto}>
                {e.imatge ? <Image src={e.imatge} alt="" width={96} height={96} /> : <small>{t('senseImatge')}</small>}
              </span>
              <span className={styles.extraText}>
                <strong>{t(`extresNoms.${e.id}`)}</strong>
                <span>
                  {preu}
                  {e.ficticia && <span className="mostra">*</span>}
                </span>
                {n !== undefined && n !== null && (
                  <em data-poques={n <= 2 || undefined}>{n > ESTOC_VISIBLE ? t('estocMolts') : t('estoc', { n })}</em>
                )}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
