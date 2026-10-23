import {
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  QuadraticBezierCurve3,
  Quaternion,
  RingGeometry,
  Shape,
  TorusGeometry,
  TubeGeometry,
  BoxGeometry,
  Vector2,
  Vector3,
  DoubleSide,
  type BufferGeometry,
  type Material,
} from 'three';
import type { Peca } from '@/lib/plataforma/esquema';

// Bici de carretera feta per codi, en metres i a escala real (roda de 700c). Cada peça de
// l'anatomia és un grup amb els seus materials propis, perquè l'escena la pugui moure i
// ressaltar sola. Eix x: endavant; y: amunt; z: cap al costat de la transmissió (el que mira
// la càmera).

export type PecaBici = {
  peca: Peca;
  grup: Group;
  /** On va quan la bici s'esbotza, relatiu a la posició muntada. */
  desplacament: Vector3;
  /** Centre aproximat de la peça muntada, per apuntar-hi la càmera. */
  centre: Vector3;
  materials: { material: MeshStandardMaterial; base: Color }[];
};

const BLAU_TCNBK = '#5b7fc0';
const TARONJA = '#f85a00';

const R = new Vector3(-0.5, 0.335, 0); // eix posterior
const F = new Vector3(0.49, 0.335, 0); // eix davanter
const BB = new Vector3(-0.09, 0.265, 0); // caixa de pedalier
const SEIENT = new Vector3(-0.225, 0.76, 0); // dalt del tub de seient
const DIR_DALT = new Vector3(0.335, 0.79, 0);
const DIR_BAIX = new Vector3(0.375, 0.655, 0);

const Y = new Vector3(0, 1, 0);
const tmpDir = new Vector3();
const tmpQuat = new Quaternion();

const v = (x: number, y: number, z = 0) => new Vector3(x, y, z);

/** Cilindre que va de `a` a `b`. */
function tub(a: Vector3, b: Vector3, radi: number, material: Material, radiFinal = radi) {
  tmpDir.subVectors(b, a);
  const llarg = tmpDir.length();
  const mesh = new Mesh(new CylinderGeometry(radiFinal, radi, llarg, 20), material);
  mesh.position.copy(a).addScaledVector(tmpDir, 0.5);
  mesh.quaternion.copy(tmpQuat.setFromUnitVectors(Y, tmpDir.normalize()));
  return mesh;
}

function tubCorbat(punts: Vector3[], radi: number, material: Material) {
  const corba = punts.length === 3 ? new QuadraticBezierCurve3(punts[0], punts[1], punts[2]) : new CatmullRomCurve3(punts);
  return new Mesh(new TubeGeometry(corba, 48, radi, 14, false), material);
}

/** Geometria de revolució al voltant de l'eix z (rodes, plats, bujes). */
function revolucio(perfil: [number, number][], segments = 96): BufferGeometry {
  const geometria = new LatheGeometry(perfil.map(([r, h]) => new Vector2(r, h)), segments);
  geometria.rotateX(Math.PI / 2);
  return geometria;
}

function materials() {
  const llista: { material: MeshStandardMaterial; base: Color }[] = [];
  const nou = <T extends MeshStandardMaterial>(material: T) => {
    llista.push({ material, base: material.color.clone() });
    return material;
  };
  return {
    llista,
    pintura: () => nou(new MeshPhysicalMaterial({ color: BLAU_TCNBK, roughness: 0.38, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.12 })),
    carboni: () => nou(new MeshPhysicalMaterial({ color: '#1b1d21', roughness: 0.42, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.3 })),
    goma: () => nou(new MeshStandardMaterial({ color: '#202124', roughness: 0.92 })),
    alumini: () => nou(new MeshStandardMaterial({ color: '#c3c8ce', roughness: 0.3, metalness: 0.45 })),
    acer: () => nou(new MeshStandardMaterial({ color: '#7d838b', roughness: 0.35, metalness: 0.5 })),
    taronja: () => nou(new MeshPhysicalMaterial({ color: TARONJA, roughness: 0.3, clearcoat: 0.8 })),
    cinta: () => nou(new MeshStandardMaterial({ color: '#26282c', roughness: 0.85 })),
  };
}

