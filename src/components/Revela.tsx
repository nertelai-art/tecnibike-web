'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/** Entrada discreta quan l'element arriba a la pantalla. Sense JavaScript, es veu igualment. */
export function Revela({ children, as: Etiqueta = 'div', retard = 0, className = '' }: { children: ReactNode; as?: ElementType; retard?: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.dataset.visible = 'false';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Etiqueta ref={ref} className={`revela ${className}`} data-visible="true" style={{ '--retard': `${retard}ms` } as React.CSSProperties}>
      {children}
    </Etiqueta>
  );
}
