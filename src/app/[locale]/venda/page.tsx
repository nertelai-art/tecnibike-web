import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { textPreuVenda } from '@/components/venda/preu';
import { Link } from '@/i18n/navigation';
import { optimitzable } from '@/lib/imatges';
import { plataforma } from '@/lib/plataforma';
import styles from '@/components/venda/Venda.module.css';

// Bicis en venda: els productes de venda de la categoria de bicis del catàleg de la plataforma
// («Bicicletes»). No té res a veure amb la flota de lloguer, que és a la portada. Mentre la botiga no
// n'hagi donat d'alta cap, surten les de mostra, amb un avís ben visible i sense preu.

// Es torna a generar cada 5 minuts (REVALIDA_S de la plataforma), perquè el que canviï a la plataforma
// hi surti: vegeu src/app/revalida.test.ts.
export const revalidate = 300;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venda' });
  return { title: `${t('titol')} · Tecnibike`, description: t('intro') };
}

export default async function BicisEnVenda({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('venda');
  const bicis = await plataforma.bicisVenda();
  const deMostra = bicis.some((b) => b.ficticia);

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <header className={styles.cap}>
          <div className="contenidor">
            <Link href="/" className={styles.tornar}>
              ← {t('tornarInici')}
            </Link>
            <p className="situacio">{t('situacio')}</p>
            <h1 className="titol-seccio">{t('titol')}</h1>
            <p className="intro">{t('intro')}</p>
          </div>
        </header>

        <div className="contenidor">
          {deMostra && (
            <p className={styles.avisMostra} role="note">
              <strong>{t('mostraEtiqueta')}</strong>
              <span>{t('mostra')}</span>
            </p>
          )}

          <ul className={styles.graella}>
            {bicis.map((b) => (
              <li key={b.id}>
                <Link href={`/venda/${b.id}`} className={styles.targeta}>
                  <div className={styles.foto}>
                    {b.imatge && <Image src={b.imatge} alt="" width={640} height={480} sizes="(min-width: 900px) 33vw, 90vw" unoptimized={!optimitzable(b.imatge)} />}
                    {b.ficticia && <span className={styles.etiquetaMostra}>{t('mostraEtiqueta')}</span>}
                  </div>
                  <div className={styles.dades}>
                    {b.marca && <p className={styles.marca}>{b.marca}</p>}
                    <h2 className={styles.nom}>{b.nom}</h2>
                    {b.variants.length > 0 && (
                      <p className={styles.variantsResum}>
                        {b.nomVariants ?? t('opcions')}: {b.variants.map((v) => v.nom).join(' · ')}
                      </p>
                    )}
                    {!b.ficticia && b.disponibilitat && b.disponibilitat !== 'disponible' && (
                      <p className={styles.disponibilitat} data-estat={b.disponibilitat}>
                        {t(`disponibilitat.${b.disponibilitat}`)}
                      </p>
                    )}
                    {/* El preu, només si ve de la plataforma: les de mostra no en porten. */}
                    {!b.ficticia && (
                      <p className={styles.preu}>
                        {textPreuVenda(b, t, locale)}
                        {b.preu !== null && <small>{t(b.ivaInclos ? 'ivaInclos' : 'ivaNoInclos')}</small>}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Peu />
    </>
  );
}
