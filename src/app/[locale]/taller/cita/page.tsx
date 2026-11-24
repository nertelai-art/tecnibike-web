import { redirect } from '@/i18n/navigation';
import { enllacCita } from '@/components/cita/obrir-cita';
import { peca } from '@/lib/plataforma/esquema';

// La cita al taller es demana al diàleg de la portada; aquesta pàgina a part ja no hi és. L'adreça
// vella (enllaços que ja circulen) porta a la portada amb el diàleg obert, i amb la peça si n'hi ha.

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ peca?: string }> };

export default async function PaginaCita({ params, searchParams }: Props) {
  const { locale } = await params;
  const triada = peca.safeParse((await searchParams).peca);
  redirect({ href: enllacCita(triada.success ? triada.data : null), locale });
}
