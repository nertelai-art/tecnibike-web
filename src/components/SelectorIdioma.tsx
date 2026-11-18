'use client';

// Selector d'idioma de la barra: només es veu l'idioma triat (bandera i codi); en clicar-lo, un
// desplegable amb les quatre banderes i el nom de cada idioma en la seva llengua. Es tanca amb Escape,
// clicant fora o triant-ne un. Les banderes són SVG propis (la senyera no té emoji que es vegi a tot arreu).

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './Capcalera.module.css';

/** El nom de cada idioma en la seva llengua: no es tradueix. */
const NOMS: Record<Locale, string> = { ca: 'Català', es: 'Español', en: 'English', fr: 'Français' };

function Bandera({ idioma }: { idioma: Locale }) {
  return (
    <svg className={styles.bandera} viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      {idioma === 'ca' && (
        <>
          <rect width="30" height="20" fill="#fcdd09" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} y={2.22 + i * 4.44} width="30" height="2.22" fill="#da121a" />
          ))}
        </>
      )}
      {idioma === 'es' && (
        <>
          <rect width="30" height="20" fill="#aa151b" />
          <rect y="5" width="30" height="10" fill="#f1bf00" />
        </>
      )}
      {idioma === 'en' && (
        <>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0 30 20M30 0 0 20" stroke="#fff" strokeWidth="4" />
          <path d="M0 0 30 20M30 0 0 20" stroke="#c8102e" strokeWidth="1.6" />
          <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
          <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4" />
        </>
      )}
      {idioma === 'fr' && (
        <>
          <rect width="10" height="20" fill="#002654" />
          <rect x="10" width="10" height="20" fill="#fff" />
          <rect x="20" width="10" height="20" fill="#ce1126" />
        </>
      )}
    </svg>
  );
}

export function SelectorIdioma({ onTria }: { onTria?: () => void }) {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const id = useId();
  const caixa = useRef<HTMLDivElement>(null);
  const boto = useRef<HTMLButtonElement>(null);
  const [obert, setObert] = useState(false);

  useEffect(() => {
    if (!obert) return;
    const fora = (event: PointerEvent) => {
      if (!caixa.current?.contains(event.target as Node)) setObert(false);
    };
    const tecla = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Només aquest desplegable: el menú de mòbil que el conté es queda obert.
      event.stopPropagation();
      setObert(false);
      boto.current?.focus();
    };
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', tecla, true);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', tecla, true);
    };
  }, [obert]);

  return (
    <div ref={caixa} className={styles.idioma} data-obert={obert || undefined}>
      <button
        ref={boto}
        type="button"
        className={styles.idiomaBoto}
        aria-expanded={obert}
        aria-controls={id}
        aria-label={t('idiomaActual', { idioma: NOMS[locale] })}
        onClick={() => setObert((x) => !x)}
      >
        <Bandera idioma={locale} />
        <span>{locale.toUpperCase()}</span>
        <span className={styles.idiomaFletxa} aria-hidden="true" />
      </button>
      <ul id={id} className={styles.idiomaLlista} aria-label={t('idioma')} hidden={!obert}>
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? 'true' : undefined}
              onClick={() => {
                setObert(false);
                onTria?.();
              }}
            >
              <Bandera idioma={l} />
              <span>{NOMS[l]}</span>
              {l === locale && (
                <span className={styles.idiomaTriat} aria-hidden="true">
                  ✓
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
