import { setRequestLocale } from 'next-intl/server';
import { DialegCita } from '@/components/cita/DialegCita';
import { Flota } from '@/components/Flota';
import { Portada } from '@/components/Portada';
import { Botiga, ComFunciona, Equipament, Marques, Peu, Preguntes, Ressenyes, Rutes, Taller, Visita } from '@/components/Seccions';
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
      <main>
        <Portada valoracio={valoracio} />
        <Flota flota={flota} />
        <ComFunciona />
        <Taller serveis={serveis} productes={productes} />
        <Rutes />
        <Botiga />
        <Equipament />
        <Marques />
        <Ressenyes ressenyes={ressenyes} valoracio={valoracio} />
        <Preguntes />
        <Visita />
      </main>
      <Peu />
      <DialegCita serveis={serveis} />
    </>
  );
}
