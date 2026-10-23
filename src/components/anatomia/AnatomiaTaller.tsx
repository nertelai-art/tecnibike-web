'use client';

// Anatomia d'una bici, dins la secció de taller. Sobre el fons d'un taller, una bici real es desmunta
// peça a peça amb el scroll (vídeo generat a partir de les fotos de la Pinarello del client). Quan ja
// està desmuntada, de les peces surten a l'atzar un fil i un bàner que explica la peça i la seva
// qualitat; amb el ratolí a sobre, el bàner es queda quiet. Un cop vista i passada de llarg, l'escena
// queda desmuntada i no es torna a reproduir. Sempre a la vista: el botó de demanar cita.

import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BotoCita } from '@/components/cita/BotoCita';
import { ScrollVideo, type ScrollVideoFrame } from '@/components/video/ScrollVideo';
import { useReducedMotion } from '@/lib/scroll-scene';
import { aturat, FINAL, MOMENTS, pasActiu, seguentBanner, tempsVideo } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

const DURADA = 10.04;
/** Inèrcia del vídeo respecte del scroll: suavitza la roda del ratolí però s'atura de seguida. */
const SUAVITAT = 12;
/** Progrés a partir del qual la bici ja és desmuntada del tot i comencen els bàners. */
const DESMUNTADA = 0.96;
/** Quant es veu cada bàner i quant temps queda buit fins al següent. */
const VISIBLE_MS = 3400;
const PAUSA_MS = 700;

export function AnatomiaTaller() {
  const t = useTranslations('anatomia');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLDivElement>(null);
  const etiquetes = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const [desmuntada, setDesmuntada] = useState(false);
  const [acabada, setAcabada] = useState(false);
  const fiAbans = useRef<number | null>(null);

  // En sortir per baix del recorregut, l'escena queda acabada: el recorregut llarg es canvia per un
  // panell d'una pantalla i es compensa el scroll perquè el que hi ha a la vista no es mogui.
  useEffect(() => {
    if (acabada || reduced) return;
    const comprova = () => {
      const el = pista.current;
      const final = el?.getBoundingClientRect().bottom ?? 0;
      if (el && final < 0) {
        fiAbans.current = final;
        setAcabada(true);
      }
    };
    comprova();
    window.addEventListener('scroll', comprova, { passive: true });
    return () => window.removeEventListener('scroll', comprova);
  }, [acabada, reduced]);

  // El que hi ha sota l'escena ha de quedar on era. Es mesura en lloc de restar alçades perquè
  // alguns navegadors ja ho compensen sols (scroll anchoring) i no s'ha de fer dues vegades.
  useLayoutEffect(() => {
    if (!acabada || fiAbans.current === null || !pista.current) return;
    const desplaçament = pista.current.getBoundingClientRect().bottom - fiAbans.current;
    if (Math.abs(desplaçament) > 1) window.scrollBy({ top: desplaçament, behavior: 'instant' });
    fiAbans.current = null;
  }, [acabada]);

  // Mentre es desmunta, el que canvia amb el scroll va directament al DOM; només l'entrada i la
  // sortida de l'estat «desmuntada» passen per React (una vegada, no a cada fotograma).
  const onFrame = ({ progress }: ScrollVideoFrame) => {
    const pas = pasActiu(progress);
    const fora = aturat(progress);
    const final = progress >= DESMUNTADA;
    etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((el, i) => (el.dataset.visible = String(!final && i === pas && fora)));
    if (barra.current) barra.current.style.transform = `scaleX(${progress})`;
    setDesmuntada((abans) => (abans === final ? abans : final));
  };

  const text = (
    <div className={styles.text}>
      <p className="situacio">{t('situacio')}</p>
      <h2 className={styles.titol}>{t('titol')}</h2>
      <p className={styles.intro}>{t('intro')}</p>
      {!acabada && !reduced && <p className={styles.pista}>{t('pista')}</p>}
      <BotoCita className={`boto ${styles.cta}`}>
        {t('ctaCita')} <span className="fletxa">→</span>
      </BotoCita>
    </div>
  );

  const fons = (
    // eslint-disable-next-line @next/next/no-img-element -- fons decoratiu de l'escenari, a pantalla completa
    <img src="/img/taller/fons-taller.webp" alt="" className={styles.fons} aria-hidden="true" />
  );

  if (reduced || acabada) {
    // Sense moviment, o ja vista: la bici desmuntada (últim fotograma) amb els bàners.
    return (
      <div ref={pista} className={styles.panell}>
        {fons}
        <div className={styles.capa}>
          <div className={styles.video}>
            {/* eslint-disable-next-line @next/next/no-img-element -- fotograma final exacte del vídeo */}
            <img src="/video/anatomia-final.webp" alt={t('sr')} className={styles.imatgeFinal} />
          </div>
          <Banners actius />
          {text}
        </div>
      </div>
    );
  }

  return (
    <div ref={pista}>
      <ScrollVideo
        clips={[{ src: '/video/anatomia.mp4', srcMobile: '/video/anatomia-m.mp4', poster: '/video/anatomia-poster.webp', scroll: 6 }]}
        label={t('sr')}
        offsetTop={0}
        fade={0}
        smoothing={SUAVITAT}
        remap={(local) => tempsVideo(local) / DURADA}
        mediaClassName={styles.video}
        background={fons}
        onFrame={onFrame}
      >
        <div className={styles.capa}>
          {/* Mateixa caixa que el vídeo, per situar les etiquetes en % del fotograma. */}
          <div ref={etiquetes} className={`${styles.video} ${styles.etiquetesCaixa}`} aria-hidden="true">
            {MOMENTS.map((m) => (
              <span
                key={m.peca}
                data-peca={m.peca}
                data-visible="false"
                // A la part dreta del fotograma, el text va a l'esquerra del punt perquè no surti de la caixa.
                className={`${styles.etiqueta} ${m.x > 70 ? styles.etiquetaEsquerra : ''}`}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                <i />
                {t(`peces.${m.peca}.nom`)}
              </span>
            ))}
          </div>
          <Banners actius={desmuntada} />
          {text}
          <div className={styles.progres} aria-hidden="true">
            <div ref={barra} />
          </div>
        </div>
      </ScrollVideo>
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
    <div className={`${styles.video} ${styles.capaBanners}`}>
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
