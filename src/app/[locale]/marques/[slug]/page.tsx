import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { CATEGORIES_EQUIPAMENT } from '@/content/equipament';
import { fitxaMarca, FITXES_MARQUES } from '@/content/fitxes-marques';
import { enllacMarca, MARQUES, slugMarca, type Marca } from '@/content/marques';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { enllacWhatsapp } from '@/lib/contacte';
import styles from '@/components/marques/Fitxa.module.css';

// Fitxa d'una marca de bicis, components o equipament: d'on és, què fa, què en destaquem i què pots
// fer amb ella a Tecnibike (llogar una bici, muntar-la al taller o trobar-la a la botiga). Les de
// nutrició no en tenen: porten al catàleg de nutrició filtrat (`enllacMarca`).

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return FITXES_MARQUES.map((f) => ({ slug: f.slug }));
}

function marcaDe(slug: string): Marca | undefined {
  return MARQUES.find((m) => m.categoria !== 'nutricio' && slugMarca(m) === slug);
}

function idioma(locale: string): Locale {
  return (routing.locales as readonly string[]).includes(locale) ? (locale as Locale) : routing.defaultLocale;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const marca = marcaDe(slug);
  const fitxa = fitxaMarca(slug);
  if (!marca || !fitxa) return {};
  const l = idioma(locale);
  return {
    title: `${marca.nom} · Tecnibike`,
    description: fitxa.lema[l],
    ...(fitxa.imatges[0] && { openGraph: { images: [fitxa.imatges[0].src] } }),
  };
}

export default async function FitxaDeMarca({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const marca = marcaDe(slug);
  const fitxa = fitxaMarca(slug);
  if (!marca || !fitxa) notFound();
  const l = idioma(locale);
  const t = await getTranslations('fitxaMarca');
  const tm = await getTranslations('marques');
  const te = await getTranslations('equipament');

  const [portada, producte] = fitxa.imatges;
  const pais = new Intl.DisplayNames([locale], { type: 'region' }).of(fitxa.pais);
  const germanes = MARQUES.filter((m) => m.categoria === marca.categoria && m.nom !== marca.nom);
  // A quina pàgina de la botiga es troba l'equipament d'aquesta marca (cascs, ulleres, roba…).
  const categoriaBotiga = CATEGORIES_EQUIPAMENT.find((c) => (marca.tipus as string[]).includes(c));
  const whatsapp = enllacWhatsapp(tm('missatge', { marca: marca.nom }));
  const fonts = [...new Set(fitxa.imatges.map((i) => new URL(i.font).origin))];

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <header className={styles.cap} data-sense-foto={!portada || undefined}>
          {portada && <Image src={portada.src} alt="" fill priority sizes="100vw" className={styles.fons} />}
          <div className={`contenidor ${styles.capText}`}>
            <Link href="/#marques" className={styles.tornar}>
              ← {t('tornar')}
            </Link>
            {marca.logo && (
              <span className={styles.logo}>
                {/* eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats) */}
                <img src={`/img/marques/${marca.logo}`} alt="" data-vector={marca.logo.endsWith('.svg') || undefined} />
              </span>
            )}
            <p className="situacio">{tm(`categories.${marca.categoria}`)}</p>
            <h1 className={styles.nom}>{marca.nom}</h1>
            <p className={styles.lema}>{fitxa.lema[l]}</p>
            <ul className={styles.dades} aria-label={t('dades')}>
              {pais && <li>{pais}</li>}
              {fitxa.any && <li>{t('desDe', { any: fitxa.any })}</li>}
              <li>{marca.tipus.map((tipus) => tm(`tipus.${tipus}`)).join(' · ')}</li>
            </ul>
          </div>
        </header>

        <div className={`contenidor ${styles.cos}`}>
          <section className={styles.historia} aria-labelledby="marca-historia">
            <h2 id="marca-historia" className={styles.titolPetit}>
              {t('historia')}
            </h2>
            <p className={styles.descripcio}>{fitxa.descripcio[l]}</p>

            <h2 className={styles.titolPetit}>{t('destacats')}</h2>
            <ol className={styles.destacats}>
              {fitxa.destacats.map((d) => (
                <li key={d.nom}>
                  <strong>{d.nom}</strong>
                  <span>{d.descripcio[l]}</span>
                </li>
              ))}
            </ol>

            <a className={styles.web} href={fitxa.web} target="_blank" rel="noopener noreferrer">
              {t('web', { marca: marca.nom })} ↗
            </a>
          </section>

          <figure className={styles.producte}>
            {producte ? (
              <Image src={producte.src} alt={producte.descripcio} fill sizes="(min-width: 900px) 45vw, 100vw" />
            ) : marca.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- sense foto de producte, el logo de la marca
              <img src={`/img/marques/${marca.logo}`} alt="" className={styles.logoGran} />
            ) : null}
          </figure>
        </div>

        <section className={`contenidor ${styles.accio}`} aria-labelledby="marca-accio">
          <div>
            <h2 id="marca-accio" className={styles.accioTitol}>
              {t(`accio.${marca.categoria}.titol`, { marca: marca.nom })}
            </h2>
            <p>{t(`accio.${marca.categoria}.text`, { marca: marca.nom })}</p>
          </div>
          <div className={styles.botons}>
            {marca.categoria === 'bicis' && (
              <Link href="/#flota" className="boto">
                {t('accio.bicis.boto')} <span className="fletxa">→</span>
              </Link>
            )}
            {marca.categoria === 'components' && (
              <Link href="/taller/cita" className="boto">
                {t('accio.components.boto')} <span className="fletxa">→</span>
              </Link>
            )}
            {marca.categoria === 'equipament' && categoriaBotiga && (
              <Link href={`/botiga/${categoriaBotiga}`} className="boto">
                {t('accio.equipament.boto', { categoria: te(`categories.${categoriaBotiga}.nom`).toLowerCase() })}{' '}
                <span className="fletxa">→</span>
              </Link>
            )}
            <a className="boto boto--clar" href={whatsapp} target="_blank" rel="noopener noreferrer">
              {tm('pregunta', { marca: marca.nom })}
            </a>
          </div>
        </section>

        {germanes.length > 0 && (
          <nav className={`contenidor ${styles.germanes}`} aria-label={t('mes', { categoria: tm(`categories.${marca.categoria}`).toLowerCase() })}>
            <h2 className={styles.titolPetit}>{t('mes', { categoria: tm(`categories.${marca.categoria}`).toLowerCase() })}</h2>
            <ul>
              {germanes.map((m) => (
                <li key={m.nom}>
                  <Link href={enllacMarca(m)} aria-label={m.nom}>
                    {m.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats)
                      <img src={`/img/marques/${m.logo}`} alt="" data-vector={m.logo.endsWith('.svg') || undefined} />
                    ) : (
                      <span>{m.nom}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {fonts.length > 0 && (
          <p className={`contenidor ${styles.credits}`}>
            {t('credits', { marca: marca.nom })}{' '}
            {fonts.map((f, i) => (
              <span key={f}>
                {i > 0 && ', '}
                <a href={f} target="_blank" rel="noopener noreferrer">
                  {new URL(f).hostname.replace(/^www\./, '')}
                </a>
              </span>
            ))}
            .
          </p>
        )}
      </main>
      <Peu />
    </>
  );
}
