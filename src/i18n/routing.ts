import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ca', 'es', 'en', 'fr'],
  defaultLocale: 'ca',
});

export type Locale = (typeof routing.locales)[number];