function crear(peca: Peca, desplacament: Vector3, centre: Vector3, construir: (grup: Group, m: ReturnType<typeof materials>) => void): PecaBici {
  const grup = new Group();
  grup.name = peca;
  const m = materials();
  construir(grup, m);
  grup.traverse((objecte) => {
    if (objecte instanceof Mesh) objecte.castShadow = true;
  });
  return { peca, grup, desplacament, centre, materials: m.llista };
}

// ── Peces ────────────────────────────────────────────────────────────────────────────────────

function quadre() {
  return crear('quadre', v(0, 0, 0), v(0.05, 0.55), (g, m) => {
    const pintura = m.pintura();
    const darrere = SEIENT.clone().add(v(0.005, -0.03));
    g.add(
      tub(BB, SEIENT, 0.017, pintura, 0.016), // tub de seient
      tub(darrere.clone().add(v(0.01, -0.005)), DIR_DALT.clone().add(v(0, -0.015)), 0.016, pintura, 0.018), // tub superior
      tub(BB, DIR_BAIX.clone().add(v(-0.005, 0.01)), 0.025, pintura, 0.021), // tub inferior
      tub(DIR_BAIX.clone().add(v(0.006, -0.02)), DIR_DALT.clone().add(v(-0.002, 0.01)), 0.024, pintura, 0.021), // tub de direcció
    );
    // Beines i tirants, a banda i banda.
    for (const costat of [-1, 1]) {
      g.add(
        tub(BB.clone().setZ(0.035 * costat), R.clone().setZ(0.066 * costat), 0.012, pintura, 0.009),
        tub(darrere.clone().setZ(0.022 * costat), R.clone().add(v(0.008, 0.012)).setZ(0.066 * costat), 0.009, pintura, 0.007),
      );
    }
    const caixa = new Mesh(new CylinderGeometry(0.024, 0.024, 0.086, 24), pintura);
    caixa.rotation.x = Math.PI / 2;
    caixa.position.copy(BB);
    g.add(caixa);

    // El bidó, del taronja de la marca.
    const perfilBido: [number, number][] = [[0, -0.11], [0.034, -0.108], [0.036, -0.09], [0.036, 0.07], [0.03, 0.09], [0.012, 0.1], [0.012, 0.115], [0, 0.118]];
    // Revolució sobre y (no sobre z com les rodes): després s'alinea amb el tub inferior.
    const bido = new Mesh(new LatheGeometry(perfilBido.map(([r, h]) => new Vector2(r, h)), 40), m.taronja());
    const inici = BB.clone().lerp(DIR_BAIX, 0.42);
    tmpDir.subVectors(DIR_BAIX, BB).normalize();
    bido.quaternion.setFromUnitVectors(Y, tmpDir);
    bido.position.copy(inici).add(v(-0.015, 0.05));
    g.add(bido);
  });
}

function forquilla(m: ReturnType<typeof materials>, g: Group) {
  const carboni = m.carboni();
  const corona = DIR_BAIX.clone().add(v(0.008, -0.03));
  for (const costat of [-1, 1]) {
    g.add(tubCorbat([corona.clone().setZ(0.028 * costat), v(0.455, 0.47, 0.05 * costat), F.clone().setZ(0.052 * costat)], 0.012, carboni));
  }
  const pont = new Mesh(new BoxGeometry(0.045, 0.03, 0.09), carboni);
  pont.position.copy(corona);
  g.add(pont);
}

