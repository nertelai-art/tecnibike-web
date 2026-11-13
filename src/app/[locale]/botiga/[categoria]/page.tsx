import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { NutricioPortada } from '@/components/nutricio/NutricioPortada';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { CATEGORIES_EQUIPAMENT, FOTOS_EQUIPAMENT, marquesDeCategoria } from '@/content/equipament';
import { enllacMarca } from '@/content/marques';
import { Link } from '@/i18n/navigation';
import { enllacWhatsapp } from '@/lib/contacte';
import { plataforma } from '@/lib/plataforma';
import { categoriaEquipament } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import styles from '@/components/botiga/Categoria.module.css';

// Pàgina d'una categoria de la botiga d'equipament. Llista els articles de la plataforma; el preu
// només surt si ve de la plataforma (els de mostra no s'ensenyen). Ara es pregunta per WhatsApp;
// quan es pugui vendre en línia, el botó es canvia per «Afegeix a la cistella».
//
// La nutrició té la seva pròpia secció (escena de marques i catàleg amb sabors): NutricioPortada.
// Cada marca de la tira porta a la seva fitxa, o a la graella filtrada si és de nutrició.

type Params = { params: Promise<{ locale: string; categoria: string }> };

export function generateStaticParams() {
  return CATEGORIES_EQUIPAMENT.map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, categoria } = await params;
  const valida = categoriaEquipament.safeParse(categoria);
  if (!valida.success) return {};
  const t = await getTranslations({ locale, namespace: 'equipament' });
  return { title: `${t(`categories.${valida.data}.nom`)} · Tecnibike`, description: t(`categories.${valida.data}.text`) };
}

export default async function CategoriaBotiga({ params }: Params) {
  const { locale, categoria: param } = await params;
  setRequestLocale(locale);
  const valida = categoriaEquipament.safeParse(param);
  if (!valida.success) notFound();
  const categoria = valida.data;
  const t = await getTranslations('botigaCategoria');
  const te = await getTranslations('equipament');
  const marques = marquesDeCategoria(categoria);
  const esNutricio = categoria === 'nutricio';
  const [articles, nutricio, configuracio] = await Promise.all([
    esNutricio ? [] : plataforma.articles(categoria),
    esNutricio ? plataforma.nutricio() : [],
    plataforma.configuracioReserves(),
  ]);

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <header className={styles.cap}>
          <Image src={FOTOS_EQUIPAMENT[categoria].src} alt="" fill priority sizes="100vw" className={styles.fons} />
          <div className={`contenidor ${styles.capText}`}>
            <Link href="/#equipament" className={styles.tornar}>
              ← {t('tornar')}
            </Link>
            <p className="situacio">{te('situacio')}</p>
            <h1 className="titol-seccio">{te(`categories.${categoria}.nom`)}</h1>
            <p className="intro">{te(`categories.${categoria}.text`)}</p>
          </div>
        </header>

        <div className="contenidor">
          <ul className={styles.marques} aria-label={te('marques')}>
            {marques.map((m) => (
              <li key={m.nom}>
                <Link href={enllacMarca(m)} aria-label={t('veureMarca', { marca: m.nom })}>
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats)
                    <img src={`/img/marques/${m.logo}`} alt={m.nom} data-vector={m.logo.endsWith('.svg') || undefined} />
                  ) : (
                    <span>{m.nom}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {!esNutricio && <p className={styles.avis}>{t('aviat')}</p>}
        </div>

        {esNutricio && (
          // L'escena llegeix la marca de l'adreça (?marca=…): cal un límit de Suspense en una pàgina estàtica.
          <Suspense>
            <NutricioPortada productes={nutricio} ambReserva={configuracio.nutricio.actiu} />
          </Suspense>
        )}

        <div className="contenidor">
          <ul className={styles.articles}>
            {articles.map((a) => {
              const logo = marques.find((m) => m.nom === a.marca)?.logo;
              return (
                <li key={a.id} className={styles.article}>
                  <div className={styles.imatge} aria-hidden="true">
                    {a.imatge ? (
                      // eslint-disable-next-line @next/next/no-img-element -- la foto de la plataforma, de qualsevol mida
                      <img src={a.imatge} alt="" data-foto />
                    ) : logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- sense foto de producte, el logo de la marca
                      <img src={`/img/marques/${logo}`} alt="" />
                    ) : (
                      <span>{a.marca}</span>
                    )}
                  </div>
                  <div className={styles.dades}>
                    <p className={styles.marca}>{a.marca}</p>
                    <h2 className={styles.nom}>{a.nom}</h2>
                    {a.descripcio && <p className={styles.descripcio}>{a.descripcio}</p>}
                    {/* El preu, només si ve de la plataforma: els de mostra no s'ensenyen. */}
                    {!a.ficticia && (
                      <p className={styles.preu}>
                        {a.preu === null || a.preuBase === 'consultar'
                          ? t('preuConsultar')
                          : a.preuBase === 'desDe'
                            ? t('preuDesDe', { preu: formatEuros(a.preu, locale) })
                            : formatEuros(a.preu, locale)}
                      </p>
                    )}
                    <a
                      className="boto boto--blau"
                      href={enllacWhatsapp(t('missatge', { article: `${a.marca} ${a.nom}` }))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('reservar')}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Peu />
    </>
  );
}
