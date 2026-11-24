'use client';

// Flota de lloguer i bicis en venda: cada targeta sencera porta a la fitxa de la bici. El selector
// «Lloguer | Compra» canvia la graella aquí mateix, sense canviar de pàgina (l'Enric, 16-11-2026). En
// canviar de categoria o de lloguer a compra, les targetes surten amb un fos, la graella canvia d'alçada
// suaument i les noves entren esglaonades. En clicar una bici, la foto creix fins a la seva fitxa.

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useLayoutEffect, useRef, useState, ViewTransition, type CSSProperties } from 'react';
import type { BiciLloguer, BiciVenda, CategoriaLloguer } from '@/lib/plataforma/esquema';
import { Link } from '@/i18n/navigation';
import { optimitzable } from '@/lib/imatges';
import { formatEuros, preuMinimPerDia, preuPerDia } from '@/lib/preus';
import { useReducedMotion } from '@/lib/scroll-scene';
import { Revela } from './Revela';
import styles from './Flota.module.css';
import { SelectorLloguerCompra } from './SelectorLloguerCompra';
import { textPreuVenda } from './venda/preu';

type Filtre = 'totes' | CategoriaLloguer;
const FILTRES: Filtre[] = ['totes', 'muntanya', 'carretera', 'gravel', 'passeig'];
/** Durada de la sortida de les targetes (igual que al CSS). */
const SORTIDA_MS = 260;

type Mode = 'lloguer' | 'compra';

export function Flota({ flota, venda = [] }: { flota: BiciLloguer[]; venda?: BiciVenda[] }) {
  const t = useTranslations('flota');
  const tv = useTranslations('venda');
  const [mode, setMode] = useState<Mode>('lloguer');
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

  /** Les targetes d'ara surten, es fa el canvi i les noves entren (sense moviment, de cop). */
  const canvia = (fes: () => void) => {
    if (sortint) return;
    if (reduced) {
      fes();
      return;
    }
    alcadaAbans.current = graella.current?.offsetHeight ?? 0;
    setSortint(true);
    window.setTimeout(() => {
      fes();
      setCanvis((n) => n + 1);
      setSortint(false);
    }, SORTIDA_MS);
  };
  const tria = (f: Filtre) => f !== filtre && canvia(() => setFiltre(f));
  const triaMode = (m: Mode) => {
    if (m === mode) return;
    // L'adreça se'n recorda (#compra): en tornar enrere des d'una fitxa, la graella és la que s'havia triat.
    window.history.replaceState(window.history.state, '', m === 'compra' ? '#compra' : window.location.pathname + window.location.search);
    canvia(() => setMode(m));
  };
  // Si s'hi arriba amb #compra (o es torna enrere des d'una fitxa de venda), la graella ja és la de compra.
  useEffect(() => {
    if (window.location.hash === '#compra') setMode('compra'); // eslint-disable-line react-hooks/set-state-in-effect -- l'adreça només es pot llegir al navegador
  }, []);
  const deMostra = venda.some((b) => b.ficticia);

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
          <Image
            src={bici.imatge}
            alt=""
            width={640}
            height={380}
            sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw"
            unoptimized={!optimitzable(bici.imatge)}
          />
        </div>
      </ViewTransition>
      <div className={styles.cos}>
        <p className={styles.categoria}>{t(`categories.${bici.categoria}`)}</p>
        <h3 className={styles.nom}>{bici.nom}</h3>
        {bici.model.valor && (
          <p className={styles.model}>
            {bici.model.valor}
            {bici.model.ficticia && <span className="mostra">*</span>}
          </p>
        )}
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

  const targetaVenda = (bici: BiciVenda) => {
    const estat = bici.ficticia ? tv('mostraEtiqueta') : bici.disponibilitat && bici.disponibilitat !== 'disponible' ? tv(`disponibilitat.${bici.disponibilitat}`) : null;
    return (
      <Link className={styles.enllac} href={`/venda/${bici.id}`} aria-label={`${t('veureBici')}: ${bici.nom}`}>
        {/* El mateix nom que a la fitxa de venda: en entrar-hi, la foto creix i es col·loca. */}
        <ViewTransition name={`venda-${bici.id}`} share="morph" default="none">
          <div className={styles.escenari}>
            {estat && <span className={styles.etiqueta}>{estat}</span>}
            {bici.imatge && (
              <Image src={bici.imatge} alt="" width={640} height={380} sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw" unoptimized={!optimitzable(bici.imatge)} />
            )}
          </div>
        </ViewTransition>
        <div className={styles.cos}>
          {bici.marca && <p className={styles.categoria}>{bici.marca}</p>}
          <h3 className={styles.nom}>{bici.nom}</h3>
          <div className={styles.peu}>
            {/* El preu, només si ve de la plataforma: les de mostra no en porten. */}
            <p className={styles.preu}>{!bici.ficticia && <strong>{textPreuVenda(bici, tv, locale)}</strong>}</p>
            <span className="boto boto--blau boto--petit" aria-hidden="true">
              {t('veureBici')}
            </span>
          </div>
          {bici.variants.length > 0 && (
            <ul className={styles.talles} aria-label={bici.nomVariants ?? tv('opcions')}>
              {bici.variants.map((v) => (
                <li key={v.nom}>{v.nom}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section id="flota" className={`seccio ${styles.flota}`} aria-labelledby={`${id}-titol`}>
      <div className="contenidor">
        <div className={styles.cap}>
          <div>
            {/* On hi havia l'etiqueta «— Lloguer», el selector entre la flota i les bicis en venda. */}
            <SelectorLloguerCompra actiu={mode} onTria={triaMode} controla={`${id}-graella`} />
            <h2 id={`${id}-titol`} className="titol-seccio">
              {t('titol')}
            </h2>
          </div>
          {/* Les categories són de la flota de lloguer: a la compra no hi són. */}
          {mode === 'lloguer' && (
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
          )}
        </div>

        {mode === 'compra' && deMostra && (
          <p className={styles.avisMostra} role="note">
            <strong>{tv('mostraEtiqueta')}</strong> {tv('mostra')}
          </p>
        )}

        <ul id={`${id}-graella`} ref={graella} className={styles.graella} role="tabpanel" data-sortint={sortint || undefined}>
          {mode === 'lloguer'
            ? visibles.map((bici, index) =>
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
              )
            : venda.map((bici, index) => (
                <li key={`${canvis}-${bici.id}`} className={`${styles.targeta} ${styles.entra}`} style={{ '--i': Math.min(index, 8) } as CSSProperties}>
                  {targetaVenda(bici)}
                </li>
              ))}
        </ul>

        {mode === 'lloguer' && (
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
        )}
      </div>
    </section>
  );
}
