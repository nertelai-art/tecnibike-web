import { crearPlataformaProva, plataforma } from './index';
import { categoriaEquipament, type BiciReserva, type ReservaLloguer } from './esquema';

const client = { nom: 'Anna Puig', telefon: '+34 600 000 000', correu: 'anna@example.com', idioma: 'ca', privacitat: true } as const;

function nova(ara = new Date('2026-10-27T07:00:00Z')) {
  let n = 0;
  return crearPlataformaProva({ generaCodi: () => `TB-PROVA${++n}`, rellotge: () => ara });
}

/** Busca una talla amb unitats lliures per no dependre del hash concret. */
async function tallaLliure(p: ReturnType<typeof nova>, biciId: string, des: string, fins: string) {
  const disponibilitat = (await p.disponibilitat(des, fins, [biciId])).bicis[biciId] ?? {};
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
  // Dimarts 27 d'octubre de 2026 a les 8 del matí, hora de Madrid.
  const ARA = new Date('2026-10-27T07:00:00Z');
  const rec = { dia: '2026-11-02', hora: '09:00' };
  const ret = { dia: '2026-11-04', hora: '19:00' };
  const linia = (biciId: string, talla: string, extra: Partial<BiciReserva> = {}): BiciReserva => ({
    biciId, talla, pedals: 'pedals-plans', extres: [], ciclista: {}, ...extra,
  });
  const reserva = (bicis: BiciReserva[], franja = { recollida: rec, retorn: ret }): ReservaLloguer => ({ ...franja, bicis, ...client });

  it('confirma amb codi i calcula el total al servidor', async () => {
    const p = nova(ARA);
    const { talla } = await tallaLliure(p, 'btt', rec.dia, ret.dia);
    const r = reserva([linia('btt', talla, { extres: ['cadenat'], ciclista: { alcadaCm: 178, alcadaSeientCm: 74 } })]);
    await expect(p.crearReservaLloguer(r)).resolves.toEqual({ codi: 'TB-PROVA1', totalCentims: 2520 * 3 + 300 });
  });

  it('diverses bicis de models diferents en una sola reserva', async () => {
    const p = nova(ARA);
    const btt = await tallaLliure(p, 'btt', rec.dia, ret.dia);
    const carretera = await tallaLliure(p, 'carretera', rec.dia, ret.dia);
    const confirmacio = await p.crearReservaLloguer(
      reserva([linia('btt', btt.talla), linia('carretera', carretera.talla, { pedals: 'pedals-look', extres: ['casc', 'comptaquilometres'] })]),
    );
    expect(confirmacio.totalCentims).toBe(2520 * 3 + 2800 * 3 + 200 * 3);
  });

  it('una reserva ocupa unitats i no es pot sobrevendre, tampoc amb dues línies iguals', async () => {
    const p = nova(ARA);
    const { talla, unitats } = await tallaLliure(p, 'gravel', rec.dia, rec.dia);
    const un = { recollida: rec, retorn: { dia: rec.dia, hora: '19:00' } };
    await expect(p.crearReservaLloguer(reserva(Array.from({ length: unitats + 1 }, () => linia('gravel', talla)), un))).rejects.toMatchObject({ motiu: 'esgotat' });
    await p.crearReservaLloguer(reserva(Array.from({ length: unitats }, () => linia('gravel', talla)), un));
    expect((await p.disponibilitat(rec.dia, rec.dia, ['gravel'])).bicis.gravel![talla]).toBe(0);
  });

  it("els extres tenen estoc i s'esgoten", async () => {
    const p = nova(ARA);
    const cadira = (await p.extres()).find((e) => e.id === 'cadiraNado')!;
    expect(cadira.estoc).toBe(2);
    const bicis: BiciReserva[] = [];
    for (const id of ['btt', 'carretera', 'gravel']) bicis.push(linia(id, (await tallaLliure(p, id, rec.dia, ret.dia)).talla, { extres: ['cadiraNado'] }));
    await expect(p.crearReservaLloguer(reserva(bicis))).rejects.toMatchObject({ motiu: 'extra' });
    await p.crearReservaLloguer(reserva(bicis.slice(0, 2)));
    expect((await p.disponibilitat(rec.dia, ret.dia, [])).extres.cadiraNado).toBe(0);
  });

  it('els pedals han de ser del grup de pedals i els extres, de la resta', async () => {
    const p = nova(ARA);
    const { talla } = await tallaLliure(p, 'btt', rec.dia, ret.dia);
    await expect(p.crearReservaLloguer(reserva([linia('btt', talla, { pedals: 'casc' })]))).rejects.toMatchObject({ motiu: 'extra' });
    await expect(p.crearReservaLloguer(reserva([linia('btt', talla, { extres: ['pedals-spd'] })]))).rejects.toMatchObject({ motiu: 'extra' });
    await expect(p.crearReservaLloguer(reserva([linia('btt', talla, { extres: ['res'] })]))).rejects.toMatchObject({ motiu: 'extra' });
  });

  it("rebutja recollides fora de l'horari o en dies tancats", async () => {
    const p = nova(ARA);
    const diumenge = { recollida: { dia: '2026-11-01', hora: '10:00' }, retorn: ret };
    await expect(p.crearReservaLloguer(reserva([linia('btt', 'M')], diumenge))).rejects.toMatchObject({ motiu: 'franja' });
    const migdia = { recollida: { dia: rec.dia, hora: '14:00' }, retorn: ret };
    await expect(p.crearReservaLloguer(reserva([linia('btt', 'M')], migdia))).rejects.toMatchObject({ motiu: 'franja' });
  });

  it('rebutja dades mal formades', async () => {
    const p = nova(ARA);
    const dolenta = { ...reserva([linia('btt', 'M')]), recollida: { dia: 'demà', hora: '09:00' } };
    await expect(p.crearReservaLloguer(dolenta as unknown as ReservaLloguer)).rejects.toThrow();
  });
});

