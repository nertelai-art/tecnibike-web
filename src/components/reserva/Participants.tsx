'use client';

// Dades de cada ciclista i signatura del contracte, després de reservar i abans de recollir. Només
// surt quan la plataforma té els participants activats (avui no): la botiga ho fa en paper.

import { useTranslations } from 'next-intl';
import { useState, useTransition, type FormEvent } from 'react';
import { enviarParticipants } from '@/app/[locale]/accions';
import { Signatura } from './Signatura';
import styles from './Reserva.module.css';

type Props = { codi: string; noms: readonly string[] };

export function Participants({ codi, noms }: Props) {
  const t = useTranslations('reserva.participants');
  const tr = useTranslations('reserva');
  const [signatures, setSignatures] = useState<(string | null)[]>(() => noms.map(() => null));
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [estat, setEstat] = useState<'obert' | 'fet' | 'error'>('obert');
  const [enviant, iniciaEnviament] = useTransition();

  if (estat === 'fet') return <p className={styles.participantsFet}>{t('fet')}</p>;

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nous = new Set<string>();
    const participants = noms.map((_, i) => {
      const nom = String(form.get(`nom-${i}`) ?? '').trim();
      const document = String(form.get(`document-${i}`) ?? '').trim();
      if (nom.length < 2) nous.add(`participants.${i}.nom`);
      if (document.length < 5) nous.add(`participants.${i}.document`);
      if (!signatures[i]) nous.add(`participants.${i}.signatura`);
      return { nom, document, signatura: signatures[i] ?? '' };
    });
    const condicions = form.get('condicions') === 'on';
    if (!condicions) nous.add('condicions');
    setErrors(nous);
    if (nous.size > 0) return;
    iniciaEnviament(async () => {
      const r = await enviarParticipants({ codi, participants, condicions });
      if (r.ok) setEstat('fet');
      else {
        if (r.camps) setErrors(new Set(r.camps));
        setEstat('error');
      }
    });
  }

  const error = (camp: string) => errors.has(camp);

  return (
    <form className={styles.participants} onSubmit={enviar} noValidate>
      <h3>{t('titol')}</h3>
      <p className={styles.ajuda}>{t('intro')}</p>
      {noms.map((nomInicial, i) => (
        <fieldset key={i} className={styles.grup}>
          <legend>{t('ciclista', { n: i + 1 })}</legend>
          <div className={styles.fila}>
            <label className={styles.camp} data-error={error(`participants.${i}.nom`) || undefined}>
              <span>{t('nom')}</span>
              <input name={`nom-${i}`} defaultValue={nomInicial} autoComplete="off" />
            </label>
            <label className={styles.camp} data-error={error(`participants.${i}.document`) || undefined}>
              <span>{t('document')}</span>
              <input name={`document-${i}`} autoComplete="off" />
            </label>
          </div>
          <p className={styles.etiquetaGrup}>{t('signatura')}</p>
          <Signatura etiqueta={t('signaAqui')} esborrar={t('esborrar')} onCanvi={(png) => setSignatures((s) => s.map((x, j) => (j === i ? png : x)))} />
          {error(`participants.${i}.signatura`) && <em className={styles.errorSolt}>{t('falta')}</em>}
        </fieldset>
      ))}
      <label className={styles.check} data-error={error('condicions') || undefined}>
        <input name="condicions" type="checkbox" />
        <span>{t('condicions')}</span>
      </label>
      {estat === 'error' && (
        <p className={styles.error} role="alert">
          {tr('errors.xarxa')}
        </p>
      )}
      <button type="submit" className={`boto boto--blau ${styles.confirmar}`} disabled={enviant}>
        {enviant ? tr('enviant') : t('enviar')}
      </button>
    </form>
  );
}
