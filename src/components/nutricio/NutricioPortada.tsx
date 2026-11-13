'use client';

// Nutrició esportiva, a la pàgina de la botiga (/botiga/nutricio). A dalt, el hero amb les quatre
// marques: cadascuna és una rajola amb els seus colors i tres productes, i és un filtre. Triar-ne una
// ensenya tots els seus productes a la graella i el fons del hero pren el color de la marca; tornar-hi
// a clicar la deixa anar i es tornen a veure tots. La graella també té els filtres per marca i pel
// moment de la ruta. El sabor canvia la foto. Amb `?marca=…` a l'adreça (des del carrusel de marques),
// la pàgina ja surt amb aquella marca triada, i l'adreça es manté al dia en canviar-la.
//
// Preus: només els que venen de la plataforma. Els de mostra (`ficticia`) no s'ensenyen, perquè
// l'equip de la botiga ha de poder confiar que el preu de la web és el bo.

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, type CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { MARQUES } from '@/content/marques';
import { colorSabor, destacats, imatgeDe, ORDRE_MARQUES, temaDe } from '@/content/nutricio';
import { enllacWhatsapp } from '@/lib/contacte';
import { momentNutricio, type MomentNutricio, type ProducteNutricio } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { useReducedMotion } from '@/lib/scroll-scene';
import { Paquet } from './Paquet';
import styles from './Nutricio.module.css';

/**
 * Les targetes esperen amagades fins que el catàleg arriba a la pantalla i llavors surten d'una en
 * una. Només amb JavaScript: sense, ja hi són (el CSS només les amaga amb `data-espera`).
 */
