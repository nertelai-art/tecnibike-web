import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Capcalera } from '@/components/Capcalera';
import { routing } from '@/i18n/routing';
import '../globals.css';

// Una sola família amb eix d'amplada: condensada per als titulars (com el «TCNBK» del logo) i
// normal per al text.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('titol'),
    description: t('descripcio'),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])) },
  };
}

export const viewport: Viewport = { themeColor: '#f4f5f7' };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    // data-scroll-behavior: Next desactiva el scroll suau mentre navega, i torna a dalt de debò.
    <html lang={locale} className={archivo.variable} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider>
          {/* Fora de les pàgines: si fos el primer element de cada pàgina, Next no tornaria a dalt
              en navegar perquè una capçalera fixa sempre «és a la vista». */}
          <Capcalera />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
