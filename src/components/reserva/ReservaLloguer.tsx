'use client';

// Fitxa de lloguer, amb el recorregut de Sescapada en una sola pantalla. A l'esquerra, fixos, la
// foto, el títol i el preu, que es va desglossant a cada canvi. A la dreta, el formulari: dia i hora
// de recollida i de retorn dins de l'horari de la botiga, una o més bicis (talla amb les unitats que
// queden, qui la portarà, pedals i extres amb foto i estoc) i les dades. El servidor torna a
// calcular el preu en confirmar.

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore, useTransition, type FormEvent, type ReactNode } from 'react';
import { consultarDisponibilitat, reservarLloguer, type ResultatReserva } from '@/app/[locale]/accions';
import { araABotiga, esPassat, sumaDies, type Instant } from '@/lib/calendari';
import { blocsDelDia, diesEntre, horesRecollida, horesRetorn, MAX_DIES_LLOGUER, minutsEntre, validaFranja } from '@/lib/horari';
import type { Disponibilitat } from '@/lib/plataforma';
import type { BiciLloguer, ConfiguracioReserves, Extra, HorariBotiga, ModalitatPagament, Moment } from '@/lib/plataforma/esquema';
import { desglosLinia, duradaDe, formatEuros, preuPerDia } from '@/lib/preus';
import { extresLliures, primeraRecollida, retornPerDefecte, tallesLliures } from '@/lib/reserva';
import { useReducedMotion } from '@/lib/scroll-scene';
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
  /** La foto de la bici, que ve del servidor. */
  foto: ReactNode;
  /** El que inclou el lloguer, al peu del formulari. */
  inclou: ReactNode;
};

