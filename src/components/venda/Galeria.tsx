'use client';

// Les fotos d'una bici en venda: la gran a dalt i, si n'hi ha més d'una, les miniatures a sota per
// canviar-la. La primera és la principal de la plataforma.

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { optimitzable } from '@/lib/imatges';
import styles from './Venda.module.css';

type Props = {
  fotos: readonly string[];
  alt: string;
  /** Què es diu de cada miniatura per a qui no la veu («Foto 2 de 3»), una per foto. */
  etiquetes: readonly string[];
  /** El que va a sobre de la foto (l'etiqueta de mostra). */
  children?: ReactNode;
};

export function Galeria({ fotos, alt, etiquetes, children }: Props) {
  const [triada, setTriada] = useState(0);
  const foto = fotos[triada] ?? fotos[0];

  return (
    <div className={styles.galeria}>
      <div className={styles.fotoGran}>
        {foto && <Image key={foto} src={foto} alt={alt} width={1200} height={900} priority sizes="(min-width: 860px) 55vw, 92vw" unoptimized={!optimitzable(foto)} />}
        {children}
      </div>
      {fotos.length > 1 && (
        <ul className={styles.miniatures}>
          {fotos.map((f, i) => (
            <li key={f}>
              <button type="button" aria-label={etiquetes[i]} aria-pressed={i === triada} onClick={() => setTriada(i)}>
                <Image src={f} alt="" width={160} height={120} sizes="96px" unoptimized={!optimitzable(f)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
