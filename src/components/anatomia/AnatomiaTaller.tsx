'use client';

// Secció de taller. Es queda fixa a la pantalla: a l'esquerra, el taller i el text; a la dreta, en un
// marc, el vídeo de la Pinarello del client (generat amb IA) on la bici es desmunta peça a peça amb el
// scroll. Al final del recorregut, la bici queda desmuntada i surten a l'atzar bàners amb un fil que
// expliquen cada peça i la seva qualitat; amb el ratolí a sobre es queden quiets. Un cop passada de
// llarg, l'escena queda desmuntada i no es torna a reproduir.

import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BotoCita } from '@/components/cita/BotoCita';
import { ScrollVideo, type ScrollVideoFrame } from '@/components/video/ScrollVideo';
import { useReducedMotion } from '@/lib/scroll-scene';
import { DESMUNTADA, DURADA, FINAL, MOMENTS, seguentBanner, tempsDeProgres, TEXTOS } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

/** Inèrcia del vídeo respecte del scroll: suavitza la roda del ratolí però s'atura de seguida. */
const SUAVITAT = 12;
/** Quant es veu cada bàner i quant temps queda buit fins al següent. */
const VISIBLE_MS = 3400;
const PAUSA_MS = 700;

export function AnatomiaTaller() {
  const t = useTranslations('anatomia');
  const tt = useTranslations('taller');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [desmuntada, setDesmuntada] = useState(false);
  const [acabada, setAcabada] = useState(false);
  const fiAbans = useRef<number | null>(null);

  // En sortir per baix del recorregut, l'escena queda acabada: el recorregut llarg es canvia per un
  // panell d'una pantalla, amb la bici desmuntada.
  useEffect(() => {
    if (acabada || reduced) return;
    const comprova = () => {
      const el = pista.current;
      const fi = el?.getBoundingClientRect().bottom ?? 0;
      if (el && fi < 0) {
        fiAbans.current = fi;
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

  // Amb el scroll, el que canvia va directament al DOM; només l'entrada i la sortida de l'estat
  // «desmuntada» passen per React (no a cada fotograma).
  const onFrame = ({ progress }: ScrollVideoFrame) => {
    const final = progress >= DESMUNTADA;
    if (text.current) text.current.dataset.visible = String(progress >= TEXTOS);
    setDesmuntada((abans) => (abans === final ? abans : final));
  };

  const textos = (visible: boolean) => (
    <div ref={text} className={styles.text} data-visible={visible}>
      <p className="situacio">{tt('situacio')}</p>
      <h2 id="taller-titol" className={styles.titol}>
        {tt('titol')}
      </h2>
      <p className={styles.intro}>{tt('intro')}</p>
      <BotoCita className={`boto ${styles.cta}`}>
        {t('ctaCita')} <span className="fletxa">→</span>
      </BotoCita>
    </div>
  );

  // Per sobre de tot (també del text i del vel): els bàners, en una còpia de la caixa del vídeo perquè
  // les posicions en % coincideixin amb el fotograma.
  const capaSuperior = (bannersActius: boolean) => (
    <div className={`${styles.marc} ${styles.capaSuperior}`} aria-hidden={!bannersActius || undefined}>
      <Banners actius={bannersActius} />
    </div>
  );

  const fons = (
    // eslint-disable-next-line @next/next/no-img-element -- fons decoratiu de l'escenari, a pantalla completa
    <img src="/img/taller/fons-taller.webp" alt="" className={styles.fons} aria-hidden="true" />
  );

  if (reduced || acabada) {
    // Sense moviment, o ja vista: la bici desmuntada (últim fotograma), el text i els bàners.
    return (
      <div ref={pista} className={styles.panell}>
        {fons}
        <div className={styles.vel} aria-hidden="true" />
        <div className={styles.marc}>
          {/* eslint-disable-next-line @next/next/no-img-element -- últim fotograma exacte del vídeo */}
          <img src="/video/anatomia-final.webp" alt={t('sr')} className={styles.imatgeFinal} />
        </div>
        {textos(true)}
        {capaSuperior(true)}
      </div>
    );
  }

  return (
    <div ref={pista}>
      <ScrollVideo
        clips={[{ src: '/video/anatomia.mp4', srcMobile: '/video/anatomia-m.mp4', poster: '/video/anatomia-poster.webp', scroll: 5 }]}
        label={t('sr')}
        offsetTop={0}
        fade={0}
        smoothing={SUAVITAT}
        remap={(local) => tempsDeProgres(local) / DURADA}
        mediaClassName={styles.marc}
        background={
          <>
            {fons}
            <div className={styles.vel} aria-hidden="true" />
          </>
        }
        onFrame={onFrame}
      >
        {textos(false)}
        {capaSuperior(desmuntada)}
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
