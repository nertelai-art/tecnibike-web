'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from './Logo';
import { SelectorIdioma } from './SelectorIdioma';
import styles from './Capcalera.module.css';

const ENLLACOS = [
  { href: '/#flota', clau: 'lloguer' },
  { href: '/venda', clau: 'venda' },
  { href: '/#taller', clau: 'taller' },
  { href: '/#rutes', clau: 'rutes' },
  { href: '/#botiga', clau: 'botiga' },
  { href: '/#visita', clau: 'visita' },
] as const;

export function Capcalera() {
  const t = useTranslations('nav');
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
        <Link
          href="/"
          className={styles.logo}
          aria-label={t('inici')}
          onClick={(event) => {
            // Ja som a l'inici (potser a /#visita, tocant al peu): Next no navegaria, així que pugem.
            if (pathname === '/') {
              event.preventDefault();
              history.replaceState(null, '', window.location.pathname);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
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
          <SelectorIdioma onTria={() => setObert(false)} />
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
