import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { ACTUALITZADA, SECCIONS_PRIVACITAT } from '@/content/privacitat';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './Privacitat.module.css';

// La política de privacitat pròpia de Tecnibike (25-11-2026). El text és a `src/content/privacitat.ts`.

type Params = { params: Promise<{ locale: string }> };

const idioma = (locale: string): Locale => (routing.locales as readonly string[]).includes(locale) ? (locale as Locale) : routing.defaultLocale;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacitatPagina' });
  return { title: `${t('titol')} · Tecnibike` };
}

export default async function Privacitat({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, format] = await Promise.all([getTranslations('privacitatPagina'), getFormatter()]);
  const seccions = SECCIONS_PRIVACITAT[idioma(locale)];

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <div className={`contenidor ${styles.text}`}>
          <Link href="/" className={styles.tornar}>
            {t('tornar')}
          </Link>
          <h1 className="titol-seccio">{t('titol')}</h1>
          <p className={styles.data}>{t('actualitzada', { data: format.dateTime(new Date(`${ACTUALITZADA}T12:00:00Z`), { dateStyle: 'long' }) })}</p>
          {seccions.map((seccio) => (
            <section key={seccio.titol} className={styles.seccio}>
              <h2 className={styles.subtitol}>{seccio.titol}</h2>
              {seccio.paragrafs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {seccio.llista && (
                <ul>
                  {seccio.llista.map((linia) => (
                    <li key={linia}>{linia}</li>
                  ))}
                </ul>
              )}
              {seccio.despres?.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Peu />
    </>
  );
}