function roda(centre: Vector3, m: ReturnType<typeof materials>) {
  const g = new Group();
  g.position.copy(centre);
  const pneumatic = new Mesh(new TorusGeometry(0.322, 0.0135, 18, 120), m.goma());
  const llanta = new Mesh(
    revolucio([[0.272, 0], [0.285, -0.0095], [0.309, -0.0105], [0.309, 0.0105], [0.285, 0.0095], [0.272, 0]], 120),
    m.carboni(),
  );
  const boixa = new Mesh(new CylinderGeometry(0.016, 0.016, 0.1, 20), m.alumini());
  boixa.rotation.x = Math.PI / 2;
  g.add(pneumatic, llanta, boixa);

  // 24 radis en un sol draw call.
  const radis = new InstancedMesh(new CylinderGeometry(0.0011, 0.0011, 1, 6), m.acer(), 24);
  const dummy = new Object3D();
  for (let i = 0; i < 24; i++) {
    const costat = i % 2 === 0 ? 1 : -1;
    const angleBoixa = (i / 24) * Math.PI * 2;
    const angleLlanta = angleBoixa + costat * 0.32;
    const a = v(Math.cos(angleBoixa) * 0.024, Math.sin(angleBoixa) * 0.024, 0.034 * costat);
    const b = v(Math.cos(angleLlanta) * 0.274, Math.sin(angleLlanta) * 0.274, 0);
    tmpDir.subVectors(b, a);
    dummy.position.copy(a).addScaledVector(tmpDir, 0.5);
    dummy.scale.set(1, tmpDir.length(), 1);
    dummy.quaternion.setFromUnitVectors(Y, tmpDir.normalize());
    dummy.updateMatrix();
    radis.setMatrixAt(i, dummy.matrix);
  }
  g.add(radis);
  return g;
}

function rodes() {
  return crear('rodes', v(0, -0.02, 0.32), v(0, 0.335), (g, m) => {
    g.add(roda(R, m), roda(F, m));
    // La forquilla viatja amb les rodes: és la peça que les aguanta.
    forquilla(m, g);
  });
}

