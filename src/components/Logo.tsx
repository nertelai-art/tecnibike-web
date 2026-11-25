import Image from 'next/image';
import styles from './Logo.module.css';

/**
 * Logo de la barra: el ciclista de Tecnibike (el de l'Instagram) en el blau del logo, amb el nom a
 * sota. El PNG el fa `node scripts/logo-ciclista.mjs <original>` a partir del logo que va donar el
 * client; quan n'hi hagi la versió en vectors, es torna a generar d'allà.
 */
export function Logo({ clar = false }: { clar?: boolean }) {
  return (
    <span className={`${styles.logo} ${clar ? styles.clar : ''}`} aria-hidden="true">
      <Image src="/img/logo/ciclista.png" alt="" width={40} height={30} className={styles.ciclista} priority />
      <span className={styles.nom}>Tecnibike</span>
    </span>
  );
}
