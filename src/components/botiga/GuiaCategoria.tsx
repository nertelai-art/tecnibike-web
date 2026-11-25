import { getLocale, getTranslations } from 'next-intl/server';
import { marquesDeCategoria } from '@/content/equipament';
import { FITXES_MARQUES } from '@/content/fitxes-marques';
import { GUIES_EQUIPAMENT } from '@/content/guies';
import { enllacMarca, slugMarca } from '@/content/marques';
import { Link } from '@/i18n/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { TELEFON, TELEFON_VISIBLE } from '@/lib/contacte';
import type { CategoriaEquipament } from '@/lib/plataforma/esquema';
import styles from './GuiaCategoria.module.css';

// La guia d'una categoria de la botiga (src/content/guies): per què importa, què hi fa la botiga, els
// tipus, com triar-ne, les marques i les preguntes freqüents (també com a FAQPage per a Google).

async function guiaDe(categoria: CategoriaEquipament) {
  const locale = await getLocale();
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations('guia');
  return { g: GUIES_EQUIPAMENT[categoria], l, t };
}

/** La introducció i, al costat, què hi fa Tecnibike. */
export async function GuiaIntro({ categoria }: { categoria: CategoriaEquipament }) {
  const { g, l, t } = await guiaDe(categoria);
  return (
    <section className={styles.intro} aria-labelledby={`guia-${categoria}-lema`}>
      <div>
        <h2 id={`guia-${categoria}-lema`} className={styles.lema}>
          {g.lema[l]}
        </h2>
        {g.intro[l].split(/\n\s*\n/).map((p) => (
          <p key={p.slice(0, 32)} className={styles.paragraf}>
            {p}
          </p>
        ))}
      </div>
      <aside className={styles.botiga}>
        <p className={styles.etiqueta}>{t('aTecnibike')}</p>
        <p>{g.aTecnibike[l]}</p>
        <a className="boto boto--blau" href={`tel:${TELEFON}`}>
          {t('trucar', { telefon: TELEFON_VISIBLE })}
        </a>
      </aside>
    </section>
  );
}

/** Els tipus de la categoria i com triar-ne. */
export async function GuiaTriar({ categoria }: { categoria: CategoriaEquipament }) {
  const { g, l, t } = await guiaDe(categoria);
  return (
    <>
      <section className={styles.bloc} aria-labelledby={`guia-${categoria}-tipus`}>
        <h2 id={`guia-${categoria}-tipus`} className={styles.titol}>
          {t('tipus')}
        </h2>
        <ul className={styles.tipus}>
          {g.tipus.map((tipus) => (
            <li key={tipus.nom.ca}>
              <h3>{tipus.nom[l]}</h3>
              <p>{tipus.text[l]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.bloc} aria-labelledby={`guia-${categoria}-consells`}>
        <h2 id={`guia-${categoria}-consells`} className={styles.titol}>
          {t('consells')}
        </h2>
        <ol className={styles.consells}>
          {g.consells.map((c) => (
            <li key={c.titol.ca}>
              <h3>{c.titol[l]}</h3>
              <p>{c.text[l]}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

/** Les marques de la categoria, amb el lema de la seva fitxa, que porten a la fitxa. */
export async function GuiaMarques({ categoria }: { categoria: CategoriaEquipament }) {
  const { l, t } = await guiaDe(categoria);
  const marques = marquesDeCategoria(categoria);
  return (
    <section className={styles.bloc} aria-labelledby={`guia-${categoria}-marques`}>
      <h2 id={`guia-${categoria}-marques`} className={styles.titol}>
        {t('marques')}
      </h2>
      <ul className={styles.marques}>
        {marques.map((m) => {
          const fitxa = FITXES_MARQUES.find((f) => f.slug === slugMarca(m));
          return (
            <li key={m.nom}>
              <Link href={enllacMarca(m)} className={styles.marca}>
                <span className={styles.logo}>
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- logos petits (SVG i WebP ja retallats)
                    <img src={`/img/marques/${m.logo}`} alt="" data-vector={m.logo.endsWith('.svg') || undefined} />
                  ) : null}
                </span>
                <strong>{m.nom}</strong>
                {fitxa && <span className={styles.marcaLema}>{fitxa.lema[l]}</span>}
                <span className={styles.veure}>
                  {t('veureFitxa')}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Preguntes freqüents, amb les dades estructurades FAQPage. Les fonts de la recerca són al contingut (no es publiquen). */
export async function GuiaPreguntes({ categoria }: { categoria: CategoriaEquipament }) {
  const { g, l, t } = await guiaDe(categoria);
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.preguntes.map((p) => ({
      '@type': 'Question',
      name: p.pregunta[l],
      acceptedAnswer: { '@type': 'Answer', text: p.resposta[l] },
    })),
  };
  return (
    <section className={styles.bloc} aria-labelledby={`guia-${categoria}-preguntes`}>
      <h2 id={`guia-${categoria}-preguntes`} className={styles.titol}>
        {t('preguntes')}
      </h2>
      <div className={styles.preguntes}>
        {g.preguntes.map((p) => (
          <details key={p.pregunta.ca}>
            <summary>{p.pregunta[l]}</summary>
            <p>{p.resposta[l]}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </section>
  );
}
