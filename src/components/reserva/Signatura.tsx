'use client';

// Requadre per signar amb el dit, el llapis o el ratolí. Torna la signatura en PNG (data URL), o
// `null` quan s'esborra. Pointer Events: un sol camí per a ratolí i pantalla tàctil.

import { useEffect, useRef } from 'react';
import styles from './Reserva.module.css';

type Props = { etiqueta: string; esborrar: string; onCanvi: (png: string | null) => void };

export function Signatura({ etiqueta, esborrar, onCanvi }: Props) {
  const llenç = useRef<HTMLCanvasElement>(null);
  const dibuixant = useRef(false);
  const buit = useRef(true);

  // El llenç es dimensiona en píxels reals de la pantalla perquè el traç no surti borrós.
  useEffect(() => {
    const c = llenç.current;
    if (!c) return;
    const escala = window.devicePixelRatio || 1;
    c.width = c.clientWidth * escala;
    c.height = c.clientHeight * escala;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.scale(escala, escala);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#121417';
  }, []);

  const punt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const neteja = () => {
    const c = llenç.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    buit.current = true;
    onCanvi(null);
  };

  return (
    <div className={styles.signatura}>
      <canvas
        ref={llenç}
        role="img"
        aria-label={etiqueta}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          const ctx = e.currentTarget.getContext('2d');
          const [x, y] = punt(e);
          ctx?.beginPath();
          ctx?.moveTo(x, y);
          dibuixant.current = true;
        }}
        onPointerMove={(e) => {
          if (!dibuixant.current) return;
          const ctx = e.currentTarget.getContext('2d');
          const [x, y] = punt(e);
          ctx?.lineTo(x, y);
          ctx?.stroke();
          buit.current = false;
        }}
        onPointerUp={(e) => {
          dibuixant.current = false;
          if (!buit.current) onCanvi(e.currentTarget.toDataURL('image/png'));
        }}
      />
      <span className={styles.signaturaGuia} aria-hidden="true">
        {etiqueta}
      </span>
      <button type="button" className={styles.aplicar} onClick={neteja}>
        {esborrar}
      </button>
    </div>
  );
}
