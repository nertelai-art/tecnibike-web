'use client';

// Formulari de reserva de lloguer, amb el recorregut de Sescapada en una sola pantalla: dia i hora
// de recollida i de retorn dins de l'horari de la botiga, una o més bicis (model, talla amb les
// unitats que queden, qui la portarà, pedals i extres amb foto i estoc), les dades i el resum. El
// preu es recalcula a cada canvi; el servidor el torna a calcular en confirmar.

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore, useTransition, type FormEvent } from 'react';
import { consultarDisponibilitat, reservarLloguer, type ResultatReserva } from '@/app/[locale]/accions';
import { araABotiga, esPassat, sumaDies, type Instant } from '@/lib/calendari';
import { blocsDelDia, diesEntre, horesRecollida, horesRetorn, MAX_DIES_LLOGUER, minutsEntre, validaFranja } from '@/lib/horari';
import type { Disponibilitat } from '@/lib/plataforma';
import type { BiciLloguer, ConfiguracioReserves, Extra, HorariBotiga, ModalitatPagament, Moment } from '@/lib/plataforma/esquema';
import { formatEuros, preuLinia } from '@/lib/preus';
import { extresLliures, primeraRecollida, retornPerDefecte, tallesLliures } from '@/lib/reserva';
import { BiciDelCarro, type LiniaFormulari } from './BiciDelCarro';
import { Participants } from './Participants';
import styles from './Reserva.module.css';

const MAX_BICIS = 8;
const PEDALS_PER_DEFECTE = 'pedals-plans';

const noop = () => () => {};
/** «Ara» a la botiga segons el rellotge del navegador; al servidor és buit (no hi ha hora fiable). */
function useAra(): Instant | null {
  const text = useSyncExternalStore(
    noop,
    () => {
      const ara = araABotiga(new Date());
      return `${ara.dia}T${ara.hora}`;
    },
    () => '',
  );
  if (!text) return null;
  const [dia, hora] = text.split('T') as [string, string];
  return { dia, hora };
}

type Props = {
  bici: BiciLloguer;
  flota: readonly BiciLloguer[];
  extres: readonly Extra[];
  horari: HorariBotiga;
  configuracio: ConfiguracioReserves;
};

