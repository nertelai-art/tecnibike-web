'use client';

// Mapa de «On som»: la botiga en un mapa real (MapLibre GL + teselles d'OpenFreeMap, sense clau),
// amb una marca i l'enllaç per arribar-hi amb Google Maps. La llibreria es carrega en diferit quan la
// secció és a prop de la pantalla, com el de les rutes; mentrestant (o si falla) queda l'enllaç.

import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapaLibre } from 'maplibre-gl';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { BOTIGA } from '@/content/rutes';
import { useNearViewport } from '@/lib/scroll-scene';
import styles from './MapaBotiga.module.css';

const ESTIL = 'https://tiles.openfreemap.org/styles/liberty';
/** Còpia del worker servida des de public/ (scripts/copia-maplibre-worker.mjs). */
const WORKER = `/vendor/maplibre-gl-worker-${process.env.NEXT_PUBLIC_MAPLIBRE_VERSION}.mjs`;
const COM_ARRIBAR = `https://www.google.com/maps/dir/?api=1&destination=${BOTIGA[1]},${BOTIGA[0]}`;

export function MapaBotiga() {
  const t = useTranslations('visita');
  const caixa = useRef<HTMLDivElement>(null);
  const contenidor = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLibre | null>(null);
  const aprop = useNearViewport(caixa, '600px');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!aprop || !contenidor.current || mapa.current) return;
    let cancelat = false;
    import('maplibre-gl')
      .then(({ Map, Marker, NavigationControl, AttributionControl, setWorkerUrl }) => {
        if (cancelat || !contenidor.current) return;
        setWorkerUrl(WORKER);
        const m = new Map({
          container: contenidor.current,
          style: ESTIL,
          center: BOTIGA,
          zoom: 15,
          attributionControl: false,
          // Amb un dit (mòbil) o sense Ctrl (ordinador), la pàgina fa scroll i el mapa no s'emporta el gest.
          cooperativeGestures: true,
        });
        m.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        m.addControl(new AttributionControl({ compact: true }));
        const marca = document.createElement('div');
        marca.className = styles.marca ?? '';
        marca.setAttribute('aria-label', 'Tecnibike');
        new Marker({ element: marca }).setLngLat(BOTIGA).addTo(m);
        m.on('error', (e) => console.error('Mapa de la botiga', e.error));
        mapa.current = m;
      })
      .catch((e) => {
        console.error("No s'ha pogut carregar el mapa", e);
        setError(true);
      });
    return () => {
      cancelat = true;
    };
  }, [aprop]);

  useEffect(() => () => mapa.current?.remove(), []);

  return (
    <div ref={caixa} className={styles.mapaBotiga}>
      <div ref={contenidor} className={styles.mapa} role="region" aria-label={t('mapaAria')} data-error={error || undefined} />
      <div className={styles.rotul}>
        <strong>Tecnibike</strong>
        <span>{t('adreca')}</span>
        <a href={COM_ARRIBAR} target="_blank" rel="noopener noreferrer">
          {t('comArribar')} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
