'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Logo } from './Logo';
import styles from './Capcalera.module.css';

const ENLLACOS = [
  { href: '/#flota', clau: 'lloguer' },
  { href: '/#taller', clau: 'taller' },
  { href: '/#rutes', clau: 'rutes' },
  { href: '/#botiga', clau: 'botiga' },
  { href: '/#visita', clau: 'visita' },
] as const;

export function Capcalera() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [obert, setObert] = useState(false);

  // Amb el menú obert, Escape el tanca i la pàgina de sota no fa scroll.
  useEffect(() => {
    if (!obert) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setObert(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [obert]);

  return (
    <header className={styles.capcalera}>
      <a className="saltar" href="#contingut">
        {t('saltar')}
      </a>
      <div className={styles.barra}>
        <Link href="/" className={styles.logo} aria-label={t('inici')}>
          <Logo />
        </Link>

        <nav aria-label={t('menu')} className={`${styles.nav} ${obert ? styles.obert : ''}`} id="menu-principal">
          <ul>
            {ENLLACOS.map((enllac) => (
              <li key={enllac.clau}>
                <Link href={enllac.href} onClick={() => setObert(false)}>
                  {t(enllac.clau)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.idiomes} aria-label={t('idioma')}>
            {routing.locales.map((l) => (
              <li key={l}>
                <Link href={pathname} locale={l} aria-current={l === locale ? 'true' : undefined} hrefLang={l}>
                  {l.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.accions}>
          <Link href="/#flota" className="boto boto--blau boto--petit">
            {t('reserva')}
          </Link>
          <button
            type="button"
            className={styles.hamburguesa}
            aria-expanded={obert}
            aria-controls="menu-principal"
            aria-label={obert ? t('tancar') : t('menu')}
            onClick={() => setObert((valor) => !valor)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
