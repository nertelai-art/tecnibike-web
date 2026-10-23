'use client';

// Diàleg amb el formulari de cita al taller, sobre la mateixa pàgina. Fa servir <dialog> natiu:
// atrapa el focus, es tanca amb Escape i torna el focus al botó que l'ha obert.

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { CitaTaller } from '@/components/reserva/CitaTaller';
import { enllacWhatsapp } from '@/lib/contacte';
import type { Peca, ServeiTaller } from '@/lib/plataforma/esquema';
import { EVENT_CITA, ID_DIALEG_CITA } from './obrir-cita';
import styles from './DialegCita.module.css';

export function DialegCita({ serveis }: { serveis: ServeiTaller[] }) {
  const t = useTranslations('cita');
  const tw = useTranslations('whatsapp');
  const dialeg = useRef<HTMLDialogElement>(null);
  // Cada obertura munta un formulari nou amb la peça que toca.
  const [obertura, setObertura] = useState<{ n: number; peca: Peca | null }>({ n: 0, peca: null });

  useEffect(() => {
    const obre = (event: Event) => {
      const peca = (event as CustomEvent<Peca | null>).detail;
      setObertura((o) => ({ n: o.n + 1, peca }));
      dialeg.current?.showModal();
    };
    window.addEventListener(EVENT_CITA, obre);
    return () => window.removeEventListener(EVENT_CITA, obre);
  }, []);

  // Amb el diàleg obert, la pàgina de sota no fa scroll.
  useEffect(() => {
    const d = dialeg.current;
    if (!d) return;
    const tanca = () => (document.documentElement.style.overflow = '');
    const observador = new MutationObserver(() => {
      document.documentElement.style.overflow = d.open ? 'hidden' : '';
    });
    observador.observe(d, { attributes: true, attributeFilter: ['open'] });
    d.addEventListener('close', tanca);
    return () => {
      observador.disconnect();
      d.removeEventListener('close', tanca);
    };
  }, []);

  return (
    <dialog
      ref={dialeg}
      id={ID_DIALEG_CITA}
      className={styles.dialeg}
      aria-labelledby="dialeg-cita-titol"
      // Un clic al fons fosc (fora de la caixa) tanca el diàleg.
      onClick={(event) => {
        if (event.target === event.currentTarget) dialeg.current?.close();
      }}
    >
      <div className={styles.caixa}>
        <header className={styles.cap}>
          <div>
            <p className="situacio">{t('situacio')}</p>
            <h2 id="dialeg-cita-titol" className={styles.titol}>
              {t('titol')}
            </h2>
            <p className={styles.intro}>{t('intro')}</p>
          </div>
          <button type="button" className={styles.tancar} onClick={() => dialeg.current?.close()} aria-label={t('tancar')}>
            ×
          </button>
        </header>
        {obertura.n > 0 && <CitaTaller key={obertura.n} serveis={serveis} pecaInicial={obertura.peca} />}
        <p className={styles.alternativa}>
          {tw('alternativa')}{' '}
          <a href={enllacWhatsapp(tw('missatgeCita'))} target="_blank" rel="noopener noreferrer">
            {tw('parla')}
          </a>
        </p>
      </div>
    </dialog>
  );
}
