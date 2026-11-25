import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { CATEGORIES_EQUIPAMENT } from '@/content/equipament';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { CORREU, enllacWhatsapp, INSTAGRAM, TELEFON, TELEFON_VISIBLE } from '@/lib/contacte';
import { enllacCreditNertel } from '@/lib/credit-nertel';
import styles from './Peu.module.css';

// Peu de totes les pàgines. Fa de mapa del web: una columna per secció (bicis, taller, botiga i on
// som), com la barra de dalt però sencera. Sota, la marca en gran, el que és legal i, a baix de tot,
// la franja «Web feta per Nertel», la mateixa que a les altres webs de clients.
//
// Els crèdits de les fotos de Wikimedia Commons (les llicències demanen citar-los) són a /credits.

const COM_ARRIBAR = 'https://www.google.com/maps/dir/?api=1&destination=41.85028,3.10828';

export async function Peu() {
  const t = await getTranslations('peu');
  const tv = await getTranslations('visita');
  const te = await getTranslations('equipament');
  const locale = await getLocale();
  const idioma = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  const columnes = [
    {
      titol: t('bicis'),
      enllacos: [
        { href: '/#flota', text: t('lloguer') },
        { href: '/venda', text: t('venda') },
        { href: '/#rutes', text: t('rutes') },
        { href: '/#marques', text: t('marques') },
      ],
    },
    {
      titol: t('taller'),
      enllacos: [
        { href: '/#taller', text: t('serveis') },
        { href: '/taller/cita', text: t('cita') },
      ],
    },
    {
      titol: t('botiga'),
      enllacos: CATEGORIES_EQUIPAMENT.map((c) => ({ href: `/botiga/${c}`, text: te(`categories.${c}.nom`) })),
    },
  ];

  return (
    <footer className={styles.peu}>
      <div className={`contenidor ${styles.graella}`}>
        <div className={styles.presentacio}>
          <p className={styles.lema}>{t('lema')}</p>
          <ul className={styles.contacte} aria-label={t('contacte')}>
            <li>
              <a href={`tel:${TELEFON}`}>{TELEFON_VISIBLE}</a>
            </li>
            <li>
              <a href={`mailto:${CORREU}`}>{CORREU}</a>
            </li>
            <li>
              <a href={enllacWhatsapp()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label={t('instagram')}>
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <nav className={styles.mapa} aria-label={t('mapaWeb')}>
          {columnes.map((columna) => (
            <div key={columna.titol} className={styles.columna}>
              <h2 className={styles.titol}>{columna.titol}</h2>
              <ul>
                {columna.enllacos.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href}>{e.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.columna}>
            <h2 className={styles.titol}>{t('visita')}</h2>
            <address className={styles.adreca}>
              {tv('adreca')}
              <br />
              {tv('poble')}
            </address>
            <p className={styles.horari}>
              {tv('dies')}
              <br />
              {tv('hores')}
              <br />
              <span>{tv('diumenge')}</span>
            </p>
            <a className={styles.comArribar} href={COM_ARRIBAR} target="_blank" rel="noopener noreferrer">
              {t('comArribar')}
            </a>
          </div>
        </nav>
      </div>

      <div className="contenidor">
        <p className={styles.marca} aria-hidden="true">
          TCNBK
        </p>
        <ul className={styles.legal}>
          <li>{t('drets', { any: 2026 })}</li>
          <li>
            <a href="https://tecnibike.es/aviso-legal/">{t('legal')}</a>
          </li>
          <li>
            <a href="https://tecnibike.es/politica-de-privacidad/">{t('privacitat')}</a>
          </li>
          <li>
            <a href="https://tecnibike.es/politica-de-cookies/">{t('galetes')}</a>
          </li>
          <li>
            <Link href="/credits">{t('credits')}</Link>
          </li>
        </ul>
      </div>

      {/* Qui ha fet la web. Franja pròpia sota el peu, discreta, que porta a nertel.ai. */}
      <div className={styles.creditNertel}>
        <a href={enllacCreditNertel(idioma)} target="_blank" rel="noopener">
          <span>{t('fetaPer')}</span>
          {/* El blau marí del símbol és per a fons clars: sobre el peu fosc s'aclareix perquè es vegi sencer. */}
          <Image src="/img/nertel-mark.png" alt="" width={116} height={96} className={styles.creditNertelSimbol} />
          <span className={styles.creditNertelNom}>Nertel</span>
        </a>
      </div>
    </footer>
  );
}