/** Plat de 50 dents amb quatre braços. */
function plat(material: Material) {
  const dents = 50;
  const exterior = 0.107;
  const interior = 0.1;
  const forma = new Shape();
  for (let i = 0; i <= dents * 2; i++) {
    const angle = (i / (dents * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? exterior : interior;
    if (i === 0) forma.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else forma.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  const forat = new Shape();
  forat.absarc(0, 0, 0.088, 0, Math.PI * 2, true);
  forma.holes.push(forat);
  const geometria = new ExtrudeGeometry(forma, { depth: 0.004, bevelEnabled: false, curveSegments: 4 });
  const grup = new Group();
  grup.add(new Mesh(geometria, material));
  for (let i = 0; i < 4; i++) {
    const brac = new Mesh(new BoxGeometry(0.092, 0.016, 0.006), material);
    brac.rotation.z = (i / 4) * Math.PI * 2 + 0.4;
    brac.position.set(Math.cos(brac.rotation.z) * 0.046, Math.sin(brac.rotation.z) * 0.046, 0.002);
    grup.add(brac);
  }
  return grup;
}

function transmissio() {
  return crear('transmissio', v(0.02, -0.12, 0.42), v(-0.28, 0.27), (g, m) => {
    const alumini = m.alumini();
    const carboni = m.carboni();
    const acer = m.acer();
    const zCadena = 0.062;

    const platGrup = plat(carboni);
    platGrup.position.copy(BB).setZ(zCadena - 0.002);
    g.add(platGrup);

    // Bieles i pedals (la biela del costat de la transmissió apunta endavant i avall).
    const angle = -0.9;
    const llargBiela = 0.172;
    for (const costat of [1, -1]) {
      const sentit = costat === 1 ? 1 : -1;
      const punta = v(BB.x + Math.cos(angle) * llargBiela * sentit, BB.y + Math.sin(angle) * llargBiela * sentit, 0.088 * costat);
      g.add(tub(BB.clone().setZ(0.088 * costat), punta, 0.011, carboni, 0.008));
      const pedal = new Mesh(new BoxGeometry(0.085, 0.014, 0.07), carboni);
      pedal.position.copy(punta).setZ(punta.z + 0.045 * costat);
      g.add(pedal);
    }
    const eix = new Mesh(new CylinderGeometry(0.012, 0.012, 0.18, 16), alumini);
    eix.rotation.x = Math.PI / 2;
    eix.position.copy(BB);
    g.add(eix);

    // Cassette d'onze pinyons.
    for (let i = 0; i < 11; i++) {
      const pinyo = new Mesh(new CylinderGeometry(0.048 - i * 0.0031, 0.048 - i * 0.0031, 0.0022, 40), acer);
      pinyo.rotation.x = Math.PI / 2;
      pinyo.position.copy(R).setZ(0.026 + i * 0.0038);
      g.add(pinyo);
    }

    // Canvi posterior: dues politges i la gàbia.
    const politjaDalt = R.clone().add(v(0.012, -0.07)).setZ(zCadena);
    const politjaBaix = R.clone().add(v(0.03, -0.125)).setZ(zCadena);
    for (const centre of [politjaDalt, politjaBaix]) {
      const politja = new Mesh(new CylinderGeometry(0.012, 0.012, 0.006, 20), carboni);
      politja.rotation.x = Math.PI / 2;
      politja.position.copy(centre);
      g.add(politja);
    }
    const gabia = tub(politjaDalt.clone().setZ(zCadena + 0.006), politjaBaix.clone().setZ(zCadena + 0.006), 0.009, alumini);
    const cos = tub(R.clone().add(v(-0.01, -0.01)).setZ(zCadena + 0.01), politjaDalt.clone().setZ(zCadena + 0.01), 0.012, carboni);
    g.add(gabia, cos);

    // Cadena: un llaç tancat que passa per dalt del plat, el pinyó i les politges.
    const rPlat = 0.104;
    const rPinyo = 0.036;
    const punts: Vector3[] = [];
    const arc = (centre: Vector3, radi: number, de: number, a: number, passos: number) => {
      for (let i = 0; i <= passos; i++) {
        const t = de + ((a - de) * i) / passos;
        punts.push(v(centre.x + Math.cos(t) * radi, centre.y + Math.sin(t) * radi, zCadena));
      }
    };
    arc(BB, rPlat, Math.PI / 2, -Math.PI / 2, 14); // davant del plat, de dalt a baix
    arc(politjaBaix, 0.014, -Math.PI / 2, -Math.PI * 1.15, 4); // volta per sota la politja de baix
    arc(politjaDalt, 0.014, Math.PI * -0.1, Math.PI * 0.35, 3); // politja de dalt
    arc(R, rPinyo, Math.PI * 1.25, Math.PI / 2, 8); // darrere del pinyó, fins a dalt
    const corba = new CatmullRomCurve3(punts, true, 'centripetal');
    const baules = Math.round(corba.getLength() / 0.0127);
    const cadena = new InstancedMesh(new BoxGeometry(0.0118, 0.0062, 0.0075), acer, baules);
    const dummy = new Object3D();
    for (let i = 0; i < baules; i++) {
      const t = i / baules;
      corba.getPointAt(t, dummy.position);
      corba.getTangentAt(t, tmpDir);
      dummy.rotation.set(0, 0, Math.atan2(tmpDir.y, tmpDir.x));
      dummy.updateMatrix();
      cadena.setMatrixAt(i, dummy.matrix);
    }
    g.add(cadena);
  });
}

function frens() {
  return crear('frens', v(0, 0.02, -0.42), v(0, 0.36), (g, m) => {
    const alumini = m.alumini();
    const carboni = m.carboni();
    for (const centre of [R, F]) {
      const disc = new Mesh(new RingGeometry(0.052, 0.08, 64, 1), alumini);
      disc.material.side = DoubleSide;
      disc.position.copy(centre).setZ(-0.058);
      g.add(disc);
      const aranya = new Mesh(new RingGeometry(0.02, 0.052, 6, 1), carboni);
      aranya.material.side = DoubleSide;
      aranya.position.copy(centre).setZ(-0.057);
      g.add(aranya);
    }
    const pinsaDarrere = new Mesh(new BoxGeometry(0.052, 0.03, 0.026), carboni);
    pinsaDarrere.position.copy(R).add(v(0.072, 0.012)).setZ(-0.058);
    pinsaDarrere.rotation.z = -0.15;
    const pinsaDavant = new Mesh(new BoxGeometry(0.052, 0.03, 0.026), carboni);
    pinsaDavant.position.copy(F).add(v(-0.058, 0.045)).setZ(-0.058);
    pinsaDavant.rotation.z = 0.7;
    g.add(pinsaDarrere, pinsaDavant);
  });
}

function direccio() {
  return crear('direccio', v(0.14, 0.22, 0), v(0.45, 0.8), (g, m) => {
    const carboni = m.carboni();
    const cinta = m.cinta();
    const espaiadors = DIR_DALT.clone().add(v(-0.006, 0.028));
    g.add(tub(DIR_DALT, espaiadors, 0.02, carboni));
    const centreManillar = v(0.44, 0.835);
    g.add(tub(espaiadors, centreManillar, 0.017, carboni, 0.015)); // potència
    g.add(tub(centreManillar.clone().setZ(-0.2), centreManillar.clone().setZ(0.2), 0.0125, carboni)); // part superior
    for (const costat of [-1, 1]) {
      const z = 0.205 * costat;
      g.add(
        tubCorbat(
          [v(0.44, 0.835, 0.2 * costat), v(0.5, 0.835, z), v(0.548, 0.8, z), v(0.548, 0.75, z), v(0.51, 0.715, z), v(0.455, 0.712, z)],
          0.012,
          cinta,
        ),
      );
      // Maneta de fre i canvi.
      const maneta = new Mesh(new BoxGeometry(0.05, 0.028, 0.028), carboni);
      maneta.position.set(0.535, 0.85, z);
      maneta.rotation.z = -0.3;
      const palanca = tub(v(0.55, 0.84, z), v(0.565, 0.76, z), 0.0055, carboni, 0.004);
      g.add(maneta, palanca);
    }
  });
}

function seient() {
  return crear('seient', v(-0.12, 0.24, 0), v(-0.27, 0.88), (g, m) => {
    const carboni = m.carboni();
    tmpDir.subVectors(SEIENT, BB).normalize();
    const dalt = SEIENT.clone().addScaledVector(tmpDir, 0.115);
    g.add(tub(SEIENT.clone().addScaledVector(tmpDir, -0.05), dalt, 0.0135, carboni));

    // Sella: perfil vist des de dalt, estret al morro i ample al darrere.
    const forma = new Shape();
    forma.moveTo(0.135, 0);
    forma.bezierCurveTo(0.135, 0.02, 0.06, 0.022, 0.0, 0.03);
    forma.bezierCurveTo(-0.07, 0.068, -0.13, 0.072, -0.14, 0.05);
    forma.lineTo(-0.14, -0.05);
    forma.bezierCurveTo(-0.13, -0.072, -0.07, -0.068, 0.0, -0.03);
    forma.bezierCurveTo(0.06, -0.022, 0.135, -0.02, 0.135, 0);
    const sella = new Mesh(
      new ExtrudeGeometry(forma, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 4, curveSegments: 16 }),
      m.cinta(),
    );
    sella.rotation.x = Math.PI / 2;
    sella.position.copy(dalt).add(v(-0.01, 0.03));
    g.add(sella);
  });
}

/** Totes les peces de la bici, en l'ordre en què es dibuixen. */
export function crearBici(): PecaBici[] {
  return [quadre(), rodes(), transmissio(), frens(), direccio(), seient()];
}

export const MIDES = {
  /** Amplada de la bici muntada, de pneumàtic a pneumàtic. */
  llarg: F.x - R.x + 0.67,
  alt: 0.95,
};
