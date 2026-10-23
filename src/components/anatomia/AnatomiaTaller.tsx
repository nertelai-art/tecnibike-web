'use client';

// Anatomia d'una bici, dins la secció de taller: una bici real es desmunta peça a peça amb el
// scroll (vídeo fotorealista generat a partir de les fotos de la Pinarello del client). A cada
// peça, una etiqueta l'assenyala i la fitxa mostra les millors peces de la botiga i les reparacions
// del taller, sense preus. Sempre a la vista i ben grans: demanar cita i parlar per WhatsApp.

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { BotoCita } from '@/components/cita/BotoCita';
import { ScrollVideo, type ScrollVideoFrame } from '@/components/video/ScrollVideo';
import { enllacWhatsapp } from '@/lib/contacte';
import type { Peca, Producte } from '@/lib/plataforma/esquema';
import { useReducedMotion } from '@/lib/scroll-scene';
import { aturat, MOMENTS, pasActiu, progresDePeca, tempsVideo } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

const DURADA = 10.04;
/** Inèrcia del vídeo respecte del scroll: prou per suavitzar la roda del ratolí, però s'atura de
 *  seguida quan s'atura el scroll (no es mou sol). */
const SUAVITAT = 12;

type Props = { productes: Producte[] };

export function AnatomiaTaller({ productes }: Props) {
  const t = useTranslations('anatomia');
  const tw = useTranslations('whatsapp');
  const reduced = useReducedMotion();
  const pista = useRef<HTMLDivElement>(null);
  const fitxes = useRef<HTMLOListElement>(null);
  const index = useRef<HTMLOListElement>(null);
  const etiquetes = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);

  // Tot el que canvia amb el scroll va directament al DOM (mai amb setState).
  const onFrame = ({ progress }: ScrollVideoFrame) => {
    const pas = pasActiu(progress);
    const fora = aturat(progress);
    const estat = (i: number) => (i < pas ? 'fet' : i === pas ? 'actiu' : 'pendent');
    fitxes.current?.querySelectorAll<HTMLElement>(':scope > li').forEach((li, i) => (li.dataset.state = estat(i)));
    index.current?.querySelectorAll<HTMLElement>('li').forEach((li, i) => (li.dataset.state = estat(i)));
    etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((el, i) => (el.dataset.visible = String(i === pas && fora)));
    if (intro.current) intro.current.dataset.visible = String(pas < 0);
    if (barra.current) barra.current.style.transform = `scaleX(${progress})`;
  };

  /** Salta a una peça des de l'índex: fa scroll fins al punt on ja ha sortit. */
  const anarA = (i: number) => {
    const el = pista.current?.querySelector<HTMLElement>(':scope > div');
    if (!el) return;
    const inici = el.getBoundingClientRect().top + window.scrollY;
    const recorregut = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: inici + recorregut * progresDePeca(i), behavior: 'smooth' });
  };

  const fitxa = (peca: Peca, i: number) => {
    const delaPeca = productes.filter((p) => p.peca === peca).slice(0, 3);
    return (
      <li key={peca} className={styles.fitxa} data-state={reduced ? 'actiu' : 'pendent'}>
        <h3 className={styles.nom}>{t(`peces.${peca}.nom`)}</h3>
        <div className={styles.blocs}>
          {delaPeca.length > 0 && (
            <div className={styles.bloc}>
              <p className={styles.etiquetaBloc}>{t('millorsPeces')}</p>
              <ul className={styles.llista}>
                {delaPeca.map((p) => (
                  <li key={p.id}>
                    <small>{p.marca}</small> {p.nom}
                    {p.ficticia && <span className="mostra">*</span>}
                  </li>
                ))}
              </ul>
              <a className={styles.enllac} href={enllacWhatsapp(t('missatgeWhatsapp', { peca: t(`peces.${peca}.nom`) }))} target="_blank" rel="noopener noreferrer">
                {t('preguntar')} →
              </a>
            </div>
          )}
          <div className={styles.bloc}>
            <p className={styles.etiquetaBloc}>{t('reparacions')}</p>
            <ul className={styles.llista}>
              {(['a', 'b', 'c'] as const).map((r) => (
                <li key={r}>{t(`peces.${peca}.reparacions.${r}`)}</li>
              ))}
            </ul>
            <BotoCita peca={peca} className={styles.enllac}>
              {t('reservar')} →
            </BotoCita>
          </div>
        </div>
        <span className={styles.numeroFons} aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
      </li>
    );
  };

  const accions = (
    <div className={styles.accions}>
      <BotoCita className="boto boto--blau">
        {t('ctaCita')} <span className="fletxa">→</span>
      </BotoCita>
      <a className={`boto ${styles.botoWhatsapp}`} href={enllacWhatsapp(tw('missatgeCita'))} target="_blank" rel="noopener noreferrer">
        <IconaWhatsapp /> {tw('parla')}
      </a>
    </div>
  );

  if (reduced) {
    // Sense moviment: la bici ja desmuntada i totes les fitxes, una sota l'altra.
    return (
      <div className={styles.estatic}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fotograma final exacte del vídeo */}
        <img src="/video/anatomia-final.webp" alt={t('sr')} className={styles.fotoEstatica} />
        {accions}
        <ol className={styles.llistaEstatica}>{MOMENTS.map((m, i) => fitxa(m.peca, i))}</ol>
      </div>
    );
  }

  return (
    <div ref={pista}>
      <ScrollVideo
        clips={[{ src: '/video/anatomia.mp4', srcMobile: '/video/anatomia-m.mp4', poster: '/video/anatomia-poster.webp', scroll: 7 }]}
        label={t('sr')}
        offsetTop={0}
        fade={0}
        smoothing={SUAVITAT}
        remap={(local) => tempsVideo(local) / DURADA}
        mediaClassName={styles.video}
        onFrame={onFrame}
      >
        <div className={styles.capa}>
          {/* Mateixa caixa que el vídeo, per situar les etiquetes en % del fotograma. */}
          <div ref={etiquetes} className={styles.video} aria-hidden="true">
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

          <div className={styles.text}>
            <ol ref={index} className={styles.index} aria-label={t('index')}>
              {MOMENTS.map((m, i) => (
                <li key={m.peca} data-state="pendent">
                  <button type="button" onClick={() => anarA(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span> {t(`peces.${m.peca}.nom`)}
                  </button>
                </li>
              ))}
            </ol>

            <div className={styles.contingut}>
              <div ref={intro} className={styles.intro} data-visible="true">
                <p className="situacio">{t('situacio')}</p>
                <h2 className={styles.titol}>{t('titol')}</h2>
                <p>{t('intro')}</p>
                <p className={styles.pista}>{t('pista')}</p>
              </div>
              <ol ref={fitxes} className={styles.fitxes}>
                {MOMENTS.map((m, i) => fitxa(m.peca, i))}
              </ol>
            </div>

            {accions}
          </div>

          <div className={styles.progres} aria-hidden="true">
            <div ref={barra} />
          </div>
        </div>
      </ScrollVideo>
    </div>
  );
}

function IconaWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
    </svg>
  );
}
