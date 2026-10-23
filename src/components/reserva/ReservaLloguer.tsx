'use client';

// Panell de reserva a l'estil de la fitxa de Scott: talla amb punt de disponibilitat, pedals,
// dates, nombre de bicis i accessoris, amb el preu total recalculat a cada canvi. El servidor el
// torna a calcular en confirmar.

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useState, useSyncExternalStore, useTransition, type FormEvent } from 'react';
import { consultarDisponibilitat, reservarLloguer, type ResultatReserva } from '@/app/[locale]/accions';
import { dataLocal } from '@/lib/calendari';
import type { Accessori, BiciLloguer, Durada, Pedals } from '@/lib/plataforma/esquema';
import { formatEuros, preuPerDia, totalReserva } from '@/lib/preus';
import { tallaSuggerida, TRAMS_ALCADA } from '@/lib/talles';
import styles from './Reserva.module.css';

const PEDALS: Pedals[] = ['plans', 'spd', 'spdSl', 'look'];
const ACCESSORIS: Accessori[] = ['casc', 'cadenat', 'cadiraNado', 'alforges', 'comptaquilometres'];
const MAX_DIES = 14;

const noop = () => () => {};
/** «Avui» del navegador; al servidor és buit perquè la data no surti d'un altre fus horari. */
function useAvui() {
  return useSyncExternalStore(noop, () => dataLocal(new Date()), () => '');
}

type Props = { bici: BiciLloguer; preusAccessoris: Record<Accessori, number> };

