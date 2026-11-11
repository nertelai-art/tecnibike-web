import { araABotiga, sumaDies } from '../calendari';
import { diesEntre, validaFranja } from '../horari';
import { totalReserva } from '../preus';
import { articles, configuracioReserves, extres, flota, horari, productes, ressenyes, serveisTaller, valoracioGoogle } from './dades-prova';
import { frangesTaller, unitatsLliures } from './disponibilitat-prova';
import {
  article,
  biciLloguer,
  citaTaller,
  configuracioReserves as esquemaConfiguracio,
  extra,
  horariBotiga,
  participantsReserva,
  producte,
  reservaLloguer,
  ressenya,
  serveiTaller,
  valoracio,
  type BiciReserva,
  type CitaTaller,
  type Confirmacio,
  type ConfiguracioReserves,
  type Extra,
  type ParticipantsReserva,
  type ReservaLloguer,
} from './esquema';
import { ErrorReserva, type Disponibilitat, type Plataforma } from './interficie';

// Implementació de proves de la plataforma: les dades de dades-prova.ts i les reserves en memòria.
// És la que fa servir la web quan no té la clau de la plataforma (en local i a les proves), i la
// que encara dona el taller, la botiga i les ressenyes, que la plataforma no té a l'API.

type Ocupacio = { dies: readonly string[]; bicis: readonly BiciReserva[] };
type Retinguda = Ocupacio & { id: string; caducaA: number };

type Opcions = {
  generaCodi: () => string;
  /** El rellotge entra per paràmetre perquè les proves (horari, retencions) siguin deterministes. */
  rellotge: () => Date;
  configuracio?: { [K in keyof ConfiguracioReserves]?: Partial<ConfiguracioReserves[K]> };
};

/**
 * Implementació de proves: dades locals i les reserves en memòria del procés (es perden en
 * reiniciar). L'atzar dels codis i el rellotge entren per paràmetre.
 */
