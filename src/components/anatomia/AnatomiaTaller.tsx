'use client';

// Secció de taller. Es queda fixa a la pantalla amb el taller i la bici sencera; en fer scroll, la
// bici es desmunta peça a peça (vídeo de la Pinarello del client, retallada i posada sobre el fons del
// taller) i entren els textos. Al final del recorregut, la bici queda desmuntada i surten a l'atzar
// bàners amb un fil que expliquen cada peça i la seva qualitat; amb el ratolí a sobre es queden
// quiets. Un cop passada de llarg, l'escena queda desmuntada i no es torna a reproduir.

import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { BotoCita } from '@/components/cita/BotoCita';
import { ScrollVideo, type ScrollVideoFrame } from '@/components/video/ScrollVideo';
import { useReducedMotion } from '@/lib/scroll-scene';
import { DESMUNTADA, DURADA, ENQUADRE, etiquetaActiva, FINAL, MOMENTS, seguentBanner, tempsDeProgres, TEXTOS } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

/** Inèrcia del vídeo respecte del scroll: suavitza la roda del ratolí però s'atura de seguida. */
const SUAVITAT = 12;
/** Quant es veu cada bàner i quant temps queda buit fins al següent. */
const VISIBLE_MS = 3400;
const PAUSA_MS = 700;

const ENQUADRE_ESTIL: CSSProperties = { left: `${ENQUADRE.x}%`, top: `${ENQUADRE.y}%`, width: `${ENQUADRE.ample}%`, height: `${ENQUADRE.alt}%` };

export function AnatomiaTaller() {
  const t = useTranslations('anatomia');
  const tt = useTranslations('taller');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLDivElement>(null);
  const etiquetes = useRef<HTMLDivElement>(null);
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
    const actiu = final ? -1 : etiquetaActiva(tempsDeProgres(progress));
    etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((e, i) => (e.dataset.visible = String(i === actiu)));
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

  // Per sobre de tot (també del text i del vel): les etiquetes i els bàners, en la mateixa caixa que
  // l'escena perquè les posicions en % coincideixin amb el vídeo.
  const capaSuperior = (bannersActius: boolean) => (
    <div className={`${styles.escena} ${styles.capaSuperior}`} aria-hidden={!bannersActius || undefined}>
      <div className={styles.bici} style={ENQUADRE_ESTIL}>
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
        <Banners actius={bannersActius} />
      </div>
    </div>
  );

  if (reduced || acabada) {
    // Sense moviment, o ja vista: la bici desmuntada (últim fotograma), el text i els bàners.
    return (
      <div ref={pista} className={styles.panell}>
        {/* eslint-disable-next-line @next/next/no-img-element -- últim fotograma exacte del vídeo */}
        <img src="/video/taller-final.webp" alt={t('sr')} className={styles.escena} />
        <div className={styles.vel} aria-hidden="true" />
        {textos(true)}
        {capaSuperior(true)}
      </div>
    );
  }

  return (
    <div ref={pista}>
      <ScrollVideo
        clips={[{ src: '/video/taller.mp4', srcMobile: '/video/taller-m.mp4', poster: '/video/taller-poster.webp', scroll: 5 }]}
        label={t('sr')}
        offsetTop={0}
        fade={0}
        smoothing={SUAVITAT}
        remap={(local) => tempsDeProgres(local) / DURADA}
        mediaClassName={styles.escena}
        onFrame={onFrame}
      >
        <div className={styles.vel} aria-hidden="true" />
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
