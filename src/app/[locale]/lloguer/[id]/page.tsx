import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ViewTransition } from 'react';
import { ReservaLloguer } from '@/components/reserva/ReservaLloguer';
import { Peu } from '@/components/Seccions';
import { Link } from '@/i18n/navigation';
import { plataforma } from '@/lib/plataforma';
import styles from '@/components/reserva/Reserva.module.css';

type Params = { params: Promise<{ locale: string; id: string }> };

export async function generateStaticParams() {
  return (await plataforma.flota()).map((bici) => ({ id: bici.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const bici = await plataforma.bici(id);
  return bici ? { title: `${bici.nom} · Tecnibike` } : {};
}

export default async function FitxaLloguer({ params }: Params) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const [bici, flota, extres, horari, configuracio] = await Promise.all([
    plataforma.bici(id),
    plataforma.flota(),
    plataforma.extres(),
    plataforma.horari(),
    plataforma.configuracioReserves(),
  ]);
  if (!bici) notFound();
  const t = await getTranslations('reserva');
  const tf = await getTranslations('flota');
  const inclou = ['revisada', 'talla', 'casc', 'kit'] as const;

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <div className="contenidor">
          <Link href="/#flota" className={styles.tornar}>
            ← {t('tornar')}
          </Link>
          <ReservaLloguer
            bici={bici}
            flota={flota}
            extres={extres}
            horari={horari}
            configuracio={configuracio}
            foto={
              // El mateix nom que a la targeta de la flota: la bici creix i es col·loca (vegeu globals.css).
              <ViewTransition name={`bici-${bici.id}`} share="morph" default="none">
                <div className={styles.escenari}>
                  <div className={styles.etiquetes}>
                    <span className={`${styles.etiqueta} ${styles['etiqueta--fosca']}`}>{t('nova')}</span>
                    {bici.electrica && <span className={styles.etiqueta}>{tf('electrica')}</span>}
                  </div>
                  {/* A escriptori, la mateixa mida que la targeta: la foto ja és baixada i la transició no l'espera. */}
                  <Image src={bici.imatge} alt={bici.nom} width={1200} height={720} priority sizes="(min-width: 1100px) 400px, 90vw" />
                </div>
              </ViewTransition>
            }
            inclou={
              <section className={styles.inclou} aria-labelledby="inclou-titol">
                <h2 id="inclou-titol">{t('fitxa.titol')}</h2>
                <ul>
                  {inclou.map((clau) => (
                    <li key={clau}>{t(`fitxa.items.${clau}`)}</li>
                  ))}
                </ul>
              </section>
            }
          />
        </div>
      </main>
      <Peu />
    </>
  );
}
