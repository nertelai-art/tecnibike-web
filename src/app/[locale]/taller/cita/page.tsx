import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CitaTaller } from '@/components/reserva/CitaTaller';
import { Peu } from '@/components/Seccions';
import { Link } from '@/i18n/navigation';
import { plataforma } from '@/lib/plataforma';
import { peca } from '@/lib/plataforma/esquema';
import styles from '@/components/reserva/Reserva.module.css';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ peca?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cita' });
  return { title: `${t('titol')} · Tecnibike` };
}

export default async function PaginaCita({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cita');
  const tt = await getTranslations('taller');
  const tb = await getTranslations('botiga');
  const serveis = await plataforma.serveisTaller();
  const triada = peca.safeParse((await searchParams).peca);

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <div className="contenidor">
          <Link href="/#taller" className={styles.tornar}>
            ← {t('tornar')}
          </Link>
          <div className={styles.graella}>
            <div>
              <p className="situacio">{tt('situacio')}</p>
              <h1 className="titol-seccio">{t('titol')}</h1>
              <p className="intro">{t('intro')}</p>
              <div className={`${styles.columna} ${styles.columnaFlux}`}>
                <CitaTaller serveis={serveis} pecaInicial={triada.success ? triada.data : null} />
              </div>
            </div>
            <aside className={styles.costat}>
              <div className={styles.foto}>
                <Image src="/img/botiga/interior-ebikes.jpg" alt={tb('fotos.interiorEbikes')} fill sizes="(min-width: 980px) 35vw, 100vw" />
              </div>
              <ul className={styles.avantatges}>
                <li>{tt('avantatges.whatsapp')}</li>
                <li>{tt('avantatges.pressupost')}</li>
                <li>{tt('avantatges.cafe')}</li>
                <li>{tt('electrica')}</li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
      <Peu />
    </>
  );
}
