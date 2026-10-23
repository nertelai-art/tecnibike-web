'use client';

// Portada: un ciclista amb la Pinarello travessa la platja, el poble, la muntanya i la costa en un
// vídeo en bucle (generat amb IA a partir de les fotos del client). El vídeo és decoració: el
// contingut és l'HTML de sobre. Amb moviment reduït, només el primer fotograma.

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import type { Valoracio } from '@/lib/plataforma/esquema';
import { useReducedMotion } from '@/lib/scroll-scene';
import styles from './Portada.module.css';

const ENTORNS = ['platja', 'poble', 'muntanya', 'costa'] as const;
/** Segon del bucle en què entra cada entorn (quatre trams de ~4,7 s). */
const INICI_ENTORN = [0, 4.4, 9.1, 13.8];

export function Portada({ valoracio }: { valoracio: Valoracio }) {
  const t = useTranslations('portada');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const entorns = useRef<HTMLOListElement>(null);

  // Marca l'entorn que es veu (platja, poble, muntanya, costa) seguint el temps del vídeo.
  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    const actualitza = () => {
      const actiu = INICI_ENTORN.findLastIndex((s) => v.currentTime >= s);
      entorns.current?.querySelectorAll('li').forEach((li, i) => li.toggleAttribute('data-actiu', i === actiu));
    };
    v.addEventListener('timeupdate', actualitza);
    v.play().catch(() => {});
    return () => v.removeEventListener('timeupdate', actualitza);
  }, [reduced]);

  return (
    <section id="contingut" className={styles.portada} aria-labelledby="portada-titol">
      <div className={styles.fons} aria-hidden="true">
        <video
          ref={video}
          className={styles.video}
          poster="/video/hero-poster.webp"
          muted
          loop
          playsInline
          autoPlay={!reduced}
          preload={reduced ? 'none' : 'auto'}
        >
          <source src="/video/hero-m.mp4" media="(max-width: 860px)" type="video/mp4" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`contenidor ${styles.contingut}`}>
        <p className={styles.situacio}>{t('situacio')}</p>
        <h1 id="portada-titol" className={styles.titol}>
          <span>{t('titol1')}</span> <span>{t('titol2')}</span> <span className={styles.titolAccent}>{t('titol3')}</span>
        </h1>
        <p className={styles.subtitol}>{t('subtitol')}</p>
        <div className={styles.botons}>
          <a href="#flota" className="boto boto--blau">
            {t('ctaLloguer')} <span className="fletxa">→</span>
          </a>
          <Link href="/taller/cita" className="boto boto--fosc-sobre-fosc">
            {t('ctaTaller')}
          </Link>
        </div>
        <p className={styles.valoracio}>
          <span className={styles.estrelles} aria-hidden="true">
            ★★★★★
          </span>
          {t('valoracio', { mitjana: valoracio.mitjana.toLocaleString(locale), total: valoracio.total })}
        </p>
      </div>

      <ol ref={entorns} className={styles.entorns} aria-label={t('entorns')}>
        {ENTORNS.map((e, i) => (
          <li key={e} data-actiu={i === 0 || undefined}>
            {t(`entorn.${e}`)}
          </li>
        ))}
      </ol>
    </section>
  );
}