function apareixEnArribar(llista: HTMLUListElement | null) {
  if (!llista || llista.dataset.visible || typeof IntersectionObserver === 'undefined') return;
  llista.dataset.espera = 'true';
  const observador = new IntersectionObserver(
    ([entrada]) => {
      if (!entrada?.isIntersecting) return;
      llista.dataset.visible = 'true';
      observador.disconnect();
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  observador.observe(llista);
  return () => observador.disconnect();
}

/** Escriu la marca triada a l'adreça sense navegar, perquè l'enllaç es pugui compartir. */
function escriuMarca(marca: string | null) {
  const url = new URL(window.location.href);
  if (marca) url.searchParams.set('marca', marca);
  else url.searchParams.delete('marca');
  window.history.replaceState(window.history.state, '', url);
}

type Props = {
  productes: readonly ProducteNutricio[];
  /** Si es pot afegir a la reserva de lloguer. Si no, es demana per WhatsApp o a la botiga. */
  ambReserva: boolean;
};

/** Amb la marca de l'adreça (`?marca=…`). Va dins d'un `<Suspense>` amb `NutricioContingut` de reserva. */
export function NutricioPortada(props: Props) {
  const demanada = useSearchParams().get('marca');
  return <NutricioContingut key={demanada ?? ''} {...props} marcaInicial={demanada} />;
}

export function NutricioContingut({ productes, ambReserva, marcaInicial = null }: Props & { marcaInicial?: string | null }) {
  const t = useTranslations('nutricio');
  const tb = useTranslations('botigaCategoria');
  const te = useTranslations('equipament');
  const locale = useLocale();
  const reduit = useReducedMotion();
  const graella = useRef<HTMLDivElement>(null);
  const [marca, setMarca] = useState<string | null>(() =>
    marcaInicial && productes.some((p) => p.marca === marcaInicial) ? marcaInicial : null,
  );
  const [moment, setMoment] = useState<MomentNutricio | null>(null);
  const [sabors, setSabors] = useState<Record<string, string>>({});

  const marques = [...ORDRE_MARQUES.filter((m) => productes.some((p) => p.marca === m)), ...new Set(productes.map((p) => p.marca).filter((m) => !(ORDRE_MARQUES as readonly string[]).includes(m)))];
  // Sense marca triada, les marques s'intercalen: la primera fila ja n'ensenya de totes.
  const posicio = (p: ProducteNutricio) => productes.filter((x) => x.marca === p.marca).indexOf(p) * marques.length + marques.indexOf(p.marca);
  const filtrats = productes
    .filter((p) => (!marca || p.marca === marca) && (!moment || p.moments.includes(moment)))
    .sort((a, b) => (marca ? 0 : posicio(a) - posicio(b)));
  const nomSabor = (p: ProducteNutricio, s: string) => p.sabors.find((x) => x.id === s)?.nom ?? t(`sabors.${s}`);
  const temaHero = marca ? temaDe(marca) : null;

  const canviaMarca = (m: string | null) => {
    setMarca(m);
    escriuMarca(m);
  };
  /** Des del hero: tria o deixa anar la marca, i baixa fins als productes. */
  const triaDelHero = (m: string) => {
    const nova = marca === m ? null : m;
    canviaMarca(nova);
    if (nova) graella.current?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="nutricio" className={styles.seccio} aria-label={t('situacio')}>
      <header
        className={styles.hero}
        data-triada={marca ? temaDe(marca).clau : undefined}
        style={temaHero ? ({ '--hero-fons': temaHero.fons, '--hero-accent': temaHero.accent } as CSSProperties) : undefined}
      >
        <div className={`contenidor ${styles.heroText}`}>
          <Link href="/#equipament" className={styles.tornar}>
            ← {tb('tornar')}
          </Link>
          <p className="situacio">{te('situacio')}</p>
          <h1 className={styles.titol}>{t('situacio')}</h1>
          <p className={styles.intro}>{t('intro')}</p>
        </div>

        <div className="contenidor">
          <div role="group" aria-label={t('triaMarca')} className={styles.marquesHero}>
            {marques.map((m, i) => {
              const tema = temaDe(m);
              const logo = MARQUES.find((x) => x.nom === m)?.logo;
              const seus = productes.filter((p) => p.marca === m);
              return (
                <button
                  key={m}
                  type="button"
                  className={styles.rajola}
                  aria-pressed={marca === m}
                  aria-label={t('veureMarca', { marca: m, n: seus.length })}
                  data-apagada={(marca !== null && marca !== m) || undefined}
                  style={{ '--marca': tema.fons, '--marca-text': tema.text, '--marca-accent': tema.accent, '--i': i } as CSSProperties}
                  onClick={() => triaDelHero(m)}
                >
                  <span className={styles.rajolaCap}>
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- logos petits retallats
                      <img src={`/img/marques/${logo}`} alt="" className={styles.rajolaLogo} />
                    ) : (
                      <span className={styles.rajolaNom}>{m}</span>
                    )}
                    <span className={styles.rajolaMarca} aria-hidden="true" />
                  </span>
                  <span className={styles.rajolaLema}>{t(`marques.${tema.clau}`)}</span>
                  <span className={styles.rajolaProductes} aria-hidden="true">
                    {destacats(seus, 3).map((p, j) => {
                      const img = imatgeDe(p, p.sabors[0]!.id);
                      return (
                        <span key={p.id} className={styles.rajolaPeca} style={{ '--j': j } as CSSProperties}>
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element -- retalls petits amb transparència
                            <img src={img} alt="" loading="lazy" decoding="async" />
                          ) : (
                            <Paquet marca={p.marca} nom={p.nom} tipus={p.tipus} sabor={p.sabors[0]!.id} />
                          )}
                        </span>
                      );
                    })}
                  </span>
                  <span className={styles.rajolaPeu}>
                    <span>{t('productesN', { n: seus.length })}</span>
                    <span className={styles.rajolaEstat} aria-hidden="true">
                      {marca === m ? `✓ ${t('triada')}` : t('mira')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div ref={graella} className={`contenidor ${styles.graella}`}>
        <div className={styles.filtres}>
          <div role="group" aria-label={t('marca')} className={styles.pastilles}>
            <button type="button" aria-pressed={marca === null} onClick={() => canviaMarca(null)}>
              {t('totes')}
            </button>
            {marques.map((m) => (
              <button key={m} type="button" aria-pressed={marca === m} onClick={() => canviaMarca(marca === m ? null : m)} style={{ '--marca': temaDe(m).fons } as CSSProperties}>
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
        <p className={styles.momentText} aria-live="polite">
          {moment ? t(`momentsText.${moment}`) : t('resultat', { n: filtrats.length, marca: marca ?? t('totesMarques') })}
        </p>

        <ul ref={apareixEnArribar} id="nutricio-productes" className={styles.productes}>
          {filtrats.map((p, i) => {
            const sabor = sabors[p.id] ?? p.sabors[0]!.id;
            const img = imatgeDe(p, sabor);
            const tema = temaDe(p.marca);
            return (
              <li
                key={`${marca}-${moment}-${p.id}`}
                className={styles.targeta}
                data-marca={tema.clau}
                style={{ '--marca': tema.fons, '--marca-accent': tema.accent, '--i': Math.min(i, 12) } as CSSProperties}
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
                            style={{ '--sabor': colorSabor(s.id) } as CSSProperties}
                            onClick={() => setSabors((x) => ({ ...x, [p.id]: s.id }))}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className={styles.saborUnic}>{nomSabor(p, sabor)}</span>
                    )}
                    {!p.ficticia && <p className={styles.preu}>{formatEuros(p.preu, locale)}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {filtrats.length === 0 && <p className={styles.buit}>{t('buit')}</p>}

        <div className={styles.peu}>
          {ambReserva ? (
            <>
              <Link href="/#flota" className="boto boto--blau">
                {t('ambLaBici')} <span className="fletxa" aria-hidden="true">→</span>
              </Link>
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
