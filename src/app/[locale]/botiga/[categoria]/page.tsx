import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { CATEGORIES_EQUIPAMENT, FOTOS_EQUIPAMENT, marquesDeCategoria } from '@/content/equipament';
import { Link } from '@/i18n/navigation';
import { enllacWhatsapp } from '@/lib/contacte';
import { plataforma } from '@/lib/plataforma';
import { categoriaEquipament } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import styles from '@/components/botiga/Categoria.module.css';

// Pàgina d'una categoria de la botiga d'equipament. Ja llista els articles de la plataforma amb el
// preu; quan es pugui vendre en línia, el botó de WhatsApp es canvia per «Afegeix a la cistella».

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
  const articles = await plataforma.articles(categoria);
  const marques = marquesDeCategoria(categoria);

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
                {m.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats)
                  <img src={`/img/marques/${m.logo}`} alt={m.nom} data-vector={m.logo.endsWith('.svg') || undefined} />
                ) : (
                  <span>{m.nom}</span>
                )}
              </li>
            ))}
          </ul>

          <p className={styles.avis}>{t('aviat')}</p>

          <ul className={styles.articles}>
            {articles.map((a) => {
              const logo = marques.find((m) => m.nom === a.marca)?.logo;
              return (
                <li key={a.id} className={styles.article}>
                  <div className={styles.imatge} aria-hidden="true">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- fins que hi hagi fotos de producte, el logo de la marca
                      <img src={`/img/marques/${logo}`} alt="" />
                    ) : (
                      <span>{a.marca}</span>
                    )}
                  </div>
                  <div className={styles.dades}>
                    <p className={styles.marca}>{a.marca}</p>
                    <h2 className={styles.nom}>{a.nom}</h2>
                    <p className={styles.preu}>
                      {formatEuros(a.preu, locale)}
                      {a.ficticia && <span className="mostra">*</span>}
                    </p>
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
