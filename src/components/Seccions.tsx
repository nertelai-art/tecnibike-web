import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Producte, Ressenya, ServeiTaller, Valoracio } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';
import { Link } from '@/i18n/navigation';
import { ORDRE_PECES } from './anatomia/anatomia-fases';
import { AnatomiaTaller } from './anatomia/AnatomiaTaller';
import { MapaRutes } from './rutes/MapaRutes';
import { Revela } from './Revela';
import styles from './Seccions.module.css';

// Seccions de l'inici que no necessiten JavaScript al navegador (excepte l'entrada discreta).

export async function ComFunciona() {
  const t = await getTranslations('comFunciona');
  const passos = ['u', 'dos', 'tres'] as const;
  return (
    <section className={`seccio ${styles.comFunciona}`} aria-labelledby="com-funciona-titol">
      <div className="contenidor">
        <h2 id="com-funciona-titol" className={styles.titolMig}>
          {t('titol')}
        </h2>
        <ol className={styles.passos}>
          {passos.map((pas, index) => (
            <Revela as="li" key={pas} retard={index * 90} className={styles.pas}>
              <span className={styles.numeroPas}>{index + 1}</span>
              <h3>{t(`passos.${pas}.titol`)}</h3>
              <p>{t(`passos.${pas}.text`)}</p>
            </Revela>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function Taller({ serveis, productes }: { serveis: ServeiTaller[]; productes: Producte[] }) {
  const t = await getTranslations('taller');
  const ta = await getTranslations('anatomia');
  const locale = await getLocale();
  const ordenats = ORDRE_PECES.map((peca) => serveis.find((s) => s.peca === peca)).filter((s) => s !== undefined);
  return (
    <section id="taller" className={styles.taller} aria-labelledby="taller-titol">
      <div className={`contenidor ${styles.capTaller}`}>
        <p className={`situacio ${styles.situacioClara}`}>{t('situacio')}</p>
        <h2 id="taller-titol" className="titol-seccio">
          {t('titol')}
        </h2>
        <p className={`intro ${styles.introClara}`}>{t('intro')}</p>
      </div>

      <AnatomiaTaller serveis={serveis} productes={productes} />

      <div className={`contenidor ${styles.tallerGraella}`}>
        <div>
          <ul className={styles.avantatges}>
            <li>{t('avantatges.whatsapp')}</li>
            <li>{t('avantatges.pressupost')}</li>
            <li>{t('avantatges.cafe')}</li>
            <li>{t('electrica')}</li>
          </ul>
          <Link href="/taller/cita" className="boto boto--fosc-sobre-fosc">
            {t('reservar')} <span className="fletxa">→</span>
          </Link>
        </div>
        <Revela className={styles.llistaServeis}>
          <table>
            <caption className="sr-only">{t('situacio')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('servei')}</th>
                <th scope="col">{t('termini')}</th>
                <th scope="col">{t('preu')}</th>
              </tr>
            </thead>
            <tbody>
              {ordenats.map((s) => (
                <tr key={s.id}>
                  <th scope="row">
                    <span className={styles.pecaServei}>{ta(`peces.${s.peca}.nom`)}</span>
                    {ta(`peces.${s.peca}.servei`)}
                  </th>
                  <td>{ta('termini', { dies: s.dies })}</td>
                  <td className={styles.preuServei}>
                    {ta('desDe', { preu: formatEuros(s.desDe, locale) })}
                    {s.ficticia && <span className="mostra">*</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Revela>
      </div>
    </section>
  );
}

export async function Rutes() {
  const t = await getTranslations('rutes');
  return (
    <section id="rutes" className={`seccio ${styles.rutes}`} aria-labelledby="rutes-titol">
      <div className="contenidor">
        <p className="situacio">{t('situacio')}</p>
        <h2 id="rutes-titol" className="titol-seccio">
          {t('titol')}
        </h2>
        <p className="intro">{t('intro')}</p>
        <MapaRutes />
        <a href="#visita" className="boto boto--clar">
          {t('guia')} <span className="fletxa">→</span>
        </a>
      </div>
    </section>
  );
}

const MARQUES_BICIS = ['Cannondale', 'Scott', 'Specialized', 'Pinarello', 'Colnago'];
const MARQUES_MATERIAL = ['Shimano', 'SRAM', 'Continental', 'Pirelli', 'Muc-Off', 'Thule', 'POC', 'Gobik', 'Kask', 'Assos', 'Oakley', 'DMT', 'Maurten', '226ERS', 'SiS'];

export async function Marques() {
  const t = await getTranslations('marques');
  return (
    <section className={styles.marques} aria-labelledby="marques-titol">
      <div className="contenidor">
        <h2 id="marques-titol" className="sr-only">
          {t('titol')}
        </h2>
        <p className={styles.etiquetaMarques}>{t('bicis')}</p>
        <ul className={styles.marquesBicis}>
          {MARQUES_BICIS.map((marca) => (
            <li key={marca}>{marca}</li>
          ))}
        </ul>
        <p className={styles.etiquetaMarques}>{t('material')}</p>
        <ul className={styles.marquesMaterial}>
          {MARQUES_MATERIAL.map((marca) => (
            <li key={marca}>{marca}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Botiga() {
  const t = await getTranslations('botiga');
  const fotos = [
    { src: '/img/botiga/pinarello-dogma.jpg', clau: 'dogma', classe: styles.fotoGran },
    { src: '/img/botiga/interior-carretera.jpg', clau: 'interiorCarretera', classe: '' },
    { src: '/img/botiga/interior-ebikes.jpg', clau: 'interiorEbikes', classe: '' },
    { src: '/img/botiga/colnago.jpg', clau: 'colnago', classe: '' },
    { src: '/img/botiga/pinarello-carretera.jpg', clau: 'pinarello', classe: '' },
  ] as const;
  return (
    <section id="botiga" className={`seccio ${styles.botiga}`} aria-labelledby="botiga-titol">
      <div className={`contenidor ${styles.botigaGraella}`}>
        <div className={styles.botigaText}>
          <p className="situacio">{t('situacio')}</p>
          <h2 id="botiga-titol" className="titol-seccio">
            {t('titol')}
          </h2>
          <p className="intro">{t('text')}</p>
        </div>
        <ul className={styles.mosaic}>
          {fotos.map((foto, index) => (
            <Revela as="li" key={foto.clau} retard={index * 60} className={`${styles.foto} ${foto.classe}`}>
              <Image src={foto.src} alt={t(`fotos.${foto.clau}`)} fill sizes="(min-width: 980px) 30vw, 50vw" />
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Ressenyes({ ressenyes, valoracio }: { ressenyes: Ressenya[]; valoracio: Valoracio }) {
  const t = await getTranslations('ressenyes');
  const locale = await getLocale();
  return (
    <section className={`seccio ${styles.ressenyes}`} aria-labelledby="ressenyes-titol">
      <div className="contenidor">
        <div className={styles.capRessenyes}>
          <h2 id="ressenyes-titol" className={styles.titolMig}>
            {t('titol')}
          </h2>
          <p className={styles.nota}>
            <strong>{valoracio.mitjana.toLocaleString(locale)}</strong>
            <span aria-hidden="true" className={styles.estrelles}>
              ★★★★★
            </span>
            <span>
              {valoracio.total} · {t('font')}
            </span>
          </p>
        </div>
        <ul className={styles.ressenyesGraella}>
          {ressenyes.map((r, index) => (
            <Revela as="li" key={r.autor + index} retard={index * 80} className={styles.ressenya}>
              <p className={styles.estrelles} aria-label={t('estrelles', { n: r.estrelles })}>
                {'★'.repeat(r.estrelles)}
              </p>
              <blockquote lang="es">«{r.text}»</blockquote>
              <p className={styles.autor}>
                {r.autor} · {r.quan}
              </p>
            </Revela>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Preguntes() {
  const t = await getTranslations('faq');
  const claus = ['talla', 'pedals', 'fianca', 'cancel', 'hotel', 'taller'] as const;
  const dades = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: claus.map((c) => ({
      '@type': 'Question',
      name: t(`items.${c}.p`),
      acceptedAnswer: { '@type': 'Answer', text: t(`items.${c}.r`).replace(/\*/g, '') },
    })),
  };
  return (
    <section className={`seccio ${styles.preguntes}`} aria-labelledby="faq-titol">
      <div className={`contenidor ${styles.preguntesGraella}`}>
        <h2 id="faq-titol" className={styles.titolMig}>
          {t('titol')}
        </h2>
        <div>
          {claus.map((c) => (
            <details key={c} className={styles.pregunta}>
              <summary>
                {t(`items.${c}.p`)}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{t(`items.${c}.r`)}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dades) }} />
    </section>
  );
}

const TELEFON = '+34972662951';
/** Número del botó de WhatsApp de la web d'ara. Quan hi hagi l'agent de Nertel, serà el seu. */
const WHATSAPP = '34658909455';

export async function Visita() {
  const t = await getTranslations('visita');
  const negoci = {
    '@context': 'https://schema.org',
    '@type': 'BikeStore',
    name: 'Tecnibike Costa Brava',
    telephone: TELEFON,
    email: 'info@tecnibike.es',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Carrer de l'Empordà, 29",
      postalCode: '17252',
      addressLocality: 'Sant Antoni de Calonge',
      addressRegion: 'Girona',
      addressCountry: 'ES',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 41.85028, longitude: 3.10828 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '13:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '16:00', closes: '20:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.3, reviewCount: 123 },
  };
  return (
    <section id="visita" className={`seccio ${styles.visita}`} aria-labelledby="visita-titol">
      <div className={`contenidor ${styles.visitaGraella}`}>
        <div>
          <p className={`situacio ${styles.situacioClara}`}>{t('situacio')}</p>
          <h2 id="visita-titol" className="titol-seccio">
            {t('titol')}
          </h2>
          <address className={styles.adreca}>
            {t('adreca')}
            <br />
            {t('poble')}
          </address>
          <div className={styles.contacte}>
            <a className="boto boto--fosc-sobre-fosc" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
              {t('whatsapp')} <span className="fletxa">→</span>
            </a>
            <a className={styles.enllacClar} href={`tel:${TELEFON}`}>
              {t('telefon')} · 972 66 29 51
            </a>
            <a className={styles.enllacClar} href="mailto:info@tecnibike.es">
              info@tecnibike.es
            </a>
          </div>
        </div>
        <div className={styles.horari}>
          <h3>{t('horari')}</h3>
          <dl>
            <div>
              <dt>{t('dies')}</dt>
              <dd>{t('hores')}</dd>
            </div>
            <div>
              <dt>{t('diumenge')}</dt>
              <dd>—</dd>
            </div>
          </dl>
          <a
            className="boto boto--clar"
            href="https://www.google.com/maps/place/Tecnibike/@41.85028,3.10828,17z"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('mapa')} <span className="fletxa">↗</span>
          </a>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(negoci) }} />
    </section>
  );
}

export async function Peu() {
  const t = await getTranslations('peu');
  const tm = await getTranslations('mostra');
  return (
    <footer className={styles.peu}>
      <div className={`contenidor ${styles.peuGraella}`}>
        <p className={styles.peuMarca}>TCNBK</p>
        <p className={styles.lema}>{t('lema')}</p>
        <p className={styles.notaMostra}>{tm('nota')}</p>
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
          <li>{t('nertel')}</li>
        </ul>
      </div>
    </footer>
  );
}
