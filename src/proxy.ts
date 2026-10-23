import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tot menys l'API, els fitxers interns de Next i els estàtics (qualsevol cosa amb punt).
  matcher: '/((?!api|_next|_vercel|.*\..*).*)',
};
