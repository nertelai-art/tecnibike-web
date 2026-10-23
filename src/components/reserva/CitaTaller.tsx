'use client';

// Cita al taller en quatre blocs: quina bici, què li passa, quan la portes i les dades. Si s'hi
// arriba des d'una peça de l'escena d'anatomia, el servei ja ve triat.

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useState, useSyncExternalStore, useTransition, type FormEvent } from 'react';
import { consultarFranges, demanarCita, type ResultatReserva } from '@/app/[locale]/accions';
import { ORDRE_PECES } from '@/components/anatomia/anatomia-fases';
import { dataLocal, propersDiesOberts } from '@/lib/calendari';
import type { CitaTaller as Cita, FranjaTaller, Peca, ServeiTaller } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import styles from './Reserva.module.css';
import cita from './Cita.module.css';

const TIPUS: Cita['tipusBici'][] = ['carretera', 'muntanya', 'gravel', 'electrica', 'urbana'];
const noop = () => () => {};
/** Hora local del navegador (HH:MM), per no oferir hores d'avui que ja han passat. */
const horaLocal = () => new Date().toTimeString().slice(0, 5);

type Props = { serveis: ServeiTaller[]; pecaInicial: Peca | null };

export function CitaTaller({ serveis, pecaInicial }: Props) {
  const t = useTranslations('cita');
  const tr = useTranslations('reserva');
  const ta = useTranslations('anatomia');
  const locale = useLocale();
  const id = useId();
  const avui = useSyncExternalStore(noop, () => dataLocal(new Date()), () => '');
  const ara = useSyncExternalStore(noop, horaLocal, () => '');
  const dies = avui ? propersDiesOberts(avui, 12) : [];

  const [tipus, setTipus] = useState<Cita['tipusBici']>('carretera');
  const [triats, setTriats] = useState<Peca[]>(pecaInicial ? [pecaInicial] : []);
  const [diaTriat, setDiaTriat] = useState('');
  const [hora, setHora] = useState<string | null>(null);
  const [franges, setFranges] = useState<FranjaTaller[] | null>(null);
  const [errorsCamps, setErrorsCamps] = useState<Set<string>>(new Set());
  const [resultat, setResultat] = useState<ResultatReserva | null>(null);
  const [enviant, iniciaEnviament] = useTransition();

  const dia = diaTriat || dies[0] || '';
  // Avui només compten les hores que encara no han passat.
  const frangesVisibles = franges?.map((f) => (dia === avui && f.inici <= ara ? { ...f, places: 0 } : f)) ?? null;

  useEffect(() => {
    if (!dia) return;
    let viu = true;
    consultarFranges(dia).then((f) => {
      if (viu) setFranges(f);
    });
    return () => {
      viu = false;
    };
  }, [dia]);

  const formatDia = (d: string, opcions: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opcions).format(new Date(`${d}T12:00:00`));

  if (resultat?.ok && hora) {
    return (
      <div className={styles.fet} role="status">
        <p className={styles.fetMarca} aria-hidden="true">
          ✓
        </p>
        <h2>{t('fet.titol')}</h2>
        <p className={styles.codi}>
          <span>{tr('fet.codi')}</span>
          <strong>{resultat.codi}</strong>
        </p>
        <p>{t('fet.text', { data: formatDia(dia, { weekday: 'long', day: 'numeric', month: 'long' }), hora })}</p>
        <p className={styles.adreca}>{tr('fet.adreca')}</p>
        <button
          type="button"
          className="boto boto--clar"
          onClick={() => {
            setResultat(null);
            setHora(null);
          }}
        >
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
    const nota = String(form.get('nota') ?? '').trim();
    const privacitat = form.get('privacitat') === 'on';

    const errors = new Set<string>();
    if (triats.length === 0) errors.add('serveis');
    if (!hora) errors.add('hora');
    if (nom.length < 2) errors.add('nom');
    if (!/^\+?[\d\s().-]{9,20}$/.test(telefon)) errors.add('telefon');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu)) errors.add('correu');
    if (!privacitat) errors.add('privacitat');
    setErrorsCamps(errors);
    if (errors.size > 0) {
      setResultat({ ok: false, error: 'dades' });
      return;
    }

    iniciaEnviament(async () => {
      try {
        const r = await demanarCita({ tipusBici: tipus, serveis: triats, nota: nota || undefined, dia, hora, nom, telefon, correu, idioma: locale, privacitat });
        if (!r.ok && r.error === 'franja') {
          setHora(null);
          consultarFranges(dia).then(setFranges);
        }
        setResultat(r);
      } catch {
        setResultat({ ok: false, error: 'xarxa' });
      }
    });
  }

  const error = (camp: string) => errorsCamps.has(camp);
  const commuta = (p: Peca) => setTriats((actuals) => (actuals.includes(p) ? actuals.filter((x) => x !== p) : [...actuals, p]));
  const missatgeError =
    resultat && !resultat.ok
      ? resultat.error === 'franja'
        ? t('errors.franja')
        : resultat.error === 'xarxa'
          ? t('errors.xarxa')
          : error('serveis')
            ? t('errors.serveis')
            : t('errors.dades')
      : null;

  return (
    <form className={`${styles.panell} ${cita.formulari}`} onSubmit={enviar} noValidate>
      <fieldset className={cita.bloc}>
        <legend>
          <span className={cita.numero}>1</span>
          {t('pas1')}
        </legend>
        <div className={cita.xips}>
          {TIPUS.map((tp) => (
            <label key={tp} className={styles.segment}>
              <input type="radio" name="tipus" checked={tipus === tp} onChange={() => setTipus(tp)} />
              <span>{t(`tipus.${tp}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={cita.bloc} aria-invalid={error('serveis') || undefined}>
        <legend>
          <span className={cita.numero}>2</span>
          {t('pas2')}
        </legend>
        <p className={styles.ajuda}>{t('potsTriarMes')}</p>
        <ul className={cita.serveis}>
          {ORDRE_PECES.map((peca) => {
            const servei = serveis.find((s) => s.peca === peca);
            return (
              <li key={peca}>
                <label className={cita.servei}>
                  <input type="checkbox" checked={triats.includes(peca)} onChange={() => commuta(peca)} />
                  <span className={cita.serveiCos}>
                    <small>{ta(`peces.${peca}.nom`)}</small>
                    <strong>{ta(`peces.${peca}.servei`)}</strong>
                    {servei && (
                      <span>
                        {ta('desDe', { preu: formatEuros(servei.desDe, locale) })}
                        {servei.ficticia && <span className="mostra">*</span>}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <label className={styles.camp}>
          <span>{t('nota')}</span>
          <textarea name="nota" maxLength={500} placeholder={t('notaExemple')} />
        </label>
      </fieldset>

      <fieldset className={cita.bloc} aria-invalid={error('hora') || undefined}>
        <legend>
          <span className={cita.numero}>3</span>
          {t('pas3')}
        </legend>
        <div className={cita.dies} role="radiogroup" aria-label={t('pas3')}>
          {dies.map((d) => (
            <label key={d} className={cita.dia}>
              <input
                type="radio"
                name="dia"
                checked={dia === d}
                onChange={() => {
                  setDiaTriat(d);
                  setHora(null);
                  setFranges(null);
                }}
              />
              <span>
                <small>{formatDia(d, { weekday: 'short' })}</small>
                <strong>{formatDia(d, { day: 'numeric' })}</strong>
                <small>{formatDia(d, { month: 'short' })}</small>
              </span>
            </label>
          ))}
        </div>
        <p id={`${id}-franja`} className={cita.etiqueta}>
          {t('franja')}
        </p>
        {frangesVisibles === null ? (
          <p className={styles.ajuda}>{tr('carregant')}</p>
        ) : frangesVisibles.every((f) => f.places === 0) ? (
          <p className={styles.ajuda}>{t('senseFranges')}</p>
        ) : (
          <div className={cita.hores} role="radiogroup" aria-labelledby={`${id}-franja`}>
            {frangesVisibles.map((f) => (
              <label key={f.inici} className={cita.hora} data-ple={f.places === 0 || undefined}>
                <input type="radio" name="hora" checked={hora === f.inici} disabled={f.places === 0} onChange={() => setHora(f.inici)} />
                <span>
                  <strong>{f.inici}</strong>
                  <small>{t('places', { n: f.places })}</small>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className={cita.bloc}>
        <legend>
          <span className={cita.numero}>4</span>
          {t('pas4')}
        </legend>
        <label className={styles.camp} data-error={error('nom') || undefined}>
          <span>{tr('nom')}</span>
          <input name="nom" autoComplete="name" required aria-invalid={error('nom') || undefined} />
          {error('nom') && <em>{tr('camps.nom')}</em>}
        </label>
        <div className={styles.fila}>
          <label className={styles.camp} data-error={error('telefon') || undefined}>
            <span>{tr('telefon')}</span>
            <input name="telefon" type="tel" autoComplete="tel" inputMode="tel" required aria-invalid={error('telefon') || undefined} />
            {error('telefon') && <em>{tr('camps.telefon')}</em>}
          </label>
          <label className={styles.camp} data-error={error('correu') || undefined}>
            <span>{tr('correu')}</span>
            <input name="correu" type="email" autoComplete="email" required aria-invalid={error('correu') || undefined} />
            {error('correu') && <em>{tr('camps.correu')}</em>}
          </label>
        </div>
        <label className={styles.check} data-error={error('privacitat') || undefined}>
          <input name="privacitat" type="checkbox" required aria-invalid={error('privacitat') || undefined} />
          <span>{tr('privacitat')}</span>
        </label>
      </fieldset>

      <div className={styles.resum}>
        {missatgeError && (
          <p className={styles.error} role="alert">
            {missatgeError}
          </p>
        )}
        <button type="submit" className={`boto boto--blau ${styles.confirmar}`} disabled={enviant}>
          {enviant ? t('enviant') : t('confirmar')}
          {!enviant && hora && <span> · {formatDia(dia, { weekday: 'short', day: 'numeric' })}, {hora}</span>}
        </button>
      </div>
    </form>
  );
}
