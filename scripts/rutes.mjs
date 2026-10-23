// Calcula les rutes de mostra amb BRouter (encaminador de bici sobre OpenStreetMap) i les desa a
// src/content/rutes.json: traçat simplificat, distància, desnivell i perfil d'alçada. S'executa a
// mà quan canvien els punts de pas (`node scripts/rutes.mjs`); la web no depèn de BRouter en temps
// d'execució.

import { writeFile } from 'node:fs/promises';

const SORTIDA = [3.1084, 41.8501]; // botiga, Carrer de l'Empordà 29

const RUTES = [
  {
    id: 'gavarres',
    perfil: 'fastbike',
    // Calonge → Romanyà de la Selva → Santa Cristina d'Aro → Castell d'Aro → Platja d'Aro
    punts: [SORTIDA, [3.0748, 41.8622], [2.9845, 41.8532], [2.9975, 41.814], [3.0311, 41.8151], [3.0688, 41.8185], SORTIDA],
  },
  {
    id: 'fitor',
    perfil: 'gravel',
    // Vall-llobrega → Santa Coloma de Fitor → Sant Cebrià dels Alls → Calonge
    punts: [SORTIDA, [3.1263, 41.8793], [3.0868, 41.906], [3.0147, 41.8871], [3.0748, 41.8622], SORTIDA],
  },
  {
    id: 'arques',
    perfil: 'mtb',
    // Calonge → Puig d'Arques (el cim de les Gavarres) → Sant Cebrià dels Alls → Calonge
    punts: [[3.0748, 41.8622], [2.9972, 41.8891], [3.0147, 41.8871], [3.0748, 41.8622]],
  },
];

/** Distància entre dos punts [lon, lat] en metres (haversine). */
function distancia([lon1, lat1], [lon2, lat2]) {
  const R = 6371000;
  const rad = (g) => (g * Math.PI) / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Es queda un punt cada `pas` metres: prou per dibuixar-la i molt menys pes. */
function simplifica(coordenades, pas) {
  const sortida = [coordenades[0]];
  let acumulat = 0;
  for (let i = 1; i < coordenades.length; i++) {
    acumulat += distancia(coordenades[i - 1], coordenades[i]);
    if (acumulat >= pas || i === coordenades.length - 1) {
      sortida.push(coordenades[i]);
      acumulat = 0;
    }
  }
  return sortida;
}

const resultat = [];
for (const ruta of RUTES) {
  const lonlats = ruta.punts.map((p) => p.join(',')).join('|');
  const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=${ruta.perfil}&alternativeidx=0&format=geojson`;
  const resposta = await fetch(url, { headers: { 'User-Agent': 'tecnibike-web (rutes de mostra)' } });
  if (!resposta.ok) throw new Error(`BRouter ${ruta.id}: ${resposta.status} ${await resposta.text()}`);
  const geo = await resposta.json();
  const traça = geo.features[0];
  const coordenades = traça.geometry.coordinates; // [lon, lat, alçada]
  const punts = simplifica(coordenades, 30).map(([lon, lat, alt]) => [+lon.toFixed(5), +lat.toFixed(5), Math.round(alt ?? 0)]);
  resultat.push({
    id: ruta.id,
    perfil: ruta.perfil,
    metres: Number(traça.properties['track-length']),
    desnivell: Number(traça.properties['filtered ascend']),
    punts,
  });
  console.log(`${ruta.id}: ${(Number(traça.properties['track-length']) / 1000).toFixed(1)} km, ${traça.properties['filtered ascend']} m+, ${punts.length} punts`);
  await new Promise((r) => setTimeout(r, 1500)); // respecte pel servidor públic
}

await writeFile(new URL('../src/content/rutes.json', import.meta.url), JSON.stringify(resultat) + '\n');
