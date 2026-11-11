// Il·lustració d'un paquet de nutrició (gel, barreta, sobre, tub, gominoles, vial) amb els colors de
// la marca i una franja del sabor. És pròpia: no reprodueix cap foto ni cap disseny de les marques,
// només el nom en text. Decorativa: el nom del producte ja és al costat.

import type { TipusNutricio } from '@/lib/plataforma/esquema';
import { colorSabor, temaDe } from '@/content/nutricio';

type Props = {
  marca: string;
  nom: string;
  tipus: TipusNutricio;
  sabor: string;
  className?: string;
};

/** Contorn de cada format, en un llenç de 100 × 140. */
const FORMES: Record<TipusNutricio, { contorn: string; franja: [number, number]; text: [number, number]; ample: number }> = {
  // Sobre de gel, alt i estret, amb l'esquinç a dalt.
  gel: { contorn: 'M28 12 H62 L72 22 V124 Q72 130 66 130 H34 Q28 130 28 124 Z', franja: [88, 108], text: [40, 54], ample: 40 },
  // Barreta ajaguda amb les vores dentades.
  barreta: {
    contorn: 'M10 48 l4 -4 l4 4 l4 -4 V96 l-4 4 l-4 -4 l-4 4 Z M22 44 H78 V100 H22 Z M78 44 l4 4 l4 -4 l4 4 V100 l-4 -4 l-4 4 l-4 -4 Z',
    franja: [84, 96], text: [62, 76], ample: 54,
  },
  // Sobre de beguda, pla, amb la tira de tancament.
  beguda: { contorn: 'M22 16 H78 V30 H22 Z M22 30 H78 V122 Q78 130 70 130 H30 Q22 130 22 122 Z', franja: [96, 114], text: [52, 68], ample: 52 },
  // Bossa de recuperació, que s'aguanta dreta.
  recuperacio: { contorn: 'M24 14 H76 V26 H24 Z M24 26 H76 Q84 70 82 128 H18 Q16 70 24 26 Z', franja: [98, 116], text: [52, 68], ample: 56 },
  // Tub de pastilles efervescents.
  pastilles: { contorn: 'M33 12 H67 V28 H33 Z M36 28 H64 V126 Q64 132 58 132 H42 Q36 132 36 126 Z', franja: [92, 110], text: [56, 70], ample: 26 },
  // Bosseta de gominoles.
  gominoles: { contorn: 'M24 34 H76 V42 H24 Z M24 42 H76 V118 Q76 124 70 124 H30 Q24 124 24 118 Z', franja: [96, 110], text: [62, 76], ample: 48 },
  // Vial d'un sol glop.
  shot: { contorn: 'M42 12 H58 V30 Q70 36 70 50 V124 Q70 132 62 132 H38 Q30 132 30 124 V50 Q30 36 42 30 Z', franja: [96, 114], text: [66, 80], ample: 36 },
};

export function Paquet({ marca, nom, tipus, sabor, className }: Props) {
  const tema = temaDe(marca);
  const forma = FORMES[tipus];
  const [y1, y2] = forma.franja;
  const [ty1, ty2] = forma.text;
  const id = `p-${tipus}-${sabor}-${marca}`.replace(/[^a-z0-9-]/gi, '');
  return (
    <svg className={className} viewBox="0 0 100 140" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-c`}>
          <path d={forma.contorn} />
        </clipPath>
        <linearGradient id={`${id}-b`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={forma.contorn} fill={tema.paquet} stroke={tema.tinta} strokeOpacity="0.18" strokeWidth="1" />
      <g clipPath={`url(#${id}-c)`}>
        <rect x="0" y={y1} width="100" height={y2 - y1} fill={colorSabor(sabor)} />
        {/* La lluïssor del plàstic, que es mou en passar-hi per sobre. */}
        <rect className="paquet-brill" x="-60" y="0" width="80" height="140" fill={`url(#${id}-b)`} />
      </g>
      <text x="50" y={ty1} textAnchor="middle" fill={tema.tinta} fontSize="9" fontWeight="800" letterSpacing="0.5">
        {marca.toUpperCase()}
      </text>
      <text x="50" y={ty2} textAnchor="middle" fill={tema.tinta} fontSize="7" fontWeight="600" {...(nom.length > 10 && { textLength: forma.ample, lengthAdjust: 'spacingAndGlyphs' })}>
        {nom}
      </text>
    </svg>
  );
}
