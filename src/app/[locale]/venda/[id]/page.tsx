import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { Galeria } from '@/components/venda/Galeria';
import { textPreuVenda } from '@/components/venda/preu';
import { Link } from '@/i18n/navigation';
import { enllacWhatsapp } from '@/lib/contacte';
import { plataforma } from '@/lib/plataforma';
import { formatEuros } from '@/lib/preus';
import styles from '@/components/venda/Venda.module.css';

// Fitxa d'una bici en venda: la foto, el preu, les talles, la descripció i la fitxa tècnica (els camps
// que la botiga hi ha posat al catàleg). Tecnibike encara no ven en línia: es pregunta per WhatsApp i
// es reserva a la botiga.

// Es torna a generar cada 5 minuts (REVALIDA_S de la plataforma), perquè el que canviï a la plataforma
// hi surti: vegeu src/app/revalida.test.ts.
export const revalidate = 300;

type Params = { params: Promise<{ locale: string; id: string }> };

export async function generateStaticParams() {
  return (await plataforma.bicisVenda()).map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const bici = await plataforma.biciVenda(id);
  if (!bici) return {};
  return {
    title: `${[bici.marca, bici.nom].filter(Boolean).join(' ')} · Tecnibike`,
    ...(bici.descripcio && { description: bici.descripcio }),
    ...(bici.imatge && { openGraph: { images: [bici.imatge] } }),
  };
}

/** El nom d'un camp del catàleg («quadre», «elèctrica») amb la primera lletra en majúscula. */
const nomCamp = (camp: string) => camp.charAt(0).toLocaleUpperCase() + camp.slice(1);

export default async function FitxaVenda({ params }: Params) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const bici = await plataforma.biciVenda(id);
  if (!bici) notFound();
  const t = await getTranslations('venda');
  const nom = [bici.marca, bici.nom].filter(Boolean).join(' ');
  // Totes les fotos de la plataforma (la principal la primera); si no en dona la llista, la principal.
  const fotos = bici.imatges.length ? bici.imatges : bici.imatge ? [bici.imatge] : [];

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        <div className={`contenidor ${styles.fitxa}`}>
          <Link href="/venda" className={styles.tornar}>
            ← {t('tornar')}
          </Link>

          <Galeria fotos={fotos} alt={nom} transicio={`venda-${bici.id}`} etiquetes={fotos.map((_, i) => t('foto', { n: i + 1, total: fotos.length }))}>
            {bici.ficticia && <span className={styles.etiquetaMostra}>{t('mostraEtiqueta')}</span>}
          </Galeria>

          <div className={styles.info}>
            {bici.marca && <p className={styles.marca}>{bici.marca}</p>}
            <h1>{bici.nom}</h1>

            {bici.ficticia ? (
              <p className={styles.avisMostra} role="note">
                <strong>{t('mostraEtiqueta')}</strong>
                <span>{t('mostraFitxa')}</span>
              </p>
            ) : (
              <>
                <p className={styles.preuGran}>
                  {textPreuVenda(bici, t, locale)}
                  {bici.preu !== null && <small>{t(bici.ivaInclos ? 'ivaInclos' : 'ivaNoInclos')}</small>}
                </p>
                {bici.disponibilitat && (
                  <p className={styles.disponibilitat} data-estat={bici.disponibilitat}>
                    {t(`disponibilitat.${bici.disponibilitat}`)}
                    {bici.disponibilitat === 'disponible' && bici.estoc !== null && bici.estoc > 0 && <> · {t('enEstoc', { n: bici.estoc })}</>}
                  </p>
                )}
              </>
            )}

            {bici.variants.length > 0 && (
              <>
                <p className={styles.etiqueta}>{bici.nomVariants ?? t('opcions')}</p>
                <ul className={styles.variants}>
                  {bici.variants.map((v) => (
                    <li key={v.nom} data-esgotada={v.estoc === 0 || undefined}>
                      {v.nom}
                      {/* El preu d'una talla, només si no és el de la bici. */}
                      {!bici.ficticia && v.preu !== null && v.preu !== bici.preu && <small>{formatEuros(v.preu, locale)}</small>}
                      {/* Quantes en queden, si la botiga en porta el compte. */}
                      {v.estoc !== null && <small>{v.estoc === 0 ? t('talla.esgotada') : t('talla.queden', { n: v.estoc })}</small>}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className={styles.accions}>
              <a className="boto boto--blau" href={enllacWhatsapp(t('missatge', { bici: nom }))} target="_blank" rel="noopener noreferrer">
                {t('preguntar')}
              </a>
            </div>
            <p className={styles.nota}>{t('nota')}</p>

            {bici.descripcio && <p className={styles.descripcio}>{bici.descripcio}</p>}

            {bici.fitxa.length > 0 && (
              <section aria-labelledby="fitxa-tecnica">
                <h2 id="fitxa-tecnica" className={styles.etiqueta}>
                  {t('fitxaTecnica')}
                </h2>
                <dl className={styles.taula} style={{ marginTop: 14 }}>
                  {bici.fitxa.map((f) => (
                    <div key={f.camp} style={{ display: 'contents' }}>
                      <dt>{nomCamp(f.camp)}</dt>
                      <dd>{typeof f.valor === 'boolean' ? t(f.valor ? 'si' : 'no') : f.valor}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <p className={styles.lloguer}>
              {t('lloguer')} <Link href="/#flota">{t('lloguerEnllac')}</Link>
            </p>
          </div>
        </div>
      </main>
      <Peu />
    </>
  );
}