describe('retenció mentre es paga', () => {
  const rec = { dia: '2026-11-02', hora: '09:00' };
  const un = { recollida: rec, retorn: { dia: rec.dia, hora: '19:00' } };

  it('guarda les bicis i les allibera en caducar', async () => {
    let ara = new Date('2026-10-27T07:00:00Z');
    const p = crearPlataformaProva({ generaCodi: () => 'TB-R', rellotge: () => ara });
    const { talla, unitats } = await tallaLliure(p, 'urbana', rec.dia, rec.dia);
    const retencio = await p.retenirReserva({
      ...un, bicis: Array.from({ length: unitats }, () => ({ biciId: 'urbana', talla, pedals: 'pedals-plans', extres: [], ciclista: {} })), ...client,
    });
    expect(retencio.caducaA).toBe('2026-10-27T07:15:00.000Z');
    expect((await p.disponibilitat(rec.dia, rec.dia, ['urbana'])).bicis.urbana![talla]).toBe(0);
    ara = new Date('2026-10-27T07:16:00Z');
    expect((await p.disponibilitat(rec.dia, rec.dia, ['urbana'])).bicis.urbana![talla]).toBe(unitats);
  });

  it('alliberar-la retorna les unitats de seguida', async () => {
    const p = nova(new Date('2026-10-27T07:00:00Z'));
    const { talla, unitats } = await tallaLliure(p, 'urbana', rec.dia, rec.dia);
    const retencio = await p.retenirReserva({ ...un, bicis: [{ biciId: 'urbana', talla, pedals: 'pedals-plans', extres: [], ciclista: {} }], ...client });
    await p.alliberarRetencio(retencio.id);
    expect((await p.disponibilitat(rec.dia, rec.dia, ['urbana'])).bicis.urbana![talla]).toBe(unitats);
  });

  it('sense passarel·la de pagament no es pot pagar', async () => {
    const p = nova(new Date('2026-10-27T07:00:00Z'));
    await expect(p.iniciarPagament('qualsevol', 'senyal', 'https://example.com/tornada')).rejects.toMatchObject({ motiu: 'noDisponible' });
  });
});

describe('participants i signatura', () => {
  const signatura = 'data:image/png;base64,iVBORw0KGgo=';
  const participants = [{ nom: 'Anna Puig', document: '12345678Z', signatura }];

  it("estan apagats fins que la plataforma els activi", async () => {
    const p = nova(new Date('2026-10-27T07:00:00Z'));
    expect((await p.configuracioReserves()).participants.actiu).toBe(false);
    await expect(p.registrarParticipants({ codi: 'TB-X', participants, condicions: true })).rejects.toMatchObject({ motiu: 'noDisponible' });
  });

  it('activats, es desen per a una reserva que existeix', async () => {
    const p = crearPlataformaProva({
      generaCodi: () => 'TB-P',
      rellotge: () => new Date('2026-10-27T07:00:00Z'),
      configuracio: { participants: { actiu: true } },
    });
    const { talla } = await tallaLliure(p, 'btt', '2026-11-02', '2026-11-02');
    const { codi } = await p.crearReservaLloguer({
      recollida: { dia: '2026-11-02', hora: '09:00' }, retorn: { dia: '2026-11-02', hora: '19:00' },
      bicis: [{ biciId: 'btt', talla, pedals: 'pedals-plans', extres: [], ciclista: {} }], ...client,
    });
    await expect(p.registrarParticipants({ codi, participants, condicions: true })).resolves.toBeUndefined();
    await expect(p.registrarParticipants({ codi: 'TB-NO', participants, condicions: true })).rejects.toMatchObject({ motiu: 'participants' });
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