export function ReservaLloguer({ bici, flota, extres, horari, configuracio, foto, inclou }: Props) {
  const t = useTranslations('reserva');
  const tf = useTranslations('flota');
  const locale = useLocale();
  const id = useId();
  const ara = useAra();
  const reduced = useReducedMotion();
  const formulari = useRef<HTMLFormElement>(null);

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

  const desglossos = linies.map((l) => {
    const b = flota.find((f) => f.id === l.biciId);
    if (!b || !recollida || !retorn || errorFranja) return null;
    const triats = [l.pedals, ...l.extres].map((x) => perId.get(x)).filter((e): e is Extra => e !== undefined);
    return desglosLinia({ tarifa: b.tarifa, extres: triats }, recollida, retorn);
  });
  const total = desglossos.every((d) => d !== null) ? desglossos.reduce((suma, d) => suma + d!.total, 0) : null;

  /** El que costa de debò cada tipus de bici per a aquestes dates, no el tram més barat. */
  const preuDe = (b: BiciLloguer) => {
    if (!recollida || !retorn || errorFranja) return null;
    const durada = duradaDe(recollida, retorn, b.tarifa);
    const preu = preuPerDia(b.tarifa, durada);
    if (preu === null) return null;
    return durada.tipus === 'migDia' ? `${t('migDia')}: ${euros(preu)}` : t('preuDia', { preu: euros(preu) });
  };

  const confirmada = resultat?.ok && 'codi' in resultat ? resultat : null;

  // El botó de confirmar és sempre a la vista, i el que passa pot ser lluny: la pàgina hi porta.
  const moviment: ScrollBehavior = reduced ? 'auto' : 'smooth';
  useEffect(() => {
    if (errorsCamps.size > 0) formulari.current?.querySelector('[aria-invalid="true"], [data-error]')?.scrollIntoView({ block: 'center', behavior: moviment });
  }, [errorsCamps]); // eslint-disable-line react-hooks/exhaustive-deps -- només quan hi ha errors nous
  const codiConfirmat = confirmada?.codi;
  useEffect(() => {
    if (codiConfirmat) window.scrollTo({ top: 0, behavior: moviment });
  }, [codiConfirmat]); // eslint-disable-line react-hooks/exhaustive-deps -- només en confirmar

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
    <div className={styles.graella}>
      {/* A l'esquerra, fixa: la foto, el títol i el preu que va pujant. */}
      <div className={styles.columnaFixa}>
        {foto}
        <aside className={styles.banner} aria-labelledby="bici-nom">
          <div className={styles.bannerCap}>
            <p className={styles.categoria}>{tf(`categories.${bici.categoria}`)}</p>
            <h1 id="bici-nom" className={styles.nom}>
              {bici.nom}
            </h1>
            <p className={styles.model}>
              {bici.model.valor}
              {bici.model.ficticia && <span className="mostra">*</span>}
            </p>
          </div>

          {!confirmada && (
            <>
              <div className={styles.desglos}>
                <p className={styles.etiquetaGrup}>{t('resum')}</p>
                <ul className={styles.liniesResum}>
                  {linies.map((l, i) => {
                    const b = flota.find((f) => f.id === l.biciId);
                    const d = desglossos[i];
                    return (
                      <li key={l.clau}>
                        <p className={styles.liniaBici}>
                          <span>{l.talla ? t('liniaBici', { nom: b?.nom ?? '', talla: l.talla }) : `${b?.nom ?? ''} · ${t('senseTalla')}`}</span>
                          <strong>{d ? euros(d.total) : '—'}</strong>
                        </p>
                        {d && (
                          <>
                            <p className={styles.liniaDetall}>
                              <span>
                                {d.durada.tipus === 'migDia'
                                  ? t('migDia')
                                  : t('calculDies', { preu: euros(d.perDia), dies: t('dies', { n: d.dies }) })}
                              </span>
                              <span>{euros(d.lloguer)}</span>
                            </p>
                            {d.extres.map((e) => (
                              <p key={e.id} className={styles.liniaDetall}>
                                <span>+ {t(`extresNoms.${e.id}`)}</span>
                                <span>{euros(e.import)}</span>
                              </p>
                            ))}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
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
              </div>

              <div className={styles.peuPreu}>
                {resultat && !resultat.ok && (
                  <p id={`${id}-error`} className={styles.error} role="alert">
                    {t(`errors.${resultat.error}`)}
                  </p>
                )}
                <p className={styles.total} aria-live="polite">
                  <span>{t('total')}</span>
                  {/* La clau fa que el número es torni a animar cada vegada que canvia. */}
                  <strong key={total ?? 'cap'}>{total === null ? '—' : euros(total)}</strong>
                </p>
                <button type="submit" form={`${id}-form`} className={`boto boto--blau ${styles.confirmar}`} disabled={enviant || total === null || !ara}>
                  {enviant ? t('enviant') : configuracio.pagament.actiu ? t('pagar') : t('confirmar')}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* A la dreta, el que fa scroll. */}
      <div className={styles.columna}>
        {confirmada && recollida ? (
          <div className={styles.fet} role="status">
            <p className={styles.fetMarca} aria-hidden="true">
              ✓
            </p>
            <h2>{t('fet.titol')}</h2>
            <p className={styles.codi}>
              <span>{t('fet.codi')}</span>
              <strong>{confirmada.codi}</strong>
            </p>
            <p>
              {t('fet.text', {
                data: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${recollida.dia}T12:00:00`)),
                hora: recollida.hora,
              })}
            </p>
            <p className={styles.adreca}>{t('fet.adreca')}</p>
            {confirmada.totalCentims !== undefined && (
              <p className={styles.totalFet}>
                {t('total')}: <strong>{euros(confirmada.totalCentims)}</strong>
              </p>
            )}
            {configuracio.participants.actiu && <Participants codi={confirmada.codi} noms={linies.map((l) => l.nom)} />}
            <button type="button" className="boto boto--clar" onClick={() => setResultat(null)}>
              {t('fet.altra')}
            </button>
          </div>
        ) : (
          <form ref={formulari} id={`${id}-form`} className={styles.panell} onSubmit={enviar} noValidate aria-describedby={resultat && !resultat.ok ? `${id}-error` : undefined}>
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
                  ambCapcalera={linies.length > 1}
                  preuDe={preuDe}
                  onCanvi={(canvi) => canviaLinia(l.clau, canvi)}
                  onTreure={i > 0 ? () => treu(l.clau) : undefined}
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
              <div className={styles.fila3}>
                <label className={styles.camp} data-error={error('nom') || undefined}>
                  <span>{t('nom')}</span>
                  <input name="nom" autoComplete="name" required aria-invalid={error('nom') || undefined} />
                  {error('nom') && <em>{t('camps.nom')}</em>}
                </label>
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
              <label className={`${styles.camp} ${styles.campSeparat}`}>
                <span>{t('comentaris')}</span>
                <textarea name="comentaris" maxLength={500} rows={2} />
              </label>
              <label className={styles.check} data-error={error('privacitat') || undefined}>
                <input name="privacitat" type="checkbox" required aria-invalid={error('privacitat') || undefined} />
                <span>{t('privacitat')}</span>
              </label>
              {error('privacitat') && <em className={styles.errorSolt}>{t('camps.privacitat')}</em>}
            </fieldset>
          </form>
        )}
        {inclou}
      </div>
    </div>
  );
}
