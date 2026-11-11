import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { Link } from '@/i18n/navigation';
import { plataforma, resultatDelPagament, type EstatRetencio } from '@/lib/plataforma';
import styles from '@/components/reserva/Reserva.module.css';

// On torna qui paga una reserva a la pàgina de pagament de la plataforma. La reserva no és feta
// fins que la plataforma rep el pagament i converteix la retenció: per això es consulta, i mentre
// arriba la pàgina s'actualitza sola.

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pagament' });
  return { title: `${t('metaTitol')} · Tecnibike`, robots: { index: false } };
}

export default async function TornadaPagament({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const parametres = await searchParams;
  const t = await getTranslations('pagament');

  const retencio = typeof parametres.retencio === 'string' ? parametres.retencio : null;
  const estat: EstatRetencio | null = retencio ? await plataforma.estatRetencio(retencio).catch(() => null) : null;
  const resultat = resultatDelPagament(parametres);
  const cas = estat?.estat === 'convertida' ? 'fet' : resultat === 'cancellat' ? 'cancellat' : estat?.estat === 'activa' ? 'confirmant' : 'caducat';

  return (
    <>
      {/* Mentre la plataforma confirma el pagament, es torna a consultar cada pocs segons. */}
      {cas === 'confirmant' && <meta httpEquiv="refresh" content="4" />}
      <main id="contingut" className={styles.pagina}>
        <div className="contenidor">
          <div className={styles.fet} role="status">
            {cas === 'fet' && (
              <p className={styles.fetMarca} aria-hidden="true">
                ✓
              </p>
            )}
            <h1>{t(`${cas}.titol`)}</h1>
            <p>{t(`${cas}.text`)}</p>
            {cas === 'fet' && estat?.codi && (
              <p className={styles.codi}>
                <span>{t('codi')}</span>
                <strong>{estat.codi}</strong>
              </p>
            )}
            <Link href="/#flota" className="boto boto--blau">
              {t('tornar')}
            </Link>
          </div>
        </div>
      </main>
      <Peu />
    </>
  );
}