export function crearPlataformaProva({ generaCodi, rellotge, configuracio = {} }: Opcions): Plataforma {
  const reserves: (Ocupacio & Confirmacio)[] = [];
  const retencions: Retinguda[] = [];
  const participants = new Map<string, ParticipantsReserva>();
  const cites: (CitaTaller & Confirmacio)[] = [];
  const config = esquemaConfiguracio.parse({
    pagament: { ...configuracioReserves.pagament, ...configuracio.pagament },
    participants: { ...configuracioReserves.participants, ...configuracio.participants },
    retencioMinuts: configuracio.retencioMinuts ?? configuracioReserves.retencioMinuts,
  });

  const diesDe = (des: string, fins: string) => Array.from({ length: Math.max(0, diesEntre(des, fins)) }, (_, i) => sumaDies(des, i));

  /** El que ocupa cada dia: reserves fetes i retencions que encara no han caducat. */
  const ocupacions = (): Ocupacio[] => {
    const ara = rellotge().getTime();
    return [...reserves, ...retencions.filter((r) => r.caducaA > ara)];
  };
  const comptaEl = (dia: string, compta: (b: BiciReserva) => number) =>
    ocupacions()
      .filter((o) => o.dies.includes(dia))
      .reduce((total, o) => total + o.bicis.reduce((n, b) => n + compta(b), 0), 0);

  const lliuresBici = (biciId: string, talla: string, dies: readonly string[]) =>
    dies.reduce(
      (minim, dia) => Math.min(minim, unitatsLliures(biciId, talla, dia, 1, comptaEl(dia, (b) => Number(b.biciId === biciId && b.talla === talla)))),
      dies.length ? Infinity : 0,
    );
  const lliuresExtra = (e: Extra, dies: readonly string[]) =>
    e.estoc === null
      ? null
      : Math.max(0, dies.reduce((minim, dia) => Math.min(minim, e.estoc! - comptaEl(dia, (b) => Number(b.pedals === e.id) + b.extres.filter((x) => x === e.id).length)), e.estoc));

  /** Valida una reserva contra l'horari, el catàleg i les unitats lliures, i en calcula el total. */
  const comprova = (entrada: ReservaLloguer) => {
    const reserva = reservaLloguer.parse(entrada);
    if (validaFranja(reserva, horari, araABotiga(rellotge()))) throw new ErrorReserva('franja');
    const dies = diesDe(reserva.recollida.dia, reserva.retorn.dia);
    const perId = new Map(extres.map((e) => [e.id, e]));
    const linies = reserva.bicis.map((b) => {
      const bici = flota.find((f) => f.id === b.biciId);
      if (!bici) throw new ErrorReserva('bici');
      if (!bici.talles.includes(b.talla)) throw new ErrorReserva('talla');
      const pedals = perId.get(b.pedals ?? '');
      const triats = b.extres.map((id) => perId.get(id));
      if (pedals?.grup !== 'pedals' || triats.some((e) => e?.grup !== 'extres') || new Set(b.extres).size !== b.extres.length) {
        throw new ErrorReserva('extra');
      }
      return { tarifa: bici.tarifa, extres: [pedals, ...(triats as Extra[])] };
    });
    // Unitats que demana la reserva sencera, sumant les línies iguals.
    const demanades = new Map<string, number>();
    for (const b of reserva.bicis) demanades.set(`${b.biciId}|${b.talla}`, (demanades.get(`${b.biciId}|${b.talla}`) ?? 0) + 1);
    for (const [clau, n] of demanades) {
      const [biciId, talla] = clau.split('|') as [string, string];
      if (lliuresBici(biciId, talla, dies) < n) throw new ErrorReserva('esgotat');
    }
    for (const e of extres) {
      const n = reserva.bicis.reduce((total, b) => total + Number(b.pedals === e.id) + Number(b.extres.includes(e.id)), 0);
      const lliures = lliuresExtra(e, dies);
      if (n > 0 && lliures !== null && lliures < n) throw new ErrorReserva('extra');
    }
    const total = totalReserva(linies, reserva.recollida, reserva.retorn);
    if (total === null) throw new ErrorReserva('durada');
    return { reserva, dies, total };
  };

  const plataforma: Plataforma = {
    // Es validen igual que les dades remotes: si l'esquema canvia, les proves ho detecten.
    flota: async () => biciLloguer.array().parse(flota),
    bici: async (id) => {
      const trobada = flota.find((b) => b.id === id);
      return trobada ? biciLloguer.parse(trobada) : null;
    },
    extres: async () => extra.array().parse(extres),
    horari: async () => horariBotiga.parse(horari),
    configuracioReserves: async () => structuredClone(config),
    disponibilitat: async (recollida, retorn, biciIds) => {
      const dies = diesDe(recollida.dia, retorn.dia);
      const bicis: Disponibilitat['bicis'] = {};
      for (const id of biciIds) {
        const bici = flota.find((b) => b.id === id);
        if (bici) bicis[id] = Object.fromEntries(bici.talles.map((talla) => [talla, lliuresBici(id, talla, dies)]));
      }
      return { bicis, extres: Object.fromEntries(extres.map((e) => [e.id, lliuresExtra(e, dies)])) };
    },
    crearReservaLloguer: async (entrada) => {
      const { reserva, dies, total } = comprova(entrada);
      const confirmacio = { codi: generaCodi(), totalCentims: total };
      reserves.push({ dies, bicis: reserva.bicis, ...confirmacio });
      return confirmacio;
    },
    retenirReserva: async (entrada) => {
      const { reserva, dies, total } = comprova(entrada);
      const caducaA = rellotge().getTime() + config.retencioMinuts * 60_000;
      const id = generaCodi();
      retencions.push({ id, caducaA, dies, bicis: reserva.bicis });
      return { id, caducaA: new Date(caducaA).toISOString(), totalCentims: total };
    },
    alliberarRetencio: async (id) => {
      const i = retencions.findIndex((r) => r.id === id);
      if (i >= 0) retencions.splice(i, 1);
    },
    // La implementació de proves no té passarel·la: el pagament el farà la plataforma.
    iniciarPagament: async () => {
      throw new ErrorReserva('noDisponible');
    },
    estatRetencio: async (id) => {
      const retinguda = retencions.find((r) => r.id === id);
      if (!retinguda) throw new ErrorReserva('retencio');
      return { estat: retinguda.caducaA > rellotge().getTime() ? 'activa' : 'caducada' };
    },
    registrarParticipants: async (entrada) => {
      if (!config.participants.actiu) throw new ErrorReserva('noDisponible');
      const dades = participantsReserva.parse(entrada);
      const reserva = reserves.find((r) => r.codi === dades.codi);
      if (!reserva || dades.participants.length > reserva.bicis.length) throw new ErrorReserva('participants');
      participants.set(dades.codi, dades);
    },
    serveisTaller: async () => serveiTaller.array().parse(serveisTaller),
    frangesTaller: async (dia) => {
      const ocupades: Record<string, number> = {};
      for (const c of cites) if (c.dia === dia) ocupades[c.hora] = (ocupades[c.hora] ?? 0) + 1;
      return frangesTaller(dia, ocupades);
    },
    crearCitaTaller: async (entrada) => {
      const cita = citaTaller.parse(entrada);
      const franja = (await plataforma.frangesTaller(cita.dia)).find((f) => f.inici === cita.hora);
      if (!franja || franja.places < 1) throw new ErrorReserva('franja');
      const confirmacio = { codi: generaCodi() };
      cites.push({ ...cita, ...confirmacio });
      return confirmacio;
    },
    productes: async () => producte.array().parse(productes),
    articles: async (categoria) => article.array().parse(articles.filter((a) => a.categoria === categoria)),
    valoracio: async () => valoracio.parse(valoracioGoogle),
    ressenyes: async () => ressenya.array().parse(ressenyes),
  };
  return plataforma;
}
