'use client';

// Secció de nutrició de l'inici. Primer, els quatre expositors de la botiga, un per marca amb els
// seus colors, que pugen amb el scroll i s'omplen de paquets (CSS amb línia de temps de vista; sense
// suport o amb menys moviment, ja hi són). Després, els productes, filtrats per marca (clicant un
// expositor) i pel moment de la ruta, amb el sabor que repinta el paquet. Les il·lustracions són
// pròpies: no són fotos ni dissenys de les marques.

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { colorSabor, ORDRE_MARQUES, temaDe } from '@/content/nutricio';
import { enllacWhatsapp } from '@/lib/contacte';
import { momentNutricio, type MomentNutricio, type ProducteNutricio } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { Paquet } from './Paquet';
import styles from './Nutricio.module.css';

type Props = {
  productes: readonly ProducteNutricio[];
  /** Si es pot afegir a la reserva de lloguer. Si no, es demana per WhatsApp o a la botiga. */
  ambReserva: boolean;
};

const estil = (marca: string) => {
  const tema = temaDe(marca);
  return { '--fons': tema.fons, '--text': tema.text, '--accent': tema.accent } as React.CSSProperties;
};

export function NutricioPortada({ productes, ambReserva }: Props) {
  const t = useTranslations('nutricio');
  const locale = useLocale();
  const [marca, setMarca] = useState<string | null>(null);
  const [moment, setMoment] = useState<MomentNutricio | null>(null);
  const [sabors, setSabors] = useState<Record<string, string>>({});

  const marques = [...ORDRE_MARQUES.filter((m) => productes.some((p) => p.marca === m)), ...new Set(productes.map((p) => p.marca).filter((m) => !(ORDRE_MARQUES as readonly string[]).includes(m)))];
  const visibles = productes.filter((p) => (!marca || p.marca === marca) && (!moment || p.moments.includes(moment)));
  const nomSabor = (p: ProducteNutricio, s: string) => p.sabors.find((x) => x.id === s)?.nom ?? t(`sabors.${s}`);
  const lema = (m: string) => (t.has(`marques.${temaDe(m).clau}`) ? t(`marques.${temaDe(m).clau}`) : '');

  return (
    <section id="nutricio" className={styles.seccio} aria-labelledby="nutricio-titol">
      {/* La cinta de fons, que llisca amb el scroll. */}
      <div className={styles.cinta} aria-hidden="true">
        <span>
          {Array.from({ length: 4 }, () => momentNutricio.options.map((m) => t(`moments.${m}`)).join(' · ')).join(' · ')}
        </span>
      </div>

      <div className="contenidor">
        <header className={styles.cap}>
          <p className="situacio">{t('situacio')}</p>
          <h2 id="nutricio-titol" className="titol-seccio">
            {t('titol')}
          </h2>
          <p className="intro">{t('intro')}</p>
        </header>

        <ul className={styles.expositors} aria-label={t('expositors')}>
          {marques.map((m) => {
            const seus = productes.filter((p) => p.marca === m);
            // Tres prestatges, com a la botiga, amb els productes repartits.
            const prestatges = [0, 1, 2].map((fila) => seus.filter((_, i) => i % 3 === fila).slice(0, 2));
            return (
              <li key={m} className={styles.expositor} data-marca={temaDe(m).clau} style={estil(m)}>
                <button
                  type="button"
                  aria-pressed={marca === m}
                  aria-controls="nutricio-productes"
                  onClick={() => setMarca(marca === m ? null : m)}
                >
                  <span className={styles.expositorNom}>{m}</span>
                  <span className={styles.expositorLema}>{lema(m)}</span>
                  <span className={styles.prestatges} aria-hidden="true">
                    {prestatges.map((fila, i) => (
                      <span key={i} className={styles.prestatge}>
                        {fila.map((p) => (
                          <Paquet key={p.id} marca={m} nom={p.nom} tipus={p.tipus} sabor={p.sabors[0]!.id} className={styles.paquetPrestatge} />
                        ))}
                      </span>
                    ))}
                  </span>
                  <span className={styles.expositorPeu}>
                    {marca === m ? t('totesMarques') : t('veure', { n: seus.length })}
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.filtres}>
          <div role="group" aria-label={t('quan')} className={styles.moments}>
            <button type="button" aria-pressed={moment === null} onClick={() => setMoment(null)}>
              {t('tot')}
            </button>
            {momentNutricio.options.map((m) => (
              <button key={m} type="button" aria-pressed={moment === m} onClick={() => setMoment(m)}>
                {t(`moments.${m}`)}
              </button>
            ))}
          </div>
          {marca && (
            <button type="button" className={styles.treuMarca} onClick={() => setMarca(null)} style={estil(marca)}>
              {marca}
              <span aria-hidden="true">×</span>
              <span className="sr-only">{t('totesMarques')}</span>
            </button>
          )}
        </div>
        {moment && <p className={styles.momentText}>{t(`momentsText.${moment}`)}</p>}

        <ul id="nutricio-productes" className={styles.productes} aria-live="polite">
          {visibles.map((p, i) => {
            const sabor = sabors[p.id] ?? p.sabors[0]!.id;
            return (
              <li key={`${marca}-${moment}-${p.id}`} className={styles.targeta} data-marca={temaDe(p.marca).clau} style={{ ...estil(p.marca), '--i': i } as React.CSSProperties}>
                <div className={styles.escena}>
                  <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={sabor} className={styles.paquetGran} />
                </div>
                <div className={styles.dades}>
                  <p className={styles.marca}>{p.marca}</p>
                  <h3 className={styles.nom}>{p.nom}</h3>
                  <p className={styles.descripcio}>{p.descripcio ?? t(`productes.${p.id}`)}</p>
                  <ul className={styles.xifres}>
                    <li>{p.format}</li>
                    {p.carbohidratsG !== undefined && <li>{t('carbohidrats', { g: p.carbohidratsG })}</li>}
                    {p.cafeinaMg !== undefined && <li data-cafeina>{t('cafeina', { mg: p.cafeinaMg })}</li>}
                    {p.moments.map((m) => (
                      <li key={m} data-moment>
                        {t(`moments.${m}`)}
                      </li>
                    ))}
                  </ul>
                  {p.sabors.length > 1 ? (
                    <div className={styles.sabors} role="radiogroup" aria-label={t('saborDe', { producte: p.nom })}>
                      {p.sabors.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={sabor === s.id}
                          title={nomSabor(p, s.id)}
                          aria-label={nomSabor(p, s.id)}
                          style={{ '--sabor': colorSabor(s.id) } as React.CSSProperties}
                          onClick={() => setSabors((x) => ({ ...x, [p.id]: s.id }))}
                        />
                      ))}
                      <span className={styles.saborNom}>{nomSabor(p, sabor)}</span>
                    </div>
                  ) : (
                    <p className={styles.saborUnic}>{nomSabor(p, sabor)}</p>
                  )}
                  <p className={styles.preu}>
                    {t('perUnitat', { preu: formatEuros(p.preu, locale) })}
                    {p.ficticia && <span className="mostra">*</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {visibles.length === 0 && <p className={styles.buit}>{t('buit')}</p>}

        <div className={styles.peu}>
          {ambReserva ? (
            <>
              <a href="#flota" className="boto boto--fosc-sobre-fosc">
                {t('ambLaBici')} <span className="fletxa" aria-hidden="true">→</span>
              </a>
              <a className={styles.whatsapp} href={enllacWhatsapp(t('missatge'))} target="_blank" rel="noopener noreferrer">
                {t('perWhatsapp')}
              </a>
            </>
          ) : (
            <a className="boto boto--fosc-sobre-fosc" href={enllacWhatsapp(t('missatge'))} target="_blank" rel="noopener noreferrer">
              {t('demanaWhatsapp')} <span className="fletxa" aria-hidden="true">→</span>
            </a>
          )}
          <p className={styles.nota}>{t('nota')}</p>
        </div>
      </div>
    </section>
  );
}
