'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * L'enllaç a la política de privacitat dins de la casella «He llegit i accepto…» dels formularis
 * (`t.rich('privacitat', { enllac: enllacPrivacitat })`). S'obre en una pestanya nova perquè no es
 * perdi el que s'ha omplert.
 */
export function enllacPrivacitat(text: ReactNode) {
  return (
    <Link href="/privacitat" target="_blank" rel="noopener">
      {text}
    </Link>
  );
}
