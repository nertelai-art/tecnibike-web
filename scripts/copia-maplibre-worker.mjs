// MapLibre GL 6 crea el seu worker amb una adreça relativa al paquet que webpack no resol
// («Worker failed to load»). Copiem el worker a public/vendor amb la versió al nom i el mapa
// l'indica amb setWorkerUrl. S'executa abans de `dev` i de `build`.

import { copyFile, mkdir, readFile } from 'node:fs/promises';

const arrel = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('node_modules/maplibre-gl/package.json', arrel), 'utf8'));
await mkdir(new URL('public/vendor/', arrel), { recursive: true });
await copyFile(new URL('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', arrel), new URL(`public/vendor/maplibre-gl-worker-${version}.mjs`, arrel));
console.log(`maplibre-gl-worker-${version}.mjs copiat a public/vendor`);
