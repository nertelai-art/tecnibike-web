import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './SelectorLloguerCompra.module.css';

// Selector de dues opcions a dalt de la flota de lloguer i de les bicis en venda: «Lloguer | Compra».
// Cada pàgina hi marca la seva; l'altra porta a l'altra secció. Va on abans hi havia l'etiqueta de
// la secció («— Lloguer»), com va demanar l'Enric el 16-11-2026.

type Props = {
  /** La secció on som. */
  actiu: 'lloguer' | 'compra';
  /** Sobre fons fosc (la capçalera de les bicis en venda) o clar (la flota de l'inici). */
  tema?: 'clar' | 'fosc';
};

const ENLLACOS = { lloguer: '/#flota', compra: '/venda' } as const;

export function SelectorLloguerCompra({ actiu, tema = 'clar' }: Props) {
  const t = useTranslations('selector');
  return (
    <nav className={styles.selector} data-tema={tema} aria-label={t('etiqueta')}>
      {(['lloguer', 'compra'] as const).map((opcio) => (
        <Link key={opcio} href={ENLLACOS[opcio]} className={styles.opcio} aria-current={opcio === actiu ? 'page' : undefined}>
          {t(opcio)}
        </Link>
      ))}
    </nav>
  );
}