export function ReservaLloguer({ bici, preusAccessoris }: Props) {
  const t = useTranslations('reserva');
  const locale = useLocale();
  const id = useId();
  const avui = useAvui();

  const [talla, setTalla] = useState<string | null>(null);
  const [alcada, setAlcada] = useState('');
  const [pedals, setPedals] = useState<Pedals>('plans');
  const [dataTriada, setDataTriada] = useState('');
  const [durada, setDurada] = useState<Durada>({ tipus: 'dies', dies: 1 });
  const [bicis, setBicis] = useState(1);
  const [accessoris, setAccessoris] = useState<Accessori[]>(['casc']);
  const [disponibilitat, setDisponibilitat] = useState<Record<string, number> | null>(null);
  const [errorsCamps, setErrorsCamps] = useState<Set<string>>(new Set());
  const [resultat, setResultat] = useState<ResultatReserva | null>(null);
  // Puja amb cada reserva feta, perquè la disponibilitat es torni a consultar.
  const [reservesFetes, setReservesFetes] = useState(0);
  const [enviant, iniciaEnviament] = useTransition();

  const recollida = dataTriada || avui;
  const dies = durada.tipus === 'migDia' ? 1 : durada.dies;

  // Disponibilitat de cada talla per a les dates triades.
  useEffect(() => {
    if (!recollida) return;
    let viu = true;
    consultarDisponibilitat(bici.id, recollida, dies).then((d) => {
      if (viu) setDisponibilitat(d);
    });
    return () => {
      viu = false;
    };
  }, [bici.id, recollida, dies, reservesFetes]);

  const unitats = talla && disponibilitat ? (disponibilitat[talla] ?? 0) : null;
  const total = totalReserva(bici.tarifa, durada, bicis, accessoris, preusAccessoris);
  const perDia = preuPerDia(bici.tarifa, durada);
  const suggerida = alcada ? tallaSuggerida(Number(alcada), bici.talles) : null;
  const euros = (centims: number) => formatEuros(centims, locale);

  if (resultat?.ok) {
    const dataLlarga = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${recollida}T12:00:00`));
    return (
      <div className={styles.fet} role="status">
        <p className={styles.fetMarca} aria-hidden="true">
          ✓
        </p>
        <h2>{t('fet.titol')}</h2>
        <p className={styles.codi}>
          <span>{t('fet.codi')}</span>
          <strong>{resultat.codi}</strong>
        </p>
        <p>{t('fet.text', { data: dataLlarga })}</p>
        <p className={styles.adreca}>{t('fet.adreca')}</p>
        {resultat.totalCentims !== undefined && (
          <p className={styles.totalFet}>
            {t('total')}: <strong>{euros(resultat.totalCentims)}</strong>
          </p>
        )}
        <button type="button" className="boto boto--clar" onClick={() => setResultat(null)}>
          {t('fet.altra')}
        </button>
      </div>
    );
  }

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = String(form.get('nom') ?? '').trim();
    const telefon = String(form.get('telefon') ?? '').trim();
    const correu = String(form.get('correu') ?? '').trim();
    const privacitat = form.get('privacitat') === 'on';

    const errors = new Set<string>();
    if (!talla || unitats === 0) errors.add('talla');
    if (nom.length < 2) errors.add('nom');
    if (!/^\+?[\d\s().-]{9,20}$/.test(telefon)) errors.add('telefon');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu)) errors.add('correu');
    if (!privacitat) errors.add('privacitat');
    setErrorsCamps(errors);
    if (errors.size > 0) {
      setResultat({ ok: false, error: errors.has('talla') ? 'talla' : 'dades' });
      return;
    }

    iniciaEnviament(async () => {
      try {
        const r = await reservarLloguer({
          biciId: bici.id, talla, pedals, recollida, durada, bicis, accessoris, nom, telefon, correu, idioma: locale, privacitat,
        });
        if (!r.ok && r.camps) setErrorsCamps(new Set(r.camps));
        if (r.ok) setReservesFetes((n) => n + 1);
        setResultat(r);
      } catch {
        setResultat({ ok: false, error: 'xarxa' });
      }
    });
  }

  const commutaAccessori = (a: Accessori) =>
    setAccessoris((actuals) => (actuals.includes(a) ? actuals.filter((x) => x !== a) : [...actuals, a]));
  const error = (camp: string) => errorsCamps.has(camp);
  const maxBicis = Math.max(1, Math.min(5, unitats ?? 5));

  return (
    <form className={styles.panell} onSubmit={enviar} noValidate aria-describedby={resultat && !resultat.ok ? `${id}-error` : undefined}>
      {/* Talla */}
      <fieldset className={styles.grup} aria-invalid={error('talla') || undefined}>
        <legend>{t('talla')}</legend>
        <div className={styles.talles}>
          {bici.talles.map((tl) => {
            const n = disponibilitat?.[tl];
            const estat = n === undefined ? 'carregant' : n === 0 ? 'esgotada' : n === 1 ? 'poques' : 'lliure';
            return (
              <label key={tl} className={styles.talla} data-estat={estat} data-suggerida={suggerida === tl || undefined}>
                <input
                  type="radio"
                  name="talla"
                  value={tl}
                  checked={talla === tl}
                  disabled={n === 0}
                  onChange={() => {
                    setTalla(tl);
                    setBicis((b) => Math.min(b, Math.max(1, n ?? 5)));
                  }}
                />
                <span>{tl}</span>
                <i aria-hidden="true" />
                <span className="sr-only">{n === undefined ? t('carregant') : t('disponibles', { n })}</span>
              </label>
            );
          })}
        </div>
        {unitats !== null && <p className={styles.ajuda}>{t('disponibles', { n: unitats })}</p>}
        <details className={styles.ajudaTalla}>
          <summary>{t('tallaAjuda')}</summary>
          <label className={styles.camp}>
            <span>{t('alcada')}</span>
            <select value={alcada} onChange={(e) => setAlcada(e.target.value)}>
              <option value="">—</option>
              {TRAMS_ALCADA.map((tram) => (
                <option key={tram.min} value={tram.min + 4}>
                  {t('alcadaOpcio', tram)}
                </option>
              ))}
            </select>
          </label>
          {suggerida && (
            <p className={styles.suggerida}>
              {t('suggerida', { talla: suggerida })}{' '}
              <button type="button" className={styles.enllac} onClick={() => setTalla(suggerida)} disabled={disponibilitat?.[suggerida] === 0}>
                ✓
              </button>
            </p>
          )}
        </details>
      </fieldset>

      {/* Pedals */}
      <fieldset className={styles.grup}>
        <legend>{t('pedals')}</legend>
        <div className={styles.segments}>
          {PEDALS.map((p) => (
            <label key={p} className={styles.segment}>
              <input type="radio" name="pedals" value={p} checked={pedals === p} onChange={() => setPedals(p)} />
              <span>{t(`pedalsOpcions.${p}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Quan */}
      <div className={styles.fila}>
        <label className={styles.camp}>
          <span>{t('recollida')}</span>
          <input type="date" value={recollida} min={avui || undefined} required onChange={(e) => setDataTriada(e.target.value)} />
        </label>
        <div className={styles.camp}>
          <span id={`${id}-durada`}>{t('durada')}</span>
          <div className={styles.comptador} role="group" aria-labelledby={`${id}-durada`}>
            <button
              type="button"
              aria-label={t('menys')}
              disabled={durada.tipus === 'migDia' || (durada.tipus === 'dies' && durada.dies <= 1 && bici.tarifa.migDia === undefined)}
              onClick={() =>
                setDurada((d) => (d.tipus === 'dies' && d.dies > 1 ? { tipus: 'dies', dies: d.dies - 1 } : bici.tarifa.migDia !== undefined ? { tipus: 'migDia' } : d))
              }
            >
              −
            </button>
            <output aria-live="polite">{durada.tipus === 'migDia' ? t('migDia') : t('dies', { n: durada.dies })}</output>
            <button
              type="button"
              aria-label={t('mes')}
              disabled={durada.tipus === 'dies' && durada.dies >= MAX_DIES}
              onClick={() => setDurada((d) => (d.tipus === 'migDia' ? { tipus: 'dies', dies: 1 } : { tipus: 'dies', dies: Math.min(MAX_DIES, d.dies + 1) }))}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.camp}>
        <span id={`${id}-bicis`}>{t('bicis')}</span>
        <div className={styles.comptador} role="group" aria-labelledby={`${id}-bicis`}>
          <button type="button" aria-label={t('menys')} disabled={bicis <= 1} onClick={() => setBicis((b) => Math.max(1, b - 1))}>
            −
          </button>
          <output aria-live="polite">{bicis}</output>
          <button type="button" aria-label={t('mes')} disabled={bicis >= maxBicis} onClick={() => setBicis((b) => Math.min(maxBicis, b + 1))}>
            +
          </button>
        </div>
      </div>

      {/* Accessoris */}
      <fieldset className={styles.grup}>
        <legend>{t('accessoris')}</legend>
        <ul className={styles.accessoris}>
          {ACCESSORIS.map((a) => (
            <li key={a}>
              <label>
                <input type="checkbox" checked={accessoris.includes(a)} onChange={() => commutaAccessori(a)} />
                <span>{t(`accessorisOpcions.${a}`)}</span>
                <small>
                  {preusAccessoris[a] === 0 ? t('inclos') : t('perBici', { preu: euros(preusAccessoris[a]) })}
                  <span className="mostra">*</span>
                </small>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Dades */}
      <fieldset className={styles.grup}>
        <legend>{t('dades')}</legend>
        <label className={styles.camp} data-error={error('nom') || undefined}>
          <span>{t('nom')}</span>
          <input name="nom" autoComplete="name" required aria-invalid={error('nom') || undefined} />
          {error('nom') && <em>{t('camps.nom')}</em>}
        </label>
        <div className={styles.fila}>
          <label className={styles.camp} data-error={error('telefon') || undefined}>
            <span>{t('telefon')}</span>
            <input name="telefon" type="tel" autoComplete="tel" inputMode="tel" required aria-invalid={error('telefon') || undefined} />
            {error('telefon') && <em>{t('camps.telefon')}</em>}
          </label>
          <label className={styles.camp} data-error={error('correu') || undefined}>
            <span>{t('correu')}</span>
            <input name="correu" type="email" autoComplete="email" required aria-invalid={error('correu') || undefined} />
            {error('correu') && <em>{t('camps.correu')}</em>}
          </label>
        </div>
        <label className={styles.check} data-error={error('privacitat') || undefined}>
          <input name="privacitat" type="checkbox" required aria-invalid={error('privacitat') || undefined} />
          <span>{t('privacitat')}</span>
        </label>
        {error('privacitat') && <em className={styles.errorSolt}>{t('camps.privacitat')}</em>}
      </fieldset>

      {/* Resum */}
      <div className={styles.resum}>
        {perDia !== null && (
          <p className={styles.linia}>
            <span>
              {durada.tipus === 'migDia'
                ? t('perMigDia', { preu: euros(perDia), bicis })
                : t('perDiaX', { preu: euros(perDia), dies, bicis })}
            </span>
          </p>
        )}
        <p className={styles.total}>
          <span>{t('total')}</span>
          <strong>{total === null ? '—' : euros(total)}</strong>
        </p>
        <p className={styles.ajuda}>{t('pagament')}</p>
        {resultat && !resultat.ok && (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {t(`errors.${resultat.error === 'franja' ? 'xarxa' : resultat.error}`)}
          </p>
        )}
        <button type="submit" className={`boto boto--blau ${styles.confirmar}`} disabled={enviant || total === null}>
          {enviant ? t('enviant') : t('confirmar')}
          {!enviant && total !== null && <span> · {euros(total)}</span>}
        </button>
      </div>
    </form>
  );
}
