'use client';

// Mapa real de les rutes (MapLibre GL + teselles d'OpenFreeMap, sense clau) amb el perfil d'alçada.
// La llibreria (~250 kB) es carrega en diferit quan la secció és a prop de la pantalla.

import 'maplibre-gl/dist/maplibre-gl.css';
import type { GeoJSONSource, Map as MapaLibre } from 'maplibre-gl';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BOTIGA, rutes, type IdRuta } from '@/content/rutes';
import { Link } from '@/i18n/navigation';
import { camiPerfil } from '@/lib/perfil';
import { useNearViewport, useReducedMotion } from '@/lib/scroll-scene';
import styles from './MapaRutes.module.css';

const ESTIL = 'https://tiles.openfreemap.org/styles/liberty';
/** Còpia del worker servida des de public/ (scripts/copia-maplibre-worker.mjs). */
const WORKER = `/vendor/maplibre-gl-worker-${process.env.NEXT_PUBLIC_MAPLIBRE_VERSION}.mjs`;

function limits(id: IdRuta): [[number, number], [number, number]] {
  const ruta = rutes.find((r) => r.id === id)!;
  const lons = ruta.punts.map((p) => p[0]);
  const lats = ruta.punts.map((p) => p[1]);
  return [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)],
  ];
}

function geojson(activa: IdRuta) {
  return {
    type: 'FeatureCollection' as const,
    features: rutes.map((ruta) => ({
      type: 'Feature' as const,
      properties: { id: ruta.id, color: ruta.color, activa: ruta.id === activa ? 1 : 0 },
      geometry: { type: 'LineString' as const, coordinates: ruta.punts.map(([lon, lat]) => [lon, lat]) },
    })),
  };
}

export function MapaRutes() {
  const t = useTranslations('rutes');
  const locale = useLocale();
  const contenidor = useRef<HTMLDivElement>(null);
  const seccio = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLibre | null>(null);
  const aprop = useNearViewport(seccio, '600px');
  const reducedMotion = useReducedMotion();
  const [activa, setActiva] = useState<IdRuta>('gavarres');
  const [error, setError] = useState(false);
  const ruta = rutes.find((r) => r.id === activa)!;
  const perfil = useMemo(() => camiPerfil(ruta.punts, 600, 110), [ruta]);

  // Crea el mapa una sola vegada, quan la secció és a prop.
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
          bounds: limits('gavarres'),
          fitBoundsOptions: { padding: 48 },
          attributionControl: false,
          cooperativeGestures: true,
        });
        m.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        m.addControl(new AttributionControl({ compact: true }));
        m.on('load', () => {
          m.addSource('rutes', { type: 'geojson', data: geojson('gavarres') });
          m.addLayer({
            id: 'rutes-fons',
            type: 'line',
            source: 'rutes',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': ['case', ['==', ['get', 'activa'], 1], 9, 5], 'line-opacity': 0.9 },
          });
          m.addLayer({
            id: 'rutes-linia',
            type: 'line',
            source: 'rutes',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': ['get', 'color'],
              'line-width': ['case', ['==', ['get', 'activa'], 1], 5, 2.5],
              'line-opacity': ['case', ['==', ['get', 'activa'], 1], 1, 0.45],
            },
          });
          const marca = document.createElement('div');
          marca.className = styles.marcaBotiga ?? '';
          marca.setAttribute('aria-label', 'Tecnibike');
          new Marker({ element: marca }).setLngLat(BOTIGA).addTo(m);
        });
        m.on('error', (e) => console.error('Mapa de rutes', e.error));
        mapa.current = m;
      })
      .catch((e) => {
        console.error('No s\'ha pogut carregar el mapa', e);
        setError(true);
      });
    return () => {
      cancelat = true;
    };
  }, [aprop]);

  useEffect(() => () => mapa.current?.remove(), []);

  // En canviar de ruta: ressalta-la i enquadra-la.
  useEffect(() => {
    const m = mapa.current;
    if (!m) return;
    const aplica = () => {
      (m.getSource('rutes') as GeoJSONSource | undefined)?.setData(geojson(activa));
      m.fitBounds(limits(activa), { padding: 48, duration: reducedMotion ? 0 : 900 });
    };
    if (m.isStyleLoaded() && m.getSource('rutes')) aplica();
    else m.once('idle', aplica);
  }, [activa, reducedMotion]);

  const km = (m: number) => (m / 1000).toLocaleString(locale, { maximumFractionDigits: 1 });

  return (
    <div ref={seccio} className={styles.mapaRutes}>
      <div className={styles.llista} role="tablist" aria-label={t('situacio')}>
        {rutes.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={r.id === activa}
            className={styles.opcio}
            style={{ '--color': r.color } as React.CSSProperties}
            onClick={() => setActiva(r.id)}
          >
            <span className={styles.tipus}>{t(`llista.${r.id}.tipus`)}</span>
            <strong>{t(`llista.${r.id}.nom`)}</strong>
            <span className={styles.xifres}>
              {t('distancia', { km: km(r.metres) })} · {t('desnivell', { m: r.desnivell })}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.detall} role="tabpanel">
        <div className={styles.mapa}>
          <div ref={contenidor} className={styles.lienzo} aria-label={t('mapa', { nom: t(`llista.${activa}.nom`) })} role="region" />
          {error && <p className={styles.error}>{t('errorMapa')}</p>}
        </div>
        <div className={styles.fitxa}>
          <p className={styles.text}>{t(`llista.${activa}.text`)}</p>
          <figure className={styles.perfil}>
            <svg viewBox="0 0 600 110" preserveAspectRatio="none" aria-hidden="true">
              <path d={perfil.area} fill={ruta.color} opacity="0.16" />
              <path d={perfil.linia} fill="none" stroke={ruta.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <figcaption>
              <span>{t('perfil')}</span>
              <span>
                {perfil.min}–{perfil.max} m
              </span>
            </figcaption>
          </figure>
          <dl className={styles.dades}>
            <div>
              <dt>{t('etDistancia')}</dt>
              <dd>{t('distancia', { km: km(ruta.metres) })}</dd>
            </div>
            <div>
              <dt>{t('etDesnivell')}</dt>
              <dd>{t('desnivell', { m: ruta.desnivell })}</dd>
            </div>
            <div>
              <dt>{t('bici')}</dt>
              <dd>
                <Link href={`/lloguer/${ruta.bici}`}>{t(`bicis.${ruta.id}`)}</Link>
              </dd>
            </div>
          </dl>
          <p className={styles.font}>{t('font')}</p>
        </div>
      </div>
    </div>
  );
}
