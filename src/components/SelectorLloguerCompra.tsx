import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './SelectorLloguerCompra.module.css';

// Selector de dues opcions a dalt de la flota i de les bicis en venda: «Lloguer | Compra». Va on abans
// hi havia l'etiqueta de la secció («— Lloguer»), com va demanar l'Enric el 16-11-2026.
//
// - A l'inici (`onTria`), canvia allà mateix el que ensenya la graella, sense canviar de pàgina.
// - A la pàgina de les bicis en venda, són enllaços: «Lloguer» torna a la flota de l'inici.

type Opcio = 'lloguer' | 'compra';

type Props = {
  /** La secció on som, o la que ensenya la graella. */
  actiu: Opcio;
  /** Sobre fons fosc (la capçalera de les bicis en venda) o clar (la flota de l'inici). */
  tema?: 'clar' | 'fosc';
  /** Si hi és, el selector canvia a la mateixa pàgina en lloc de portar a l'altra. */
  onTria?: (opcio: Opcio) => void;
  /** L'element que canvia el selector (la graella), per als lectors de pantalla. */
  controla?: string;
};

const ENLLACOS = { lloguer: '/#flota', compra: '/venda' } as const;

export function SelectorLloguerCompra({ actiu, tema = 'clar', onTria, controla }: Props) {
  const t = useTranslations('selector');
  return (
    <div className={styles.selector} data-tema={tema} role="group" aria-label={t('etiqueta')}>
      {(['lloguer', 'compra'] as const).map((opcio) =>
        onTria ? (
          <button
            key={opcio}
            type="button"
            className={styles.opcio}
            aria-pressed={opcio === actiu}
            aria-controls={controla}
            onClick={() => onTria(opcio)}
          >
            {t(opcio)}
          </button>
        ) : (
          <Link key={opcio} href={ENLLACOS[opcio]} className={styles.opcio} aria-current={opcio === actiu ? 'page' : undefined}>
            {t(opcio)}
          </Link>
        ),
      )}
    </div>
  );
}
