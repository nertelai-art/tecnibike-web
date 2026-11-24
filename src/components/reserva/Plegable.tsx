'use client';

// Secció plegable del formulari de reserva (els extres d'una bici, la nutrició): una capçalera amb el
// títol, un resum del que s'hi ha triat i una fletxa, i el contingut que s'obre i es tanca amb una
// transició d'alçada. Tancada, el contingut és `inert` però segueix al formulari, així que el que
// s'hi ha triat s'envia igual. Si cal mirar-hi (falta triar alguna cosa), s'obre sola.

import { useId, useState, type ReactNode } from 'react';
import styles from './Reserva.module.css';

type Props = {
  titol: ReactNode;
  /** El que s'hi ha triat, o quantes opcions hi ha. */
  resum?: ReactNode;
  /** Si comença oberta. */
  inicial?: boolean;
  /** Oberta per força (per exemple, si hi ha un error a dins). */
  forcada?: boolean;
  children: ReactNode;
};

export function Plegable({ titol, resum, inicial = false, forcada = false, children }: Props) {
  const id = useId();
  const [obert, setObert] = useState(inicial);
  const visible = obert || forcada;

  return (
    <div className={styles.plegable} data-obert={visible || undefined}>
      <button type="button" className={styles.plegableCap} aria-expanded={visible} aria-controls={id} onClick={() => setObert(!visible)}>
        <span className={styles.plegableTitol}>{titol}</span>
        {resum && <span className={styles.plegableResum}>{resum}</span>}
        <span className={styles.plegableFletxa} aria-hidden="true" />
      </button>
      <div id={id} className={styles.plegableCos} inert={!visible}>
        <div>{children}</div>
      </div>
    </div>
  );
}