export function ReservaLloguer({ bici, flota, extres, horari, configuracio }: Props) {
  const t = useTranslations('reserva');
  const locale = useLocale();
  const id = useId();
  const ara = useAra();

  const novaLinia = (clau: number, biciId: string): LiniaFormulari => ({
    clau, biciId, talla: null, pedals: PEDALS_PER_DEFECTE, extres: ['casc'], nom: '', alcada: '', seient: '',
  });
  const seguentClau = useRef(1);
  const [linies, setLinies] = useState<LiniaFormulari[]>(() => [novaLinia(0, bici.id)]);
  const [recollidaTriada, setRecollida] = useState<Moment | null>(null);
  const [retornTriat, setRetorn] = useState<Moment | null>(null);
  const [disponibilitat, setDisponibilitat] = useState<Disponibilitat | null>(null);
  const [modalitat, setModalitat] = useState<ModalitatPagament>(configuracio.pagament.modalitats[0]!);
  const [errorsCamps, setErrorsCamps] = useState<Set<string>>(new Set());
  const [resultat, setResultat] = useState<ResultatReserva | null>(null);
  // Puja amb cada reserva feta, perquè la disponibilitat es torni a consultar.
  const [reservesFetes, setReservesFetes] = useState(0);
  const [enviant, iniciaEnviament] = useTransition();

  const recollida = recollidaTriada ?? (ara ? primeraRecollida(ara, horari) : null);
  const retorn = retornTriat ?? (recollida ? retornPerDefecte(recollida, horari) : null);
  const biciIds = [...new Set(linies.map((l) => l.biciId))].sort().join(',');

  // Unitats lliures de les bicis del carro i dels extres per als dies triats.
  useEffect(() => {
    if (!recollida || !retorn || diesEntre(recollida.dia, retorn.dia) < 1) return;
    let viu = true;
    consultarDisponibilitat(recollida.dia, retorn.dia, biciIds.split(',')).then((d) => {
      if (viu) setDisponibilitat(d);
    });
    return () => {
      viu = false;
    };
  }, [recollida?.dia, retorn?.dia, biciIds, reservesFetes]); // eslint-disable-line react-hooks/exhaustive-deps -- n'hi ha prou amb els dies

  const perId = new Map(extres.map((e) => [e.id, e]));
  const pedals = extres.filter((e) => e.grup === 'pedals');
  const opcionals = extres.filter((e) => e.grup === 'extres');
  const euros = (centims: number) => formatEuros(centims, locale);
  const errorFranja = recollida && retorn && ara ? validaFranja({ recollida, retorn }, horari, ara) : null;

  const preus = linies.map((l) => {
    const b = flota.find((f) => f.id === l.biciId);
    if (!b || !recollida || !retorn || errorFranja) return null;
    const triats = [l.pedals, ...l.extres].map((x) => perId.get(x)).filter((e): e is Extra => e !== undefined);
    return preuLinia({ tarifa: b.tarifa, extres: triats }, recollida, retorn);
  });
  const total = preus.every((p) => p !== null) ? preus.reduce((a, p) => a + p!, 0) : null;

  if (resultat?.ok && 'codi' in resultat && recollida) {
    const dataLlarga = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${recollida.dia}T12:00:00`));
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
        <p>{t('fet.text', { data: dataLlarga, hora: recollida.hora })}</p>
        <p className={styles.adreca}>{t('fet.adreca')}</p>
        {resultat.totalCentims !== undefined && (
          <p className={styles.totalFet}>
            {t('total')}: <strong>{euros(resultat.totalCentims)}</strong>
          </p>
        )}
        {configuracio.participants.actiu && <Participants codi={resultat.codi} noms={linies.map((l) => l.nom)} />}
        <button type="button" className="boto boto--clar" onClick={() => setResultat(null)}>
          {t('fet.altra')}
        </button>
      </div>
    );
  }

  // ── Dates i hores ──
  const horesLliures = (dia: string) => (ara ? horesRecollida(dia, horari).filter((h) => !esPassat(dia, h, ara)) : []);
  const ajustaRetorn = (rec: Moment, ret: Moment | null) => {
    if (!ret || minutsEntre(rec, ret) <= 0 || diesEntre(rec.dia, ret.dia) > MAX_DIES_LLOGUER) setRetorn(retornPerDefecte(rec, horari));
  };
  const canviaRecollida = (canvi: Partial<Moment>) => {
    if (!recollida) return;
    const dia = canvi.dia ?? recollida.dia;
    const hores = horesLliures(dia);
    const hora = canvi.hora ?? (hores.includes(recollida.hora) ? recollida.hora : (hores[0] ?? recollida.hora));
    const nova = { dia, hora };
    setRecollida(nova);
    ajustaRetorn(nova, retorn);
  };
  const canviaRetorn = (canvi: Partial<Moment>) => {
    if (!retorn) return;
    const dia = canvi.dia ?? retorn.dia;
    const hores = horesRetorn(dia, horari);
    setRetorn({ dia, hora: canvi.hora ?? (hores.includes(retorn.hora) ? retorn.hora : (hores.at(-1) ?? retorn.hora)) });
  };
  const obert = (dia: string) => {
    const blocs = blocsDelDia(dia, horari);
    if (blocs.length === 0) return null;
    return t('obertDia', { blocs: new Intl.ListFormat(locale, { type: 'conjunction' }).format(blocs.map((b) => t('bloc', b))) });
  };

  // ── Bicis ──
  const canviaLinia = (clau: number, canvi: Partial<LiniaFormulari>) => setLinies((ls) => ls.map((l) => (l.clau === clau ? { ...l, ...canvi } : l)));
  const afegeix = () => setLinies((ls) => [...ls, novaLinia(seguentClau.current++, ls.at(-1)?.biciId ?? bici.id)]);
  const treu = (clau: number) => setLinies((ls) => ls.filter((l) => l.clau !== clau));

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recollida || !retorn) return;
    const form = new FormData(event.currentTarget);
    const nom = String(form.get('nom') ?? '').trim();
    const telefon = String(form.get('telefon') ?? '').trim();
    const correu = String(form.get('correu') ?? '').trim();
    const comentaris = String(form.get('comentaris') ?? '').trim();
    const privacitat = form.get('privacitat') === 'on';

    const errors = new Set<string>();
    const numero = (text: string, min: number, max: number, camp: string) => {
      if (!text) return undefined;
      const n = Number(text);
      if (!Number.isInteger(n) || n < min || n > max) errors.add(camp);
      return n;
    };
    const bicis = linies.map((l, i) => {
      const talles = tallesLliures(disponibilitat, linies, i);
      if (!l.talla || talles?.[l.talla] === 0) errors.add(`bicis.${i}.talla`);
      if (extresLliures(disponibilitat, linies, i)[l.pedals] === 0) errors.add(`bicis.${i}.pedals`);
      return {
        biciId: l.biciId,
        talla: l.talla ?? '',
        pedals: l.pedals,
        extres: l.extres,
        ciclista: {
          nom: l.nom.trim() || undefined,
          alcadaCm: numero(l.alcada, 100, 220, `bicis.${i}.ciclista.alcadaCm`),
          alcadaSeientCm: numero(l.seient, 50, 100, `bicis.${i}.ciclista.alcadaSeientCm`),
        },
      };
    });
    if (nom.length < 2) errors.add('nom');
    if (!/^\+?[\d\s().-]{9,20}$/.test(telefon)) errors.add('telefon');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu)) errors.add('correu');
    if (!privacitat) errors.add('privacitat');
    setErrorsCamps(errors);
    if (errorFranja) {
      setResultat({ ok: false, error: 'franja' });
      return;
    }
    if (errors.size > 0) {
      setResultat({ ok: false, error: [...errors].some((e) => e.endsWith('.talla')) ? 'talla' : 'dades' });
      return;
    }

    iniciaEnviament(async () => {
      try {
        const r = await reservarLloguer(
          { recollida, retorn, bicis, comentaris: comentaris || undefined, nom, telefon, correu, idioma: locale, privacitat },
          configuracio.pagament.actiu ? modalitat : undefined,
        );
        if (r.ok && 'pagament' in r) {
          window.location.assign(r.pagament);
          return;
        }
        if (!r.ok && r.camps) setErrorsCamps(new Set(r.camps));
        if (r.ok) setReservesFetes((n) => n + 1);
        setResultat(r);
      } catch {
        setResultat({ ok: false, error: 'xarxa' });
      }
    });
  }

  const error = (camp: string) => errorsCamps.has(camp);
  const minRetorn = recollida?.dia;
  const maxRetorn = recollida ? sumaDies(recollida.dia, MAX_DIES_LLOGUER - 1) : undefined;

  return (
    <form className={styles.panell} onSubmit={enviar} noValidate aria-describedby={resultat && !resultat.ok ? `${id}-error` : undefined}>
      {/* Quan */}
      <fieldset className={styles.grup}>
        <legend>{t('quan')}</legend>
        <div className={styles.franges}>
          {(['recollida', 'retorn'] as const).map((quin) => {
            const moment = quin === 'recollida' ? recollida : retorn;
            const hores = moment ? (quin === 'recollida' ? horesLliures(moment.dia) : horesRetorn(moment.dia, horari)) : [];
            const canvia = quin === 'recollida' ? canviaRecollida : canviaRetorn;
            const text = moment ? obert(moment.dia) : null;
            return (
              <div key={quin} className={styles.franja} data-error={(errorFranja && (errorFranja === quin || (quin === 'recollida' && errorFranja === 'passat'))) || undefined}>
                <p className={styles.etiquetaGrup}>{t(quin)}</p>
                <div className={styles.fila}>
                  <label className={styles.camp}>
                    <span className="sr-only">{t('dia')}</span>
                    <input
                      type="date"
                      value={moment?.dia ?? ''}
                      min={quin === 'recollida' ? ara?.dia : minRetorn}
                      max={quin === 'retorn' ? maxRetorn : undefined}
                      disabled={!moment}
                      required
                      onChange={(e) => e.target.value && canvia({ dia: e.target.value })}
                    />
                  </label>
                  <label className={styles.camp}>
                    <span className="sr-only">{t('hora')}</span>
                    <select value={moment && hores.includes(moment.hora) ? moment.hora : ''} disabled={hores.length === 0} onChange={(e) => canvia({ hora: e.target.value })}>
                      {hores.length === 0 && <option value="">—</option>}
                      {hores.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className={styles.ajuda}>{moment && (hores.length === 0 ? t('tancat') : text)}</p>
              </div>
            );
          })}
        </div>
        {recollida && retorn && !errorFranja && (
          <p className={styles.durada}>
            {t('durada')}: <strong>{t('dies', { n: diesEntre(recollida.dia, retorn.dia) })}</strong>
          </p>
        )}
        {errorFranja && errorFranja !== 'recollida' && <em className={styles.errorSolt}>{t('errors.franja')}</em>}
      </fieldset>

      {/* Bicis */}
      <div className={styles.carro}>
        {linies.map((l, i) => (
          <BiciDelCarro
            key={l.clau}
            index={i}
            linia={l}
            flota={flota}
            pedals={pedals}
            extres={opcionals}
            talles={tallesLliures(disponibilitat, linies, i)}
            lliures={extresLliures(disponibilitat, linies, i)}
            errors={errorsCamps}
            onCanvi={(canvi) => canviaLinia(l.clau, canvi)}
            onTreure={linies.length > 1 ? () => treu(l.clau) : undefined}
          />
        ))}
        {linies.length < MAX_BICIS && (
          <button type="button" className={styles.afegir} onClick={afegeix}>
            <span aria-hidden="true">+</span>
            <span>
              <strong>{t('afegir')}</strong>
              <small>{t('afegirAjuda')}</small>
            </span>
          </button>
        )}
      </div>

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
        <label className={styles.camp}>
          <span>{t('comentaris')}</span>
          <textarea name="comentaris" maxLength={500} rows={3} />
        </label>
        <label className={styles.check} data-error={error('privacitat') || undefined}>
          <input name="privacitat" type="checkbox" required aria-invalid={error('privacitat') || undefined} />
          <span>{t('privacitat')}</span>
        </label>
        {error('privacitat') && <em className={styles.errorSolt}>{t('camps.privacitat')}</em>}
      </fieldset>

      {/* Resum */}
      <div className={styles.resum}>
        <p className={styles.etiquetaGrup}>{t('resum')}</p>
        <ul className={styles.liniesResum}>
          {linies.map((l, i) => {
            const b = flota.find((f) => f.id === l.biciId);
            return (
              <li key={l.clau}>
                <span>
                  {i + 1}. {t('liniaBici', { nom: b?.nom ?? '', talla: l.talla ?? t('senseTalla') })}
                </span>
                <strong>{preus[i] === null ? '—' : euros(preus[i]!)}</strong>
              </li>
            );
          })}
        </ul>
        <p className={styles.total}>
          <span>{t('total')}</span>
          <strong>{total === null ? '—' : euros(total)}</strong>
        </p>
        {configuracio.pagament.actiu && total !== null ? (
          <fieldset className={styles.modalitats}>
            <legend>{t('modalitat')}</legend>
            {configuracio.pagament.modalitats.map((m) => {
              const aPagar = m === 'senyal' ? Math.ceil((total * configuracio.pagament.senyalPercent) / 100) : total;
              return (
                <label key={m} className={styles.check}>
                  <input type="radio" name="modalitat" checked={modalitat === m} onChange={() => setModalitat(m)} />
                  <span>{t(`modalitats.${m}`, { percent: configuracio.pagament.senyalPercent, import: euros(aPagar) })}</span>
                </label>
              );
            })}
          </fieldset>
        ) : (
          <p className={styles.ajuda}>{t('pagament')}</p>
        )}
        {resultat && !resultat.ok && (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {t(`errors.${resultat.error}`)}
          </p>
        )}
        <button type="submit" className={`boto boto--blau ${styles.confirmar}`} disabled={enviant || total === null || !ara}>
          {enviant ? t('enviant') : configuracio.pagament.actiu ? t('pagar') : t('confirmar')}
          {!enviant && total !== null && <span> · {euros(total)}</span>}
        </button>
      </div>
    </form>
  );
}
