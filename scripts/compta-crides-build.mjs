// Fa un `next build` contra una plataforma falsa en aquesta màquina i compta quantes vegades la
// compilació demana el catàleg, els ajustos i l'horari del lloguer.
//
//   node scripts/compta-crides-build.mjs [--sense-cau] [--bicis 12] [--retard 400] [--webpack]
//
// No parla mai amb la plataforma de veritat: les variables PLATAFORMA_* de la compilació apunten
// al servidor fals (127.0.0.1) i manen sobre qualsevol .env.local. El retard imita el temps de
// resposta de la plataforma, que és quan les crides simultànies s'encavalquen.
//
// El 16-11-2026, dues previsualitzacions van fer 593 crides al catàleg de producció en pocs minuts.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const arg = (nom, perDefecte) => {
  const i = process.argv.indexOf(`--${nom}`);
  return i === -1 ? perDefecte : Number(process.argv[i + 1]);
};
const BICIS = arg('bicis', 12);
const RETARD_MS = arg('retard', 400);

const dia = (fromUnits, priceCents) => ({ seasonId: null, unit: 'day', fromUnits, priceCents });
const uuid = (n, prefix) => `${prefix}${String(n).padStart(12, '0')}`;

const cataleg = {
  timeZone: 'Europe/Madrid',
  currency: 'EUR',
  models: Array.from({ length: BICIS }, (_, n) => ({
    id: uuid(n + 1, '11111111-1111-4111-8111-'),
    name: `Bici ${n + 1}`,
    description: null,
    imageUrl: null,
    attributes: {},
    variants: ['S', 'M', 'L'],
    rates: [dia(1, 2800), dia(2, 2520), dia(7, 2100)],
    turnaroundMinutes: 30,
  })),
  optionGroups: [{ id: 'a0000000-0000-4000-8000-000000000001', name: 'Pedals', required: true }],
  options: [
    {
      id: 'b0000000-0000-4000-8000-000000000001', name: 'Pedals plans', description: null, imageUrl: null,
      groupId: 'a0000000-0000-4000-8000-000000000001', priceCents: 0, priceUnit: 'booking', limited: false, variants: [],
    },
  ],
  seasons: [],
  shopItems: [],
};
const hores = {
  timeZone: 'Europe/Madrid',
  slotMinutes: 30,
  weekly: [1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, opensAt: '09:00', closesAt: '20:00' })),
  periods: [],
  exceptions: [],
};
const ajustos = {
  timeZone: 'Europe/Madrid', slotMinutes: 30, maxDays: 30, minNoticeMinutes: 60, turnaroundMinutes: 30, halfDayMinutes: 240,
  holdMinutes: 15, paymentEnabled: false, participantsEnabled: false, shopItemsEnabled: false,
};
const RESPOSTES = {
  '/api/public/rental/catalog': cataleg,
  '/api/public/rental/hours': hores,
  '/api/public/rental/settings': ajustos,
};

const crides = new Map();
let simultanies = 0;
let maxSimultanies = 0;

const servidor = createServer((peticio, resposta) => {
  const ruta = new URL(peticio.url, 'http://local').pathname;
  crides.set(`${peticio.method} ${ruta}`, (crides.get(`${peticio.method} ${ruta}`) ?? 0) + 1);
  simultanies++;
  maxSimultanies = Math.max(maxSimultanies, simultanies);
  setTimeout(() => {
    simultanies--;
    const cos = RESPOSTES[ruta];
    resposta.writeHead(cos ? 200 : 404, { 'content-type': 'application/json' });
    resposta.end(JSON.stringify(cos ?? { error: { code: 'not_found', message: 'no hi és' } }));
  }, RETARD_MS);
});

await new Promise((fet) => servidor.listen(0, '127.0.0.1', fet));
const { port } = servidor.address();
const url = `http://127.0.0.1:${port}`;
console.log(`Plataforma falsa a ${url} (${BICIS} bicis, ${RETARD_MS} ms per resposta)`);

// Amb --sense-cau, la memòria de `fetch` de Next no torna mai res, com la de Vercel durant la
// compilació: Vercel hi posa el seu gestor (`modifyConfig`), i els seus registres del 16-11-2026
// diuen que cada pàgina va tornar a la plataforma. Es fa amb el gestor global que Next busca
// (`Symbol.for('@next/cache-handlers')`), carregat a cada procés de la compilació.
const senseCau = process.argv.includes('--sense-cau');
let nodeOptions = process.env.NODE_OPTIONS ?? '';
if (senseCau) {
  const gestor = join(tmpdir(), 'tecnibike-gestor-sense-cau.mjs');
  writeFileSync(
    gestor,
    `globalThis[Symbol.for('@next/cache-handlers')] = { FetchCache: class { async get() { return null } async set() {} async revalidateTag() {} resetRequestCache() {} } };\n`,
  );
  nodeOptions = `${nodeOptions} --import=${pathToFileURL(gestor).href}`.trim();
}
console.log(senseCau ? 'Memòria de fetch: buida, com a Vercel' : 'Memòria de fetch: la de Next en local (fitxers)');

const next = createRequire(import.meta.url).resolve('next/dist/bin/next');
const codi = await new Promise((fet) => {
  // Per defecte, Turbopack, com a Vercel; amb --webpack, com `pnpm build:local`.
  const build = spawn(process.execPath, [next, 'build', ...(process.argv.includes('--webpack') ? ['--webpack'] : [])], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLATAFORMA_API_URL: url,
      PLATAFORMA_API_CLAU: 'clau-falsa',
      PLATAFORMA_CITES_CLAU: 'clau-falsa',
      PLATAFORMA_TALLER_SERVEI: 'taller',
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_OPTIONS: nodeOptions,
    },
  });
  build.on('exit', fet);
});
servidor.close();

console.log('\nCrides de la compilació a la plataforma:');
for (const [ruta, n] of [...crides].sort()) console.log(`  ${String(n).padStart(5)}  ${ruta}`);
console.log(`  Com a molt ${maxSimultanies} alhora.`);
process.exit(codi ?? 1);
