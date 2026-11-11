// Les fotos del catàleg de la plataforma poden venir de qualsevol adreça (la botiga n'hi pot posar
// una d'externa). L'optimitzador de Next només les accepta de dominis autoritzats a next.config:
// les pròpies i les del magatzem públic de la plataforma. La resta es mostren tal qual
// (`unoptimized`), en lloc d'obrir l'optimitzador a qualsevol domini.

const MAGATZEM_PUBLIC = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//;

export function optimitzable(src: string): boolean {
  return (src.startsWith('/') && !src.startsWith('//')) || MAGATZEM_PUBLIC.test(src);
}
