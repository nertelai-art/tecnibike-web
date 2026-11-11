import { setRequestLocale } from 'next-intl/server';
import { BarraBici } from '@/components/BarraBici';
import { DialegCita } from '@/components/cita/DialegCita';
import { Flota } from '@/components/Flota';
import { NutricioPortada } from '@/components/nutricio/NutricioPortada';
import { Portada } from '@/components/Portada';
import { WhatsappFlotant } from '@/components/WhatsappFlotant';
import { Botiga, ComFunciona, Equipament, Marques, Peu, Preguntes, Ressenyes, Rutes, Taller, Visita } from '@/components/Seccions';
import { plataforma } from '@/lib/plataforma';

export default async function Inici({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [flota, serveis, valoracio, ressenyes, nutricio, configuracio] = await Promise.all([
    plataforma.flota(),
    plataforma.serveisTaller(),
    plataforma.valoracio(),
    plataforma.ressenyes(),
    plataforma.nutricio(),
    plataforma.configuracioReserves(),
  ]);

  return (
    <>
      <main>
        <Portada valoracio={valoracio} />
        <Flota flota={flota} />
        <ComFunciona />
        <Taller />
        <Rutes />
        <NutricioPortada productes={nutricio} ambReserva={configuracio.nutricio.actiu} />
        <Botiga />
        <Equipament />
        <Marques />
        <Ressenyes ressenyes={ressenyes} valoracio={valoracio} />
        <Preguntes />
        <Visita />
      </main>
      <Peu />
      <DialegCita serveis={serveis} />
      <BarraBici />
      <WhatsappFlotant />
    </>
  );
}
