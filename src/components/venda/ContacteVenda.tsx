'use client';

// Formulari petit de la fitxa d'una bici en venda: nom, telèfon, correu (opcional), la talla si en
// té i un missatge. La petició arriba a l'equip de la botiga, que truca. Sense WhatsApp: és la
// plataforma qui la fa arribar (enviarContacteVenda), i si no la pot rebre la fitxa no ensenya el
// formulari (ho decideix la pàgina) i demana que truquin.

import { useLocale, useTranslations } from 'next-intl';
import { useId, useState, useTransition, type FormEvent } from 'react';
import { demanarContacteVenda, type ResultatReserva } from '@/app/[locale]/accions';
import formulari from '@/components/reserva/Reserva.module.css';
import styles from './Venda.module.css';

type Props = { biciId: string; nomBici: string; variants: readonly string[]; nomVariants: string };

export function ContacteVenda({ biciId, nomBici, variants, nomVariants }: Props) {
  const t = useTranslations('venda.contacte');
  const tr = useTranslations('reserva');
  const locale = useLocale();
  const id = useId();
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [resultat, setResultat] = useState<ResultatReserva | null>(null);
  const [telefonEnviat, setTelefonEnviat] = useState('');
  const [enviant, iniciaEnviament] = useTransition();

  if (resultat?.ok) {
    return (
      <div className={styles.contacte} role="status">
        <p className={styles.contacteFet}>✓ {t('fetTitol')}</p>
        <p>{t('fetText', { telefon: telefonEnviat })}</p>
      </div>
    );
  }

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = String(form.get('nom') ?? '').trim();
    const telefon = String(form.get('telefon') ?? '').trim();
    const correu = String(form.get('correu') ?? '').trim();
    const variant = String(form.get('variant') ?? '').trim();
    const missatge = String(form.get('missatge') ?? '').trim() || t('missatgeDefecte', { bici: nomBici });
    const privacitat = form.get('privacitat') === 'on';

    const nous = new Set<string>();
    if (nom.length < 2) nous.add('nom');
    if (!/^\+?[\d\s().-]{9,20}$/.test(telefon)) nous.add('telefon');
    if (correu && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu)) nous.add('correu');
    if (!privacitat) nous.add('privacitat');
    setErrors(nous);
    if (nous.size > 0) {
      setResultat({ ok: false, error: 'dades' });
      return;
    }

    iniciaEnviament(async () => {
      try {
        const r = await demanarContacteVenda({
          biciId,
          ...(variant && { variant }),
          missatge,
          nom,
          telefon,
          ...(correu && { correu }),
          idioma: locale,
          privacitat,
        });
        if (r.ok) setTelefonEnviat(telefon);
        setResultat(r);
      } catch {
        setResultat({ ok: false, error: 'xarxa' });
      }
    });
  }

  const error = (camp: string) => errors.has(camp);
  const missatgeError =
    resultat && !resultat.ok ? (resultat.error === 'noDisponible' ? t('errors.noDisponible') : resultat.error === 'xarxa' ? t('errors.xarxa') : t('errors.dades')) : null;

  return (
    <form className={styles.contacte} onSubmit={enviar} noValidate aria-labelledby={`${id}-titol`}>
      <h2 id={`${id}-titol`} className={styles.contacteTitol}>
        {t('titol')}
      </h2>
      <p className={styles.contacteIntro}>{t('intro')}</p>

      <div className={styles.contacteCamps}>
        <label className={formulari.camp} data-error={error('nom') || undefined}>
          <span>{tr('nom')}</span>
          <input name="nom" autoComplete="name" required aria-invalid={error('nom') || undefined} />
          {error('nom') && <em>{tr('camps.nom')}</em>}
        </label>
        <label className={formulari.camp} data-error={error('telefon') || undefined}>
          <span>{t('telefon')}</span>
          <input name="telefon" type="tel" autoComplete="tel" required aria-invalid={error('telefon') || undefined} />
          {error('telefon') && <em>{tr('camps.telefon')}</em>}
        </label>
        <label className={formulari.camp} data-error={error('correu') || undefined}>
          <span>{t('correu')}</span>
          <input name="correu" type="email" autoComplete="email" aria-invalid={error('correu') || undefined} />
          {error('correu') && <em>{tr('camps.correu')}</em>}
        </label>
        {variants.length > 0 && (
          <label className={formulari.camp}>
            <span>{nomVariants}</span>
            <select name="variant" defaultValue="">
              <option value="">{t('variantQualsevol')}</option>
              {variants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={`${formulari.camp} ${styles.contacteMissatge}`}>
          <span>{t('missatge')}</span>
          <textarea name="missatge" maxLength={1000} placeholder={t('missatgeDefecte', { bici: nomBici })} />
        </label>
      </div>

      <label className={formulari.check} data-error={error('privacitat') || undefined}>
        <input type="checkbox" name="privacitat" required />
        <span>{tr('privacitat')}</span>
      </label>

      {missatgeError && (
        <p className={formulari.errorSolt} role="alert">
          {missatgeError}
        </p>
      )}

      <button type="submit" className="boto boto--blau" disabled={enviant}>
        {enviant ? t('enviant') : t('enviar')}
      </button>
    </form>
  );
}
