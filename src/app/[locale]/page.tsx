import { setRequestLocale } from 'next-intl/server';
import { AnatomiaShowcase } from '@/components/anatomia/AnatomiaShowcase';
import { Capcalera } from '@/components/Capcalera';
import { Flota } from '@/components/Flota';
import { Botiga, ComFunciona, Marques, Peu, Preguntes, Ressenyes, Rutes, Taller, Visita } from '@/components/Seccions';
import { plataforma } from '@/lib/plataforma';

export default async function Inici({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [flota, serveis, valoracio, ressenyes] = await Promise.all([
    plataforma.flota(),
    plataforma.serveisTaller(),
    plataforma.valoracio(),
    plataforma.ressenyes(),
  ]);

  return (
    <>
      <Capcalera />
      <main>
        <AnatomiaShowcase serveis={serveis} valoracio={valoracio} />
        <Flota flota={flota} />
        <ComFunciona />
        <Taller serveis={serveis} />
        <Rutes />
        <Marques />
        <Botiga />
        <Ressenyes ressenyes={ressenyes} valoracio={valoracio} />
        <Preguntes />
        <Visita />
      </main>
      <Peu />
    </>
  );
}
