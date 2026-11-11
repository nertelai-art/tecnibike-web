// Porta el contracte de l'API de lloguer de la plataforma a la web. Els tipus de la crida remota en
// deriven: no s'escriuen a mà. S'executa quan la plataforma canvia el contracte (sempre additiu):
//
//   node scripts/sincronitza-contracte.mjs [camí a nertel-platform]
//
// Per defecte, el repositori de la plataforma al costat d'aquest (../nertel-platform).

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const arrel = fileURLToPath(new URL('../', import.meta.url));
const plataforma = resolve(process.argv[2] ?? resolve(arrel, '../nertel-platform'));
const origen = resolve(plataforma, 'src/core/schemas/rental-api.ts');
const desti = resolve(arrel, 'src/lib/plataforma/remota/contracte.ts');

// La plataforma fa servir Zod 3 i la web Zod 4. L'única diferència que toca el contracte: Zod 4 vol
// la clau de `z.record()` explícita. Vol dir el mateix (claus de text).
const ADAPTACIONS = [['z.record(z.unknown())', 'z.record(z.string(), z.unknown())']];

let codi = await readFile(origen, 'utf8');
for (const [zod3, zod4] of ADAPTACIONS) codi = codi.replaceAll(zod3, zod4);
const capcalera = `// GENERAT per scripts/sincronitza-contracte.mjs a partir de nertel-platform
// (src/core/schemas/rental-api.ts). No s'edita a mà: es torna a generar quan canvia el contracte.
// eslint-disable
`;
await writeFile(desti, capcalera + codi.replace(/\r\n/g, '\n'));
console.log(`Contracte copiat de ${origen}`);
