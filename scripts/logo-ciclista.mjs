// Logo del ciclista de Tecnibike (el de l'Instagram, taronja sobre blanc) passat al blau del logo TCNBK.
//
//   node scripts/logo-ciclista.mjs <logo-original.png>
//
// L'original és petit (~165 px): se'n treu la forma pel color (el taronja no té blau, el fons blanc sí),
// s'amplia, es difumina i es torna a tallar, que deixa unes vores netes a qualsevol mida. Escriu:
//   public/img/logo/ciclista.png       el ciclista blau, fons transparent (logo de la barra)
//   src/app/icon.png, favicon.ico      la icona de les pestanyes, blava i transparent
//   src/app/apple-icon.png             la icona d'iPhone, sobre blanc
//   recursos/whatsapp-perfil.png       la foto del perfil de WhatsApp: ciclista i «TECNIBIKE» a sota,
//                                      com a la barra (fora del repositori; no és de la web)
// Quan el client doni el logo en vectors, se substitueix l'original i es torna a executar.

import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));

const BLAU = { r: 0x66, g: 0x89, b: 0xc6 }; // --blau de globals.css: el de les lletres TCNBK
const ESCALA = 8;

const entrada = process.argv[2];
if (!entrada) {
  console.error('Ús: node scripts/logo-ciclista.mjs <logo-original.png>');
  process.exit(1);
}

// 1. La forma: com més lluny del blanc en el canal blau, més ciclista.
const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const mascara = Buffer.alloc(info.width * info.height);
for (let i = 0; i < mascara.length; i++) {
  const b = data[i * 3 + 2];
  mascara[i] = Math.max(0, Math.min(255, Math.round(((235 - b) / 235) * 255)));
}

// 2. Ampliada, difuminada i tallada a la meitat: vores llises. Després, un punt d'antialiàsing.
const ample = info.width * ESCALA;
const alt = info.height * ESCALA;
const netaRaw = await sharp(mascara, { raw: { width: info.width, height: info.height, channels: 1 } })
  .resize(ample, alt, { kernel: 'lanczos3' })
  .blur(ESCALA * 0.75)
  .threshold(128)
  .blur(1.2)
  .extractChannel(0) // sharp torna sRGB després del llindar: ens en quedem un canal
  .raw()
  .toBuffer();

// 3. El ciclista blau sobre transparent, retallat al seu contingut.
const rgba = Buffer.alloc(ample * alt * 4);
for (let i = 0; i < ample * alt; i++) {
  rgba[i * 4] = BLAU.r;
  rgba[i * 4 + 1] = BLAU.g;
  rgba[i * 4 + 2] = BLAU.b;
  rgba[i * 4 + 3] = netaRaw[i];
}
const ciclista = await sharp(rgba, { raw: { width: ample, height: alt, channels: 4 } }).trim({ threshold: 0 }).png().toBuffer();
const { width: cw, height: ch } = await sharp(ciclista).metadata();

const escriu = async (cami, buffer) => {
  await mkdir(dirname(cami), { recursive: true });
  await writeFile(cami, buffer);
  console.log('escrit', cami);
};

/** El ciclista centrat en un quadrat de `mida`, ocupant-ne `ocupa` (0–1), sobre `fons`. */
const quadrat = async (mida, ocupa, fons = { r: 0, g: 0, b: 0, alpha: 0 }) => {
  const costat = Math.round(mida * ocupa);
  const peca = await sharp(ciclista).resize(costat, costat, { fit: 'inside' }).toBuffer();
  return sharp({ create: { width: mida, height: mida, channels: 4, background: fons } })
    .composite([{ input: peca, gravity: 'centre' }])
    .png()
    .toBuffer();
};

await escriu('public/img/logo/ciclista.png', await sharp(ciclista).resize({ height: 240 }).png().toBuffer());
await escriu('src/app/icon.png', await quadrat(512, 0.94));
await escriu('src/app/apple-icon.png', await quadrat(180, 0.72, { r: 255, g: 255, b: 255, alpha: 1 }));

// favicon.ico amb imatges PNG a dins (16, 32 i 48 px), el format que accepten tots els navegadors.
const mides = [16, 32, 48];
const pngs = await Promise.all(mides.map((m) => quadrat(m, 1)));
const cap = Buffer.alloc(6 + 16 * mides.length);
cap.writeUInt16LE(0, 0);
cap.writeUInt16LE(1, 2);
cap.writeUInt16LE(mides.length, 4);
let desplacament = cap.length;
mides.forEach((m, i) => {
  const e = 6 + 16 * i;
  cap.writeUInt8(m, e);
  cap.writeUInt8(m, e + 1);
  cap.writeUInt16LE(1, e + 4);
  cap.writeUInt16LE(32, e + 6);
  cap.writeUInt32LE(pngs[i].length, e + 8);
  cap.writeUInt32LE(desplacament, e + 12);
  desplacament += pngs[i].length;
});
await escriu('src/app/favicon.ico', Buffer.concat([cap, ...pngs]));

// 4. Perfil de WhatsApp (640 px, es retalla en rodó): ciclista i «TECNIBIKE» a sota, com a la barra,
// amb l'Archivo de la web. La tipografia es baixa de Google Fonts (llicència OFL) només per pintar-la.
const css = await fetch('https://fonts.googleapis.com/css2?family=Archivo:wght@500', { headers: { 'User-Agent': 'Mozilla/4.0' } }).then((r) => r.text());
const urlFont = css.match(/url\((https:[^)]+)\)/)?.[1];
if (!urlFont) throw new Error("No s'ha trobat la tipografia Archivo");
const font = await fetch(urlFont).then((r) => r.arrayBuffer());
const { ImageResponse } = await import('next/og.js');
const { createElement: h } = await import('react');
const MIDA = 640;
const ampleCiclista = 330;
const altCiclista = Math.round((ampleCiclista * ch) / cw);
const imatge = new ImageResponse(
  h(
    'div',
    { style: { width: MIDA, height: MIDA, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' } },
    h('img', { src: `data:image/png;base64,${ciclista.toString('base64')}`, width: ampleCiclista, height: altCiclista }),
    h(
      'div',
      { style: { marginTop: 22, marginRight: -26, fontFamily: 'Archivo', fontWeight: 500, fontSize: 42, letterSpacing: 26, color: `rgb(${BLAU.r},${BLAU.g},${BLAU.b})` } },
      'TECNIBIKE',
    ),
  ),
  { width: MIDA, height: MIDA, fonts: [{ name: 'Archivo', data: font, weight: 500, style: 'normal' }] },
);
await escriu(join('recursos', 'whatsapp-perfil.png'), Buffer.from(await imatge.arrayBuffer()));
