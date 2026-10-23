'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import type { BiciLloguer, CategoriaLloguer } from '@/lib/plataforma/esquema';
import { Link } from '@/i18n/navigation';
import { formatEuros, preuMinimPerDia, preuPerDia } from '@/lib/preus';
import { Revela } from './Revela';
import styles from './Flota.module.css';

type Filtre = 'totes' | CategoriaLloguer;
const FILTRES: Filtre[] = ['totes', 'muntanya', 'carretera', 'gravel', 'passeig'];

export function Flota({ flota }: { flota: BiciLloguer[] }) {
  const t = useTranslations('flota');
  const locale = useLocale();
  const [filtre, setFiltre] = useState<Filtre>('totes');
  const id = useId();
  const visibles = filtre === 'totes' ? flota : flota.filter((bici) => bici.categoria === filtre);
  const euros = (centims: number | undefined) => (centims === undefined ? '—' : formatEuros(centims, locale));

  return (
    <section id="flota" className={`seccio ${styles.flota}`} aria-labelledby={`${id}-titol`}>
      <div className="contenidor">
        <div className={styles.cap}>
          <div>
            <p className="situacio">{t('situacio')}</p>
            <h2 id={`${id}-titol`} className="titol-seccio">
              {t('titol')}
            </h2>
            <p className="intro">{t('intro')}</p>
          </div>
          <div className={styles.filtres} role="tablist" aria-label={t('situacio')}>
            {FILTRES.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filtre === f}
                aria-controls={`${id}-graella`}
                className={styles.filtre}
                onClick={() => setFiltre(f)}
              >
                {t(`categories.${f}`)}
              </button>
            ))}
          </div>
        </div>

        <ul id={`${id}-graella`} className={styles.graella} role="tabpanel">
          {visibles.map((bici, index) => (
            <Revela as="li" key={bici.id} retard={(index % 3) * 70} className={styles.targeta}>
              <div className={styles.escenari}>
                {bici.electrica && <span className={styles.etiqueta}>{t('electrica')}</span>}
                <Image src={bici.imatge} alt="" width={640} height={380} sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw" />
              </div>
              <div className={styles.cos}>
                <p className={styles.categoria}>{t(`categories.${bici.categoria}`)}</p>
                <h3 className={styles.nom}>{bici.nom}</h3>
                <p className={styles.model}>
                  {bici.model.valor}
                  {bici.model.ficticia && <span className="mostra">*</span>}
                </p>
                <div className={styles.peu}>
                  <p className={styles.preu}>
                    <span>{t('desDe')}</span>
                    <strong>{euros(preuMinimPerDia(bici.tarifa))}</strong>
                    <span>{t('perDia')}</span>
                  </p>
                  <Link className="boto boto--blau boto--petit" href={`/lloguer/${bici.id}`} aria-label={`${t('reservar')}: ${bici.nom}`}>
                    {t('reservar')}
                  </Link>
                </div>
                <ul className={styles.talles} aria-label={t('talles')}>
                  {bici.talles.map((talla) => (
                    <li key={talla}>{talla}</li>
                  ))}
                </ul>
              </div>
            </Revela>
          ))}
        </ul>

        <details className={styles.tarifes}>
          <summary>
            <span>{t('tarifes.obrir')}</span>
            <span aria-hidden="true" className={styles.mes}>
              +
            </span>
          </summary>
          <div className={styles.taulaEmbolcall}>
            <table className={styles.taula}>
              <caption className="sr-only">{t('tarifes.titol')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('tarifes.bici')}</th>
                  <th scope="col">{t('tarifes.dia')}</th>
                  <th scope="col">{t('tarifes.migDia')}</th>
                  <th scope="col">{t('tarifes.de2a6')}</th>
                  <th scope="col">{t('tarifes.mesDe6')}</th>
                </tr>
              </thead>
              <tbody>
                {flota.map((bici) => (
                  <tr key={bici.id}>
                    <th scope="row">{bici.nom}</th>
                    <td>{euros(bici.tarifa.dia)}</td>
                    <td>{euros(bici.tarifa.migDia)}</td>
                    <td>{euros(preuPerDia(bici.tarifa, { tipus: 'dies', dies: 2 }) ?? undefined)}</td>
                    <td>{euros(preuPerDia(bici.tarifa, { tipus: 'dies', dies: 7 }) ?? undefined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.nota}>{t('tarifes.nota')}</p>
          </div>
        </details>
      </div>
    </section>
  );
}
