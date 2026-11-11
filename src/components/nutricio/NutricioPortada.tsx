'use client';

// Secció de nutrició de l'inici. Primer, l'escena de les marques (EscenaMarques): un capítol per
// marca amb els seus productes, fotos reals, que giren sobre si mateixos amb el scroll. Després, la
// graella de productes amb filtres per marca i pel moment de la ruta, que n'ensenya vuit i la resta
// amb «Veure'n més», per no allargar la portada. El sabor canvia la foto.

import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { colorSabor, imatgeDe, ORDRE_MARQUES, temaDe } from '@/content/nutricio';
import { enllacWhatsapp } from '@/lib/contacte';
import { momentNutricio, type MomentNutricio, type ProducteNutricio } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { useReducedMotion } from '@/lib/scroll-scene';
import { EscenaMarques } from './EscenaMarques';
import { Paquet } from './Paquet';
import styles from './Nutricio.module.css';

/** Productes que es veuen abans de «Veure'n més». */
const VISIBLES = 8;

type Props = {
  productes: readonly ProducteNutricio[];
  /** Si es pot afegir a la reserva de lloguer. Si no, es demana per WhatsApp o a la botiga. */
  ambReserva: boolean;
};

export function NutricioPortada({ productes, ambReserva }: Props) {
  const t = useTranslations('nutricio');
  const locale = useLocale();
  const reduit = useReducedMotion();
  const graella = useRef<HTMLDivElement>(null);
  const [marca, setMarca] = useState<string | null>(null);
  const [moment, setMoment] = useState<MomentNutricio | null>(null);
  const [sabors, setSabors] = useState<Record<string, string>>({});
  const [tots, setTots] = useState(false);

  const marques = [...ORDRE_MARQUES.filter((m) => productes.some((p) => p.marca === m)), ...new Set(productes.map((p) => p.marca).filter((m) => !(ORDRE_MARQUES as readonly string[]).includes(m)))];
  // Sense marca triada, les marques s'intercalen: els primers vuit ja n'ensenyen de totes.
  const posicio = (p: ProducteNutricio) => productes.filter((x) => x.marca === p.marca).indexOf(p) * marques.length + marques.indexOf(p.marca);
  const filtrats = productes
    .filter((p) => (!marca || p.marca === marca) && (!moment || p.moments.includes(moment)))
    .sort((a, b) => (marca ? 0 : posicio(a) - posicio(b)));
  const visibles = tots ? filtrats : filtrats.slice(0, VISIBLES);
  const nomSabor = (p: ProducteNutricio, s: string) => p.sabors.find((x) => x.id === s)?.nom ?? t(`sabors.${s}`);

  const triaMarca = (m: string) => {
    setMarca(m);
    setTots(false);
    graella.current?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="nutricio" className={styles.seccio} aria-labelledby="nutricio-titol">
      <div className={`contenidor ${styles.cap}`}>
        <p className="situacio">{t('situacio')}</p>
        <h2 id="nutricio-titol" className="titol-seccio">
          {t('titol')}
        </h2>
        <p className="intro">{t('intro')}</p>
      </div>

      <EscenaMarques marques={marques} productes={productes} onTria={triaMarca} />

      <div ref={graella} className={`contenidor ${styles.graella}`}>
        <div className={styles.filtres}>
          <div role="group" aria-label={t('marca')} className={styles.pastilles}>
            <button type="button" aria-pressed={marca === null} onClick={() => setMarca(null)}>
              {t('totes')}
            </button>
            {marques.map((m) => (
              <button key={m} type="button" aria-pressed={marca === m} onClick={() => setMarca(m)} style={{ '--marca': temaDe(m).fons } as React.CSSProperties}>
                <span aria-hidden="true" />
                {m}
              </button>
            ))}
          </div>
          <div role="group" aria-label={t('quan')} className={styles.pastilles}>
            <button type="button" aria-pressed={moment === null} onClick={() => setMoment(null)}>
              {t('tot')}
            </button>
            {momentNutricio.options.map((m) => (
              <button key={m} type="button" aria-pressed={moment === m} onClick={() => setMoment(m)}>
                {t(`moments.${m}`)}
              </button>
            ))}
          </div>
        </div>
        {moment && <p className={styles.momentText}>{t(`momentsText.${moment}`)}</p>}

        <ul id="nutricio-productes" className={styles.productes} aria-live="polite">
          {visibles.map((p, i) => {
            const sabor = sabors[p.id] ?? p.sabors[0]!.id;
            const img = imatgeDe(p, sabor);
            const tema = temaDe(p.marca);
            return (
              <li
                key={`${marca}-${moment}-${p.id}`}
                className={styles.targeta}
                data-marca={tema.clau}
                style={{ '--marca': tema.fons, '--marca-accent': tema.accent, '--i': i % VISIBLES } as React.CSSProperties}
              >
                <div className={styles.foto}>
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element -- retalls petits amb transparència
                    <img key={img} src={img} alt={`${p.marca} ${p.nom} · ${nomSabor(p, sabor)}`} loading="lazy" decoding="async" />
                  ) : (
                    <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={sabor} />
                  )}
                  {p.cafeinaMg !== undefined && <span className={styles.cafeina}>{t('cafeina', { mg: p.cafeinaMg })}</span>}
                </div>
                <div className={styles.dades}>
                  <p className={styles.marca}>{p.marca}</p>
                  <h3 className={styles.nom}>{p.nom}</h3>
                  <p className={styles.xifres}>
                    {p.format}
                    {p.carbohidratsG !== undefined && <> · {t('carbohidrats', { g: p.carbohidratsG })}</>}
                  </p>
                  <p className={styles.descripcio}>{p.descripcio ?? t(`productes.${p.id}`)}</p>
                  <div className={styles.peuTargeta}>
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
                      </div>
                    ) : (
                      <span className={styles.saborUnic}>{nomSabor(p, sabor)}</span>
                    )}
                    <p className={styles.preu}>
                      {formatEuros(p.preu, locale)}
                      {p.ficticia && <span className="mostra">*</span>}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {filtrats.length === 0 && <p className={styles.buit}>{t('buit')}</p>}
        {filtrats.length > VISIBLES && (
          <button type="button" className={`boto boto--clar ${styles.veureMes}`} aria-expanded={tots} aria-controls="nutricio-productes" onClick={() => setTots((x) => !x)}>
            {tots ? t('veureMenys') : t('veureMes', { n: filtrats.length - VISIBLES })}
          </button>
        )}

        <div className={styles.peu}>
          {ambReserva ? (
            <>
              <a href="#flota" className="boto boto--blau">
                {t('ambLaBici')} <span className="fletxa" aria-hidden="true">→</span>
              </a>
              <a className={styles.whatsapp} href={enllacWhatsapp(t('missatge'))} target="_blank" rel="noopener noreferrer">
                {t('perWhatsapp')}
              </a>
            </>
          ) : (
            <a className="boto boto--blau" href={enllacWhatsapp(t('missatge'))} target="_blank" rel="noopener noreferrer">
              {t('demanaWhatsapp')} <span className="fletxa" aria-hidden="true">→</span>
            </a>
          )}
          <p className={styles.nota}>{t('nota')}</p>
        </div>
      </div>
    </section>
  );
}
