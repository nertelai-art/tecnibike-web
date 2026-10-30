'use client';

// Flota de lloguer: cada targeta sencera porta a la fitxa de la bici. En canviar de categoria, les
// targetes surten amb un fos, la graella canvia d'alçada suaument i les noves entren esglaonades.

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useId, useLayoutEffect, useRef, useState, ViewTransition, type CSSProperties } from 'react';
import type { BiciLloguer, CategoriaLloguer } from '@/lib/plataforma/esquema';
import { Link } from '@/i18n/navigation';
import { formatEuros, preuMinimPerDia, preuPerDia } from '@/lib/preus';
import { useReducedMotion } from '@/lib/scroll-scene';
import { Revela } from './Revela';
import styles from './Flota.module.css';

type Filtre = 'totes' | CategoriaLloguer;
const FILTRES: Filtre[] = ['totes', 'muntanya', 'carretera', 'gravel', 'passeig'];
/** Durada de la sortida de les targetes (igual que al CSS). */
const SORTIDA_MS = 260;

export function Flota({ flota }: { flota: BiciLloguer[] }) {
  const t = useTranslations('flota');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [filtre, setFiltre] = useState<Filtre>('totes');
  const [sortint, setSortint] = useState(false);
  const [canvis, setCanvis] = useState(0);
  const graella = useRef<HTMLUListElement>(null);
  const alcadaAbans = useRef(0);
  const id = useId();
  const visibles = filtre === 'totes' ? flota : flota.filter((bici) => bici.categoria === filtre);
  const euros = (centims: number | undefined) => (centims === undefined ? '—' : formatEuros(centims, locale));

  const tria = (f: Filtre) => {
    if (f === filtre || sortint) return;
    if (reduced) {
      setFiltre(f);
      return;
    }
    alcadaAbans.current = graella.current?.offsetHeight ?? 0;
    setSortint(true);
    window.setTimeout(() => {
      setFiltre(f);
      setCanvis((n) => n + 1);
      setSortint(false);
    }, SORTIDA_MS);
  };

  // L'alçada de la graella passa de la vella a la nova amb una transició, sense salt.
  useLayoutEffect(() => {
    const el = graella.current;
    if (!el || !alcadaAbans.current) return;
    const nova = el.offsetHeight;
    el.style.height = `${alcadaAbans.current}px`;
    void el.offsetHeight;
    el.style.transition = 'height 0.5s var(--ease)';
    el.style.height = `${nova}px`;
    alcadaAbans.current = 0;
    const fi = window.setTimeout(() => {
      el.style.height = '';
      el.style.transition = '';
    }, 520);
    return () => window.clearTimeout(fi);
  }, [canvis]);

  const targeta = (bici: BiciLloguer) => (
    <Link className={styles.enllac} href={`/lloguer/${bici.id}`} aria-label={`${t('reservar')}: ${bici.nom}`}>
      {/* El mateix nom que a la fitxa: en entrar-hi, la bici creix i es col·loca (vegeu globals.css). */}
      <ViewTransition name={`bici-${bici.id}`} share="morph" default="none">
        <div className={styles.escenari}>
          {bici.electrica && <span className={styles.etiqueta}>{t('electrica')}</span>}
          <Image src={bici.imatge} alt="" width={640} height={380} sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw" />
        </div>
      </ViewTransition>
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
          <span className="boto boto--blau boto--petit" aria-hidden="true">
            {t('reservar')}
          </span>
        </div>
        <ul className={styles.talles} aria-label={t('talles')}>
          {bici.talles.map((talla) => (
            <li key={talla}>{talla}</li>
          ))}
        </ul>
      </div>
    </Link>
  );

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
                onClick={() => tria(f)}
              >
                {t(`categories.${f}`)}
              </button>
            ))}
          </div>
        </div>

        <ul id={`${id}-graella`} ref={graella} className={styles.graella} role="tabpanel" data-sortint={sortint || undefined}>
          {visibles.map((bici, index) =>
            // La primera vegada entren amb el scroll; després de canviar de categoria, esglaonades.
            canvis === 0 ? (
              <Revela as="li" key={bici.id} retard={(index % 3) * 70} className={styles.targeta}>
                {targeta(bici)}
              </Revela>
            ) : (
              <li key={`${canvis}-${bici.id}`} className={`${styles.targeta} ${styles.entra}`} style={{ '--i': Math.min(index, 8) } as CSSProperties}>
                {targeta(bici)}
              </li>
            ),
          )}
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
