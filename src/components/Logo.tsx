import styles from './Logo.module.css';

/**
 * Logo TCNBK compost amb la tipografia del web. Provisional: s'ha de substituir pel logo
 * redibuixat en SVG i comparat amb el PNG original (recursos/web-antiga/logo-tcnbk.png).
 */
export function Logo({ clar = false }: { clar?: boolean }) {
  return (
    <span className={`${styles.logo} ${clar ? styles.clar : ''}`} aria-hidden="true">
      <span className={styles.sigles}>TCNBK</span>
      <span className={styles.nom}>Tecnibike</span>
    </span>
  );
}
