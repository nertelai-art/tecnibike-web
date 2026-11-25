import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { NutricioContingut, NutricioPortada } from '@/components/nutricio/NutricioPortada';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Peu } from '@/components/Seccions';
import { CATEGORIES_EQUIPAMENT, FOTOS_EQUIPAMENT } from '@/content/equipament';
import { Link } from '@/i18n/navigation';
import { plataforma } from '@/lib/plataforma';
import { categoriaEquipament } from '@/lib/plataforma/esquema';
import { GuiaIntro, GuiaMarques, GuiaPreguntes, GuiaTriar } from '@/components/botiga/GuiaCategoria';
import styles from '@/components/botiga/Categoria.module.css';

// Pàgina d'una categoria de la botiga d'equipament: la guia de la categoria (src/content/guies), amb
// la introducció i què hi fa la botiga, les marques (cadascuna porta a la seva fitxa), els tipus, com
// triar-ne i les preguntes freqüents. De moment no es ven en línia: es ve a la botiga o es truca.
// (Fins al 25-11-2026 hi havia a sota els articles de la plataforma, «A la botiga»; l'usuari la va fer
// treure: les marques ja porten al detall.)
//
// La nutrició té la seva pròpia pàgina (hero amb les marques, que filtren, i catàleg amb sabors):
// NutricioPortada, sense la capçalera; la guia hi va a sota, sense les marques, que ja són al hero.

type Params = { params: Promise<{ locale: string; categoria: string }> };

// Es torna a generar cada 5 minuts (REVALIDA_S de la plataforma), perquè el que canviï a la plataforma
// hi surti: vegeu src/app/revalida.test.ts.
export const revalidate = 300;

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
  const esNutricio = categoria === 'nutricio';
  const [nutricio, configuracio] = await Promise.all([
    esNutricio ? plataforma.nutricio() : [],
    plataforma.configuracioReserves(),
  ]);

  return (
    <>
      <main id="contingut" className={styles.pagina}>
        {!esNutricio && (
          <header className={styles.cap}>
          <Image src={FOTOS_EQUIPAMENT[categoria].src} alt="" fill priority sizes="100vw" className={styles.fons} />
          <div className={`contenidor ${styles.capText}`}>
            <Link href="/#equipament" className={styles.tornar}>
              {t('tornar')}
            </Link>
            <p className="situacio">{te('situacio')}</p>
            <h1 className="titol-seccio">{te(`categories.${categoria}.nom`)}</h1>
            <p className="intro">{te(`categories.${categoria}.text`)}</p>
          </div>
          </header>
        )}

        {!esNutricio && (
        <div className="contenidor">
          <GuiaIntro categoria={categoria} />
          <GuiaMarques categoria={categoria} />
          <GuiaTriar categoria={categoria} />
        </div>
        )}

        {esNutricio && (
          // La marca de l'adreça (?marca=…) només es llegeix al navegador: en una pàgina estàtica cal un
          // límit de Suspense. Mentrestant (i a l'HTML del servidor), la pàgina sense marca triada.
          <Suspense fallback={<NutricioContingut productes={nutricio} ambReserva={configuracio.nutricio.actiu} />}>
            <NutricioPortada productes={nutricio} ambReserva={configuracio.nutricio.actiu} />
          </Suspense>
        )}

        <div className="contenidor">
          {esNutricio && (
            <>
              <GuiaIntro categoria={categoria} />
              <GuiaTriar categoria={categoria} />
            </>
          )}
          <GuiaPreguntes categoria={categoria} />
        </div>
      </main>
      <Peu />
    </>
  );
}
