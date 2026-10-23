'use client';

// Portada + anatomia: una sola secció alta amb el canvas enganxat. Primer és la portada (titular i
// botons), després la bici s'esbotza i es recorren les sis peces amb el seu servei de taller, i al
// final es torna a muntar. No importa three.js: l'escena es carrega en diferit quan cal.

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import type { ServeiTaller, Valoracio } from '@/lib/plataforma/esquema';
import { Link } from '@/i18n/navigation';
import { formatEuros } from '@/lib/preus';
import { useNearViewport, useReducedMotion, useRenderMode, useScrollProgress } from '@/lib/scroll-scene';
import { ORDRE_PECES, opacitatPortada, pasActiu } from './anatomia-fases';
import styles from './AnatomiaShowcase.module.css';

const AnatomiaScene = dynamic(() => import('./AnatomiaScene'), { ssr: false });

type Props = { serveis: ServeiTaller[]; valoracio: Valoracio };

export function AnatomiaShowcase({ serveis, valoracio }: Props) {
  const t = useTranslations('anatomia');
  const tp = useTranslations('portada');
  const locale = useLocale();
  const seccio = useRef<HTMLElement>(null);
  const portada = useRef<HTMLDivElement>(null);
  const peces = useRef<HTMLOListElement>(null);
  const final = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLParagraphElement>(null);
  const mode = useRenderMode();
  const reducedMotion = useReducedMotion();
  const aprop = useNearViewport(seccio, '200px');
  // Al servidor («pending») es pinta ja la versió animada, perquè no salti la maqueta en hidratar.
  const animat = mode !== 'static' && !reducedMotion;

  // Tot el que canvia amb el scroll es toca directament al DOM (mai amb setState).
  const progress = useScrollProgress(seccio, (valor) => {
    if (!animat) return;
    const pas = pasActiu(valor);
    if (portada.current) {
      const opacitat = opacitatPortada(valor);
      portada.current.style.opacity = String(opacitat);
      portada.current.style.transform = `translateY(${(1 - opacitat) * -24}px)`;
      portada.current.style.visibility = opacitat < 0.01 ? 'hidden' : 'visible';
      if (pista.current) pista.current.style.opacity = String(opacitat);
    }
    peces.current?.querySelectorAll<HTMLElement>(':scope > li').forEach((item, index) => {
      item.dataset.state = index < pas ? 'fet' : index === pas ? 'actiu' : 'pendent';
    });
    if (peces.current) peces.current.dataset.visible = String(pas >= 0 && pas < ORDRE_PECES.length);
    if (final.current) final.current.dataset.visible = String(pas >= ORDRE_PECES.length);
    if (barra.current) barra.current.style.transform = `scaleX(${valor})`;
  });

  const servei = (peca: string) => serveis.find((s) => s.peca === peca);

  const fitxes = ORDRE_PECES.map((peca, index) => {
    const s = servei(peca);
    return (
      <li key={peca} data-state="pendent" className={styles.fitxa}>
        <span className={styles.numero}>{String(index + 1).padStart(2, '0')}</span>
        <h3 className={styles.nomPeca}>{t(`peces.${peca}.nom`)}</h3>
        <p className={styles.servei}>{t(`peces.${peca}.servei`)}</p>
        <p className={styles.text}>{t(`peces.${peca}.text`)}</p>
        {s && (
          <p className={styles.preu}>
            <strong>
              {t('desDe', { preu: formatEuros(s.desDe, locale) })}
              {s.ficticia && <span className="mostra">*</span>}
            </strong>
            <span className={styles.termini}>{t('termini', { dies: s.dies })}</span>
          </p>
        )}
        <Link className="boto boto--clar boto--petit" href={{ pathname: '/taller/cita', query: { peca } }}>
          {t('reservar')} <span className="fletxa">→</span>
        </Link>
      </li>
    );
  });

  return (
    <section ref={seccio} id="contingut" aria-labelledby="portada-titol" className={`${styles.seccio} ${animat ? styles.alta : ''}`}>
      <div className={animat ? styles.enganxat : styles.estatic}>
        {mode === '3d' && aprop && (
          <div className={styles.escena}>
            <AnatomiaScene progress={progress} reducedMotion={reducedMotion} />
          </div>
        )}
        {mode === 'static' && (
          <div className={styles.fotoReserva}>
            <Image src="/img/botiga/pinarello-carretera.jpg" alt={t('sr')} fill sizes="(min-width: 980px) 50vw, 100vw" priority />
          </div>
        )}

        <div className={`contenidor ${styles.capa}`}>
          <div ref={portada} className={styles.portada}>
            <p className="situacio">{tp('situacio')}</p>
            <h1 id="portada-titol" className={styles.titol}>
              <span>{tp('titol1')}</span> <span>{tp('titol2')}</span> <span className={styles.titolBlau}>{tp('titol3')}</span>
            </h1>
            <p className={styles.subtitol}>{tp('subtitol')}</p>
            <div className={styles.botons}>
              <a href="#flota" className="boto boto--blau">
                {tp('ctaLloguer')} <span className="fletxa">→</span>
              </a>
              <Link href="/taller/cita" className="boto boto--clar">
                {tp('ctaTaller')}
              </Link>
            </div>
            <p className={styles.valoracio}>
              <span className={styles.estrelles} aria-hidden="true">
                ★★★★★
              </span>
              {tp('valoracio', { mitjana: valoracio.mitjana.toLocaleString(locale), total: valoracio.total })}
            </p>
          </div>

          {animat ? (
            <>
              <div className={styles.panell}>
                <p className="situacio">{t('situacio')}</p>
                <ol ref={peces} className={styles.fitxes} data-visible="false">
                  {fitxes}
                </ol>
              </div>
              <div ref={final} className={styles.final} data-visible="false">
                <h2 className={styles.finalTitol}>{t('final.titol')}</h2>
                <p>{t('final.text')}</p>
                <Link href="/taller/cita" className="boto boto--blau">
                  {t('final.cta')} <span className="fletxa">→</span>
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.llistaEstatica}>
              <p className="situacio">{t('situacio')}</p>
              <h2 className={styles.finalTitol}>{t('titol')}</h2>
              <ol className={styles.fitxesEstatiques}>{fitxes}</ol>
            </div>
          )}
        </div>

        {animat && (
          <>
            <p ref={pista} className={styles.pista} aria-hidden="true">
              {tp('scroll')}
            </p>
            <div className={styles.progres} aria-hidden="true">
              <div ref={barra} />
            </div>
          </>
        )}
        <p className="sr-only">{t('sr')}</p>
      </div>
    </section>
  );
}
