'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import type { Peca } from '@/lib/plataforma/esquema';
import { obrirCita } from './obrir-cita';

/** Obre el diàleg de cita si n'hi ha; si no (o sense JavaScript), va a la pàgina de cita. */
export function BotoCita({ peca, className, children }: { peca?: Peca; className?: string; children: ReactNode }) {
  return (
    <Link
      href={peca ? { pathname: '/taller/cita', query: { peca } } : '/taller/cita'}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (obrirCita(peca)) event.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}
