'use client';

// Anatomia d'una bici, dins la secció de taller: una bici real es desmunta peça a peça amb el
// scroll (vídeo fotorealista generat a partir de les fotos de la Pinarello del client). A cada
// aturada, una etiqueta assenyala la peça i la fitxa explica què fa, què hi guanyes millorant-la,
// el servei de taller i els productes de la botiga.

import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import { ScrollVideo, type ScrollVideoFrame } from '@/components/video/ScrollVideo';
import { Link } from '@/i18n/navigation';
import type { Producte, ServeiTaller } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { useReducedMotion } from '@/lib/scroll-scene';
import { aturat, MOMENTS, pasActiu, tempsVideo } from './anatomia-fases';
import styles from './AnatomiaTaller.module.css';

const DURADA = 10.04;
const WHATSAPP = '34658909455';

type Props = { serveis: ServeiTaller[]; productes: Producte[] };

export function AnatomiaTaller({ serveis, productes }: Props) {
  const t = useTranslations('anatomia');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const fitxes = useRef<HTMLOListElement>(null);
  const etiquetes = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);

  // Tot el que canvia amb el scroll va directament al DOM (mai amb setState).
  const onFrame = ({ progress }: ScrollVideoFrame) => {
    const pas = pasActiu(progress);
    const quiet = aturat(progress);
    fitxes.current?.querySelectorAll<HTMLElement>(':scope > li').forEach((li, i) => {
      li.dataset.state = i < pas ? 'fet' : i === pas ? 'actiu' : 'pendent';
    });
    etiquetes.current?.querySelectorAll<HTMLElement>('[data-peca]').forEach((el, i) => {
      el.dataset.visible = String(i === pas && quiet);
    });
    if (intro.current) intro.current.dataset.visible = String(pas < 0);
    if (barra.current) barra.current.style.transform = `scaleX(${progress})`;
  };

  const euros = (c: number) => formatEuros(c, locale);

  const fitxa = (peca: (typeof MOMENTS)[number]['peca'], index: number) => {
    const servei = serveis.find((s) => s.peca === peca);
    const delaPeca = productes.filter((p) => p.peca === peca).slice(0, 3);
    return (
      <li key={peca} className={styles.fitxa} data-state={reduced ? 'actiu' : 'pendent'}>
        <p className={styles.numero}>
          {String(index + 1).padStart(2, '0')} <span>/ {String(MOMENTS.length).padStart(2, '0')}</span>
        </p>
        <h3 className={styles.nom}>{t(`peces.${peca}.nom`)}</h3>
        <p className={styles.funcio}>{t(`peces.${peca}.funcio`)}</p>
        <p className={styles.potencial}>
          <strong>{t('potencial')}</strong> {t(`peces.${peca}.potencial`)}
        </p>

        {servei && (
          <div className={styles.bloc}>
            <p className={styles.etiquetaBloc}>{t('alTaller')}</p>
            <div className={styles.servei}>
              <span>{t(`peces.${peca}.servei`)}</span>
              <strong>
                {t('desDe', { preu: euros(servei.desDe) })}
                {servei.ficticia && <span className="mostra">*</span>}
              </strong>
            </div>
            <Link className={styles.enllac} href={{ pathname: '/taller/cita', query: { peca } }}>
              {t('reservar')} →
            </Link>
          </div>
        )}

        {delaPeca.length > 0 && (
          <div className={styles.bloc}>
            <p className={styles.etiquetaBloc}>{t('aLaBotiga')}</p>
            <ul className={styles.productes}>
              {delaPeca.map((p) => (
                <li key={p.id}>
                  <span>
                    <small>{p.marca}</small> {p.nom}
                  </span>
                  <strong>
                    {euros(p.preu)}
                    {p.ficticia && <span className="mostra">*</span>}
                  </strong>
                </li>
              ))}
            </ul>
            <a
              className={styles.enllac}
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t('missatgeWhatsapp', { peca: t(`peces.${peca}.nom`) }))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('preguntar')} →
            </a>
          </div>
        )}
      </li>
    );
  };

  if (reduced) {
    // Sense moviment: la bici ja desmuntada i totes les fitxes, una sota l'altra.
    return (
      <div className={styles.estatic}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fotograma final exacte del vídeo */}
        <img src="/video/anatomia-final.webp" alt={t('sr')} className={styles.fotoEstatica} />
        <ol className={styles.llistaEstatica}>{MOMENTS.map((m, i) => fitxa(m.peca, i))}</ol>
      </div>
    );
  }

  return (
    <ScrollVideo
      clips={[{ src: '/video/anatomia.mp4', srcMobile: '/video/anatomia-m.mp4', poster: '/video/anatomia-poster.webp', scroll: 6 }]}
      label={t('sr')}
      offsetTop={0}
      fade={0}
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
              // A la meitat dreta del fotograma, el text va a l'esquerra del punt perquè no surti de la caixa.
              className={`${styles.etiqueta} ${m.x > 70 ? styles.etiquetaEsquerra : ''}`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <i />
              {t(`peces.${m.peca}.nom`)}
            </span>
          ))}
        </div>

        <div className={styles.text}>
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

        <div className={styles.progres} aria-hidden="true">
          <div ref={barra} />
        </div>
      </div>
    </ScrollVideo>
  );
}
