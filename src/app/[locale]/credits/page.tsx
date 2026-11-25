import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { CATEGORIES_EQUIPAMENT, FOTOS_EQUIPAMENT, type Foto } from '@/content/equipament';
import { FOTOS_EXTRES } from '@/content/fotos-extres';
import { Link } from '@/i18n/navigation';
import styles from './Credits.module.css';

// Crèdits de les fotos de Wikimedia Commons: les llicències CC demanen citar l'autor i la llicència.
// Abans eren un desplegable al peu; ara són aquí, amb un enllaç petit des del peu. Quan la botiga
// tingui fotos pròpies, les que se substitueixin marxen d'aquí soles (surten de FOTOS_EQUIPAMENT i
// FOTOS_EXTRES).

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'credits' });
  return { title: `${t('metaTitol')} · Tecnibike`, robots: { index: false } };
}

function Llista({ fotos, t }: { fotos: { foto: Foto; nom?: string }[]; t: (clau: string) => string }) {
  return (
    <ul className={styles.llista}>
      {fotos.map(({ foto, nom }) => (
        <li key={foto.src} className={styles.foto}>
          <div className={styles.miniatura}>
            <Image src={foto.src} alt="" fill sizes="160px" />
          </div>
          <div>
            {nom && <p className={styles.nom}>{nom}</p>}
            <p>
              {t('autor')}:{' '}
              <a href={foto.font} target="_blank" rel="noopener noreferrer">
                {foto.autor}
              </a>
            </p>
            <p>
              {t('llicencia')}:{' '}
              <a href={foto.llicenciaUrl} target="_blank" rel="noopener noreferrer license">
                {foto.llicencia}
              </a>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function Credits({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('credits');
  const te = await getTranslations('equipament');

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <div className="contenidor">
          <Link href="/" className={styles.tornar}>
            {t('tornar')}
          </Link>
          <h1 className="titol-seccio">{t('titol')}</h1>
          <p className="intro">{t('intro')}</p>

          <h2 className={styles.subtitol}>{t('equipament')}</h2>
          <Llista t={t} fotos={CATEGORIES_EQUIPAMENT.map((c) => ({ foto: FOTOS_EQUIPAMENT[c], nom: te(`categories.${c}.nom`) }))} />

          <h2 className={styles.subtitol}>{t('extres')}</h2>
          <Llista t={t} fotos={Object.values(FOTOS_EXTRES).map((foto) => ({ foto }))} />
        </div>
      </main>
      <Peu />
    </>
  );
}
