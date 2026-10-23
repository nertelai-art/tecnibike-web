'use client';

// Secció de taller. Quan s'hi arriba, es veu el taller amb la bici sencera; la bici es desmunta sola
// peça a peça (vídeo de la Pinarello del client, retallada i posada sobre el fons del taller) i, en
// acabar, entren els textos i, a l'atzar, bàners amb un fil que expliquen cada peça i la seva
// qualitat. Amb el ratolí a sobre, el bàner es queda quiet. L'animació només es fa una vegada; si es
// surt de la secció a mitges, s'atura i continua en tornar-hi.

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BotoCita } from '@/components/cita/BotoCita';
import { useReducedMotion } from '@/lib/scroll-scene';
import { ENQUADRE, etiquetaActiva, FINAL, MOMENTS, seguentBanner } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

/** Velocitat de reproducció: el desmuntatge dura uns 7 s en lloc de 10. */
const VELOCITAT = 1.4;
/** Quant es veu cada bàner i quant temps queda buit fins al següent. */
const VISIBLE_MS = 3400;
const PAUSA_MS = 700;

type Fase = 'espera' | 'desmunta' | 'final';

export function AnatomiaTaller() {
  const t = useTranslations('anatomia');
  const tt = useTranslations('taller');
  const reduced = useReducedMotion();
  const escenari = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const etiquetes = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState<Fase>('espera');
  const final = reduced || fase === 'final';

  useEffect(() => {
    const el = escenari.current;
    const v = video.current;
    if (reduced || !el || !v) return;
    let acabat = false;
    let frame = 0;

    // Etiqueta de la peça que acaba de sortir, seguint el vídeo fotograma a fotograma.
    const segueix = () => {
      const actiu = etiquetaActiva(v.currentTime);
      etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((e, i) => (e.dataset.visible = String(i === actiu)));
      if (!v.paused && !v.ended) frame = requestAnimationFrame(segueix);
    };
    const enReproduir = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(segueix);
    };
    const enAcabar = () => {
      acabat = true;
      cancelAnimationFrame(frame);
      etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((e) => (e.dataset.visible = 'false'));
      setFase('final');
    };
    v.addEventListener('play', enReproduir);
    v.addEventListener('ended', enAcabar);

    // A prop: es comença a baixar el vídeo. A la vista (més de mitja secció): es reprodueix.
    const aProp = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && v.preload === 'none') {
          v.preload = 'auto';
          v.load();
        }
      },
      { rootMargin: '900px 0px' },
    );
    const aLaVista = new IntersectionObserver(
      ([e]) => {
        if (acabat) return;
        if (e && e.intersectionRatio >= 0.55) {
          v.playbackRate = VELOCITAT;
          v.play()
            .then(() => setFase('desmunta'))
            // Si el navegador no el deixa reproduir, es mostra directament la bici desmuntada.
            .catch(() => enAcabar());
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.55] },
    );
    aProp.observe(el);
    aLaVista.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      aProp.disconnect();
      aLaVista.disconnect();
      v.removeEventListener('play', enReproduir);
      v.removeEventListener('ended', enAcabar);
    };
  }, [reduced]);

  const enquadre: CSSProperties = { left: `${ENQUADRE.x}%`, top: `${ENQUADRE.y}%`, width: `${ENQUADRE.ample}%`, height: `${ENQUADRE.alt}%` };

  return (
    <div ref={escenari} className={styles.escenari} data-fase={reduced ? 'final' : fase}>
      <div className={styles.marc}>
        <div className={styles.escena} role="img" aria-label={t('sr')}>
          {reduced ? (
            // eslint-disable-next-line @next/next/no-img-element -- últim fotograma exacte del vídeo
            <img src="/video/taller-final.webp" alt="" className={styles.media} />
          ) : (
            <video ref={video} className={styles.media} src="/video/taller.mp4" poster="/video/taller-poster.webp" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
          )}
          <div className={styles.bici} style={enquadre}>
            <div ref={etiquetes} className={styles.capaEtiquetes} aria-hidden="true">
              {MOMENTS.map((m) => (
                <span
                  key={m.peca}
                  data-peca={m.peca}
                  data-visible="false"
                  // A la part dreta de la bici, el text va a l'esquerra del punt perquè no surti.
                  className={`${styles.etiqueta} ${m.x > 70 ? styles.etiquetaEsquerra : ''}`}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <i />
                  {t(`peces.${m.peca}.nom`)}
                </span>
              ))}
            </div>
            <Banners actius={final} />
          </div>
        </div>
      </div>

      <div className={styles.text} data-visible={final}>
        <p className="situacio">{tt('situacio')}</p>
        <h2 id="taller-titol" className={styles.titol}>
          {tt('titol')}
        </h2>
        <p className={styles.intro}>{tt('intro')}</p>
        <BotoCita className={`boto ${styles.cta}`}>
          {t('ctaCita')} <span className="fletxa">→</span>
        </BotoCita>
      </div>
    </div>
  );
}

/**
 * Bàners de les peces, sobre la bici desmuntada: en surt un a l'atzar, es queda uns segons i se'n va;
 * després en surt un altre. Amb el ratolí (o el focus) a sobre, el que hi ha es queda quiet.
 */
function Banners({ actius }: { actius: boolean }) {
  const t = useTranslations('anatomia');
  const [actual, setActual] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    if (!actius || quiet) return;
    // Si n'hi ha un a la vista, es deixa acabar el seu temps; si no, en surt un de nou.
    const id = visible
      ? window.setTimeout(() => setVisible(false), VISIBLE_MS)
      : window.setTimeout(() => {
          setActual((a) => seguentBanner(a, Math.random()));
          setVisible(true);
        }, PAUSA_MS);
    return () => window.clearTimeout(id);
  }, [actius, visible, quiet]);

  return (
    <div className={styles.capaBanners}>
      {MOMENTS.map((m, i) => {
        const pos = FINAL[m.peca];
        const mostra = actius && visible && i === actual;
        return (
          <div key={m.peca} className={styles.peca} data-visible={mostra}>
            <svg className={styles.fil} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1={pos.x} y1={pos.y} x2={pos.bx + 1} y2={pos.by + 2} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className={styles.punt} style={{ left: `${pos.x}%`, top: `${pos.y}%` }} aria-hidden="true" />
            <aside
              className={styles.banner}
              style={{ left: `${pos.bx}%`, top: `${pos.by}%` }}
              inert={!mostra}
              onMouseEnter={() => setQuiet(true)}
              onMouseLeave={() => setQuiet(false)}
              onFocus={() => setQuiet(true)}
              onBlur={() => setQuiet(false)}
            >
              <p className={styles.bannerEtiqueta}>
                {String(i + 1).padStart(2, '0')} · {t('qualitat')}
              </p>
              <h3 className={styles.bannerNom}>{t(`peces.${m.peca}.nom`)}</h3>
              <p className={styles.bannerText}>{t(`peces.${m.peca}.qualitat`)}</p>
              <BotoCita peca={m.peca} className={styles.bannerEnllac}>
                {t('reservar')} →
              </BotoCita>
            </aside>
          </div>
        );
      })}
    </div>
  );
}
