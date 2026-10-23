import { crearPlataformaProva, ErrorReserva, plataforma } from './index';
import { categoriaEquipament, type ReservaLloguer } from './esquema';

const client = { nom: 'Anna Puig', telefon: '+34 600 000 000', correu: 'anna@example.com', idioma: 'ca', privacitat: true } as const;

function nova() {
  let n = 0;
  return crearPlataformaProva({ generaCodi: () => `TB-PROVA${++n}` });
}

/** Busca una talla amb unitats lliures per no dependre del hash concret. */
async function tallaLliure(p: ReturnType<typeof nova>, biciId: string, recollida: string, dies: number) {
  const disponibilitat = await p.disponibilitat(biciId, recollida, dies);
  const talla = Object.entries(disponibilitat).find(([, unitats]) => unitats > 0);
  if (!talla) throw new Error('cap talla lliure a la prova');
  return { talla: talla[0], unitats: talla[1] };
}

describe('plataforma de proves', () => {
  it('les dades de prova compleixen l\'esquema', async () => {
    await expect(plataforma.flota()).resolves.toHaveLength(10);
    await expect(plataforma.serveisTaller()).resolves.toHaveLength(6);
    await expect(plataforma.ressenyes()).resolves.not.toHaveLength(0);
  });

  it('cada peça de l\'escena d\'anatomia té un servei de taller', async () => {
    const peces = new Set((await plataforma.serveisTaller()).map((s) => s.peca));
    expect([...peces].sort()).toEqual(['direccio', 'frens', 'quadre', 'rodes', 'seient', 'transmissio']);
  });

  it("cada peça de l'anatomia té productes de la botiga per millorar-la", async () => {
    const productes = await plataforma.productes();
    for (const peca of ['rodes', 'frens', 'transmissio', 'direccio', 'seient', 'quadre']) {
      expect(productes.some((p) => p.peca === peca)).toBe(true);
    }
  });

  it("cada categoria d'equipament té articles, i només els seus", async () => {
    for (const categoria of categoriaEquipament.options) {
      const articles = await plataforma.articles(categoria);
      expect(articles.length, categoria).toBeGreaterThan(0);
      expect(articles.every((a) => a.categoria === categoria)).toBe(true);
    }
  });

  it('els serveis de taller inventats estan marcats com a ficticis', async () => {
    for (const servei of await plataforma.serveisTaller()) expect(servei.ficticia).toBe(true);
  });
});

describe('reserva de lloguer', () => {
  it('confirma amb codi i calcula el total al servidor', async () => {
    const p = nova();
    const { talla } = await tallaLliure(p, 'btt', '2026-11-02', 3);
    const reserva: ReservaLloguer = {
      biciId: 'btt', talla, pedals: 'plans', recollida: '2026-11-02', durada: { tipus: 'dies', dies: 3 }, bicis: 1, accessoris: ['cadenat'], ...client,
    };
    await expect(p.crearReservaLloguer(reserva)).resolves.toEqual({ codi: 'TB-PROVA1', totalCentims: 2520 * 3 + 300 });
  });

  it('una reserva ocupa unitats i no es pot sobrevendre', async () => {
    const p = nova();
    const { talla, unitats } = await tallaLliure(p, 'gravel', '2026-11-04', 1);
    const base: Omit<ReservaLloguer, 'bicis'> = { biciId: 'gravel', talla, pedals: 'spd', recollida: '2026-11-04', durada: { tipus: 'dies', dies: 1 }, accessoris: [], ...client };
    await p.crearReservaLloguer({ ...base, bicis: unitats });
    expect((await p.disponibilitat('gravel', '2026-11-04', 1))[talla]).toBe(0);
    await expect(p.crearReservaLloguer({ ...base, bicis: 1 })).rejects.toThrow(ErrorReserva);
  });

  it('rebutja el mig dia en una bici que no el té', async () => {
    const p = nova();
    const reserva: ReservaLloguer = { biciId: 'btt', talla: 'M', pedals: 'plans', recollida: '2026-11-02', durada: { tipus: 'migDia' }, bicis: 1, accessoris: [], ...client };
    await expect(p.crearReservaLloguer(reserva)).rejects.toMatchObject({ motiu: 'durada' });
  });

  it('rebutja dades mal formades', async () => {
    const p = nova();
    const dolenta = { biciId: 'btt', talla: 'M', pedals: 'plans', recollida: 'demà', durada: { tipus: 'dies', dies: 1 }, bicis: 1, accessoris: [], ...client };
    await expect(p.crearReservaLloguer(dolenta as unknown as ReservaLloguer)).rejects.toThrow();
  });
});

describe('cita al taller', () => {
  it('ocupa una plaça de la franja triada', async () => {
    const p = nova();
    const dia = '2026-10-27';
    const franja = (await p.frangesTaller(dia)).find((f) => f.places > 0)!;
    const confirmacio = await p.crearCitaTaller({ tipusBici: 'carretera', serveis: ['frens'], dia, hora: franja.inici, ...client });
    expect(confirmacio.codi).toBe('TB-PROVA1');
    expect((await p.frangesTaller(dia)).find((f) => f.inici === franja.inici)!.places).toBe(franja.places - 1);
  });

  it('no accepta cites en diumenge', async () => {
    const p = nova();
    await expect(p.crearCitaTaller({ tipusBici: 'urbana', serveis: ['rodes'], dia: '2026-10-25', hora: '10:00', ...client })).rejects.toMatchObject({ motiu: 'franja' });
  });
});
