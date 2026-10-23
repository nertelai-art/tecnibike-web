import { setRequestLocale } from 'next-intl/server';
import { Capcalera } from '@/components/Capcalera';
import { Flota } from '@/components/Flota';
import { Portada } from '@/components/Portada';
import { Botiga, ComFunciona, Marques, Peu, Preguntes, Ressenyes, Rutes, Taller, Visita } from '@/components/Seccions';
import { plataforma } from '@/lib/plataforma';

export default async function Inici({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [flota, serveis, valoracio, ressenyes, productes] = await Promise.all([
    plataforma.flota(),
    plataforma.serveisTaller(),
    plataforma.valoracio(),
    plataforma.ressenyes(),
    plataforma.productes(),
  ]);

  return (
    <>
      <Capcalera />
      <main>
        <Portada valoracio={valoracio} />
        <Flota flota={flota} />
        <ComFunciona />
        <Taller serveis={serveis} productes={productes} />
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
