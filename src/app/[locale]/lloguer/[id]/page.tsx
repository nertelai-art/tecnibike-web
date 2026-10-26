import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ReservaLloguer } from '@/components/reserva/ReservaLloguer';
import { Peu } from '@/components/Seccions';
import { Link } from '@/i18n/navigation';
import { plataforma } from '@/lib/plataforma';
import { formatEuros, preuMinimPerDia } from '@/lib/preus';
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
          <div className={styles.graella}>
            {/* La columna esquerra es queda fixa i la dreta (el panell de reserva) fa scroll. */}
            <div className={styles.columnaFixa}>
              <div className={styles.escenari}>
                <div className={styles.etiquetes}>
                  <span className={`${styles.etiqueta} ${styles['etiqueta--fosca']}`}>{t('nova')}</span>
                  {bici.electrica && <span className={styles.etiqueta}>{tf('electrica')}</span>}
                </div>
                <Image src={bici.imatge} alt={bici.nom} width={1200} height={720} priority sizes="(min-width: 980px) 60vw, 100vw" />
              </div>
              <section className={styles.inclou} aria-labelledby="inclou-titol">
                <h2 id="inclou-titol">{t('fitxa.titol')}</h2>
                <ul>
                  {inclou.map((clau) => (
                    <li key={clau}>{t(`fitxa.items.${clau}`)}</li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className={styles.columna} aria-labelledby="bici-nom">
              <div className={styles.capPanell}>
                <p className={styles.categoria}>{tf(`categories.${bici.categoria}`)}</p>
                <h1 id="bici-nom" className={styles.nom}>
                  {bici.nom}
                </h1>
                <div className={styles.ratlla} aria-hidden="true" />
                <p className={styles.model}>
                  {bici.model.valor}
                  {bici.model.ficticia && <span className="mostra">*</span>}
                </p>
                <p className={styles.desDe}>{t('desDe', { preu: formatEuros(preuMinimPerDia(bici.tarifa), locale) })}</p>
              </div>
              <ReservaLloguer bici={bici} flota={flota} extres={extres} horari={horari} configuracio={configuracio} />
            </aside>
          </div>
        </div>
      </main>
      <Peu />
    </>
  );
}
