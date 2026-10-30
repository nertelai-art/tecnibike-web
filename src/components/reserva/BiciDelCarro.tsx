'use client';

// Una bici de la reserva: talla amb les unitats que queden, qui la portarà (alçada per suggerir la
// talla i alçada del seient per deixar-la a punt), pedals i extres. La primera és sempre la de la
// fitxa; només les que s'afegeixen trien el tipus de bici.

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import type { BiciLloguer, Extra } from '@/lib/plataforma/esquema';
import { tallaSuggerida } from '@/lib/talles';
import { Extres } from './Extres';
import styles from './Reserva.module.css';

export type LiniaFormulari = {
  clau: number;
  biciId: string;
  talla: string | null;
  pedals: string;
  extres: string[];
  nom: string;
  alcada: string;
  seient: string;
};

type Props = {
  index: number;
  linia: LiniaFormulari;
  flota: readonly BiciLloguer[];
  pedals: readonly Extra[];
  extres: readonly Extra[];
  /** `null` mentre es consulta la disponibilitat. */
  talles: Record<string, number> | null;
  lliures: Record<string, number | null>;
  errors: ReadonlySet<string>;
  /** Si n'hi ha més d'una, cal dir de quina es parla. */
  ambCapcalera: boolean;
  /** Preu d'un tipus de bici per a les dates triades, per al desplegable. */
  preuDe: (bici: BiciLloguer) => string | null;
  onCanvi: (canvi: Partial<LiniaFormulari>) => void;
  /** Sense aquesta funció, és la bici de la fitxa: no es pot canviar ni treure. */
  onTreure?: () => void;
};

export function BiciDelCarro({ index, linia, flota, pedals, extres, talles, lliures, errors, ambCapcalera, preuDe, onCanvi, onTreure }: Props) {
  const t = useTranslations('reserva');
  const id = useId();
  const bici = flota.find((b) => b.id === linia.biciId) ?? flota[0]!;
  const alcada = Number(linia.alcada);
  const suggerida = alcada >= 100 && alcada <= 220 ? tallaSuggerida(alcada, bici.talles) : null;
  const error = (camp: string) => errors.has(`bicis.${index}.${camp}`);
  const unitats = linia.talla && talles ? talles[linia.talla] : undefined;

  return (
    <fieldset className={styles.biciCarro}>
      <legend className="sr-only">{t('bici', { n: index + 1 })}</legend>
      {ambCapcalera && (
        <div className={styles.biciCap}>
          <span className={styles.biciNumero} aria-hidden="true">
            {index + 1}
          </span>
          <Image src={bici.imatge} alt="" width={120} height={72} className={styles.biciMiniatura} />
          {onTreure ? (
            <>
              <label className={styles.camp}>
                <span>{t('tipusBici')}</span>
                <select value={bici.id} onChange={(e) => onCanvi({ biciId: e.target.value, talla: null })}>
                  {flota.map((b) => {
                    const preu = preuDe(b);
                    return (
                      <option key={b.id} value={b.id}>
                        {preu ? `${b.nom} · ${preu}` : b.nom}
                      </option>
                    );
                  })}
                </select>
              </label>
              <button type="button" className={styles.treure} onClick={onTreure} aria-label={t('treure', { n: index + 1 })}>
                ×
              </button>
            </>
          ) : (
            <strong className={styles.biciNomFix}>{bici.nom}</strong>
          )}
        </div>
      )}

      {/* Talla, amb les unitats que queden per a les dates triades */}
      <div className={styles.grup} role="radiogroup" aria-labelledby={`${id}-talla`} aria-invalid={error('talla') || undefined}>
        <p id={`${id}-talla`} className={styles.etiquetaGrup}>
          {t('talla')}
        </p>
        <div className={styles.talles}>
          {bici.talles.map((tl) => {
            const n = talles?.[tl];
            const estat = n === undefined ? 'carregant' : n === 0 ? 'esgotada' : n === 1 ? 'poques' : 'lliure';
            return (
              <label key={tl} className={styles.talla} data-estat={estat} data-suggerida={suggerida === tl || undefined}>
                <input type="radio" name={`${id}-talla`} value={tl} checked={linia.talla === tl} disabled={n === 0} onChange={() => onCanvi({ talla: tl })} />
                <span>
                  {tl}
                  <small>{n === undefined ? '…' : t('disponibles', { n })}</small>
                </span>
              </label>
            );
          })}
        </div>
        {talles === null && <p className={styles.ajuda}>{t('carregant')}</p>}
        {error('talla') && <em className={styles.errorSolt}>{t('camps.talla')}</em>}
        {unitats === 0 && <em className={styles.errorSolt}>{t('errors.esgotat')}</em>}
      </div>

      {/* Qui la portarà */}
      <div className={styles.grup}>
        <p className={styles.etiquetaGrup}>{t('ciclista')}</p>
        <div className={styles.fila3}>
          <label className={styles.camp}>
            <span>{t('nomCiclista')}</span>
            <input value={linia.nom} maxLength={60} autoComplete="off" onChange={(e) => onCanvi({ nom: e.target.value })} />
          </label>
          <label className={styles.camp} data-error={error('ciclista.alcadaCm') || undefined}>
            <span>{t('alcada')}</span>
            <input
              type="number"
              inputMode="numeric"
              min={100}
              max={220}
              placeholder="175"
              value={linia.alcada}
              onChange={(e) => onCanvi({ alcada: e.target.value })}
              aria-invalid={error('ciclista.alcadaCm') || undefined}
            />
            {error('ciclista.alcadaCm') && <em>{t('camps.alcada')}</em>}
          </label>
          <label className={styles.camp} data-error={error('ciclista.alcadaSeientCm') || undefined}>
            <span>{t('seient')}</span>
            <input
              type="number"
              inputMode="numeric"
              min={50}
              max={100}
              placeholder="72"
              value={linia.seient}
              onChange={(e) => onCanvi({ seient: e.target.value })}
              aria-invalid={error('ciclista.alcadaSeientCm') || undefined}
              aria-describedby={`${id}-seient`}
            />
            {error('ciclista.alcadaSeientCm') && <em>{t('camps.seient')}</em>}
          </label>
        </div>
        {suggerida && (
          <p className={styles.suggerida}>
            {t('suggerida', { talla: suggerida })}{' '}
            {linia.talla !== suggerida && (
              <button type="button" className={styles.aplicar} onClick={() => onCanvi({ talla: suggerida })} disabled={talles?.[suggerida] === 0}>
                {t('aplicar')}
              </button>
            )}
          </p>
        )}
        <p id={`${id}-seient`} className={styles.ajuda}>
          {t('seientAjuda')}
        </p>
      </div>

      <div className={styles.grup} aria-invalid={error('pedals') || undefined}>
        <p className={styles.etiquetaGrup}>{t('pedals')}</p>
        <Extres nom={`${id}-pedals`} extres={pedals} triats={[linia.pedals]} lliures={lliures} multiple={false} onCanvi={(p) => onCanvi({ pedals: p })} />
        {error('pedals') && <em className={styles.errorSolt}>{t('camps.pedals')}</em>}
      </div>

      <div className={styles.grup}>
        <p className={styles.etiquetaGrup}>{t('extres')}</p>
        <Extres
          nom={`${id}-extres`}
          extres={extres}
          triats={linia.extres}
          lliures={lliures}
          multiple
          onCanvi={(x) => onCanvi({ extres: linia.extres.includes(x) ? linia.extres.filter((y) => y !== x) : [...linia.extres, x] })}
        />
      </div>
    </fieldset>
  );
}
