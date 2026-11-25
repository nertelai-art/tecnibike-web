// La política de privacitat de Tecnibike, en els quatre idiomes de la web (25-11-2026).
//
// Substitueix l'enllaç a la de la web antiga (tecnibike.es/politica-de-privacidad), que era genèrica:
// no deia res del WhatsApp, de l'assistent de veu, de la gravació, dels encarregats del tractament ni dels
// terminis (docs/147 §2.2 de la plataforma). Les dades de l'empresa surten de l'avís legal
// (docs/base-coneixement.md). El text l'ha de revisar l'assessor de Tecnibike abans de passar la web al
// seu domini: les bases jurídiques i els terminis són els habituals, no un dictamen.

import type { Locale } from '@/i18n/routing';

export const RESPONSABLE = {
  rao: 'TECNIBIKE COSTA BRAVA SL',
  nif: 'B55174296',
  domicili: "Passeig dels Pescadors, 2 (26) · 17251 Calonge (Girona)",
  botiga: "Carrer de l'Empordà, 29 · 17252 Sant Antoni de Calonge (Girona)",
  correu: 'info@tecnibike.es',
  telefon: '972 66 29 51',
} as const;

/** Dia de l'última revisió del text, en format ISO. */
export const ACTUALITZADA = '2026-11-25';

/** Els dies que es guarden les converses de WhatsApp i les trucades (la retenció de la plataforma). */
export const DIES_CONVERSES = 90;

export type Seccio = {
  titol: string;
  paragrafs?: string[];
  llista?: string[];
  /** Paràgrafs que van després de la llista. */
  despres?: string[];
};

const ca: Seccio[] = [
  {
    titol: 'Qui tracta les teves dades',
    paragrafs: [
      `El responsable és ${RESPONSABLE.rao}, amb NIF ${RESPONSABLE.nif} i domicili social a ${RESPONSABLE.domicili}. La botiga és al ${RESPONSABLE.botiga}.`,
      `Per a qualsevol cosa sobre les teves dades, escriu a ${RESPONSABLE.correu} o truca al ${RESPONSABLE.telefon}.`,
    ],
  },
  {
    titol: 'Quines dades tractem',
    llista: [
      'Les de contacte: nom, telèfon i correu.',
      "Les de la reserva o la cita: dates, bicis, talla, alçada, extres, nutrició, la bici que portes al taller i els comentaris que hi afegeixis.",
      "Les del pagament: l'import i si s'ha pagat. El número de la targeta el tracta Stripe; Tecnibike no el veu ni el desa.",
      "Les converses de WhatsApp: el text, les fotos i les notes de veu que ens enviïs.",
      "Les trucades amb l'assistent de veu: l'àudio gravat, la transcripció i un resum.",
      'Les condicions del lloguer signades a la botiga, si en signes.',
    ],
    despres: ['Totes ens les dones tu. No en demanem de salut ni de cap altra categoria especial.'],
  },
  {
    titol: 'Per a què les fem servir, i amb quina base',
    llista: [
      'Gestionar les reserves, els lloguers, les cites del taller i els pagaments. Base: el contracte que fem amb tu, o els passos previs que ens demanes (art. 6.1.b del RGPD).',
      "Respondre't quan ens escrius o ens truques. Base: la teva petició i el nostre interès legítim a atendre't (art. 6.1.b i 6.1.f).",
      "Gravar i transcriure les trucades amb l'assistent de veu, per deixar constància del que has demanat i resoldre incidències. Base: el nostre interès legítim (art. 6.1.f). T'ho diem al començament de la trucada, i t'hi pots oposar.",
      'Facturar i complir les obligacions comptables i fiscals. Base: una obligació legal (art. 6.1.c).',
      "Enviar-te novetats o ofertes, només si ens hi has donat el consentiment (art. 6.1.a). El pots retirar quan vulguis.",
    ],
  },
  {
    titol: "L'assistent virtual",
    paragrafs: [
      "Quan ens escrius per WhatsApp o truques a l'assistent de veu, et respon un assistent virtual, un programa d'intel·ligència artificial, i t'ho diu al començament. Consulta la disponibilitat i els preus, i pot deixar una reserva o una cita demanada.",
      "No pren cap decisió que et pugui afectar de manera important: les reserves que deixa queden pendents fins que la botiga les confirma. Si vols parlar amb una persona, demana-ho i et passarem amb la botiga o et trucarem.",
    ],
  },
  {
    titol: 'Qui més les tracta per encàrrec nostre',
    paragrafs: [
      "Fem servir aquests proveïdors, que tracten les dades només per donar-nos el seu servei i amb un contracte d'encarregat del tractament:",
    ],
    llista: [
      "Nertel (nertel.ai): la plataforma on gestionem les reserves i les cites, l'assistent de WhatsApp i l'agent de veu.",
      "ElevenLabs: la veu de l'assistent telefònic, la gravació i la transcripció de les trucades.",
      'Twilio: la línia telefònica.',
      'YCloud i Meta (WhatsApp): enviar i rebre els missatges de WhatsApp.',
      "Proveïdors de models d'intel·ligència artificial, a través d'OpenRouter: perquè l'assistent de WhatsApp entengui els missatges i redacti les respostes.",
      'Stripe: els pagaments amb targeta.',
      'Resend: els correus de confirmació.',
      'Vercel: l’allotjament d’aquesta web.',
    ],
  },
  {
    titol: 'Transferències fora de la Unió Europea',
    paragrafs: [
      "Alguns d'aquests proveïdors són dels Estats Units o hi poden tractar dades. En aquests casos, la transferència es fa amb les garanties que exigeix el RGPD: el Marc de privacitat de dades UE-EUA o les clàusules contractuals tipus de la Comissió Europea.",
    ],
  },
  {
    titol: 'Quant de temps les guardem',
    llista: [
      `Les converses de WhatsApp i les trucades (text, àudio i transcripció): ${DIES_CONVERSES} dies. Després s'esborren. El que en quedi apuntat a la reserva o a la cita es guarda amb elles.`,
      'Les reserves, els lloguers, les cites, els pagaments i les condicions signades: mentre duri la relació i, després, el temps que la llei obliga a guardar-los (en general, sis anys la documentació mercantil i quatre la fiscal).',
      'Les consultes que no acaben en cap reserva: el temps que calgui per respondre-les i, com a màxim, 24 mesos.',
    ],
  },
  {
    titol: 'Els teus drets',
    paragrafs: [
      `Pots demanar veure les teves dades, corregir-les, esborrar-les, limitar-ne el tractament, oposar-t'hi i endur-te-les. Escriu a ${RESPONSABLE.correu} dient què vols. Si no saps qui ets, et podem demanar que ho acreditis.`,
      "Si creus que no les tractem bé, pots reclamar a l'Agència Espanyola de Protecció de Dades (www.aepd.es).",
    ],
  },
  {
    titol: 'Menors',
    paragrafs: ["Per reservar o demanar una cita has de tenir 18 anys. Les dades d'un menor que vingui a llogar les dona la persona adulta que fa la reserva."],
  },
];

const es: Seccio[] = [
  {
    titol: 'Quién trata tus datos',
    paragrafs: [
      `El responsable es ${RESPONSABLE.rao}, con NIF ${RESPONSABLE.nif} y domicilio social en ${RESPONSABLE.domicili}. La tienda está en ${RESPONSABLE.botiga}.`,
      `Para cualquier cosa sobre tus datos, escribe a ${RESPONSABLE.correu} o llama al ${RESPONSABLE.telefon}.`,
    ],
  },
  {
    titol: 'Qué datos tratamos',
    llista: [
      'Los de contacto: nombre, teléfono y correo.',
      'Los de la reserva o la cita: fechas, bicis, talla, altura, extras, nutrición, la bici que traes al taller y los comentarios que añadas.',
      'Los del pago: el importe y si se ha pagado. El número de la tarjeta lo trata Stripe; Tecnibike no lo ve ni lo guarda.',
      'Las conversaciones de WhatsApp: el texto, las fotos y las notas de voz que nos envíes.',
      'Las llamadas con el asistente de voz: el audio grabado, la transcripción y un resumen.',
      'Las condiciones del alquiler firmadas en la tienda, si las firmas.',
    ],
    despres: ['Todos nos los das tú. No pedimos datos de salud ni de ninguna otra categoría especial.'],
  },
  {
    titol: 'Para qué los usamos, y con qué base',
    llista: [
      'Gestionar las reservas, los alquileres, las citas del taller y los pagos. Base: el contrato que hacemos contigo, o los pasos previos que nos pides (art. 6.1.b del RGPD).',
      'Responderte cuando nos escribes o nos llamas. Base: tu petición y nuestro interés legítimo en atenderte (art. 6.1.b y 6.1.f).',
      'Grabar y transcribir las llamadas con el asistente de voz, para dejar constancia de lo que has pedido y resolver incidencias. Base: nuestro interés legítimo (art. 6.1.f). Te lo decimos al empezar la llamada, y puedes oponerte.',
      'Facturar y cumplir las obligaciones contables y fiscales. Base: una obligación legal (art. 6.1.c).',
      'Enviarte novedades u ofertas, solo si nos has dado tu consentimiento (art. 6.1.a). Puedes retirarlo cuando quieras.',
    ],
  },
  {
    titol: 'El asistente virtual',
    paragrafs: [
      'Cuando nos escribes por WhatsApp o llamas al asistente de voz, te responde un asistente virtual, un programa de inteligencia artificial, y te lo dice al empezar. Consulta la disponibilidad y los precios, y puede dejar una reserva o una cita solicitada.',
      'No toma ninguna decisión que te pueda afectar de forma importante: las reservas que deja quedan pendientes hasta que la tienda las confirma. Si quieres hablar con una persona, pídelo y te pasaremos con la tienda o te llamaremos.',
    ],
  },
  {
    titol: 'Quién más los trata por encargo nuestro',
    paragrafs: ['Usamos estos proveedores, que tratan los datos solo para darnos su servicio y con un contrato de encargado del tratamiento:'],
    llista: [
      'Nertel (nertel.ai): la plataforma donde gestionamos las reservas y las citas, el asistente de WhatsApp y el agente de voz.',
      'ElevenLabs: la voz del asistente telefónico, la grabación y la transcripción de las llamadas.',
      'Twilio: la línea telefónica.',
      'YCloud y Meta (WhatsApp): enviar y recibir los mensajes de WhatsApp.',
      'Proveedores de modelos de inteligencia artificial, a través de OpenRouter: para que el asistente de WhatsApp entienda los mensajes y redacte las respuestas.',
      'Stripe: los pagos con tarjeta.',
      'Resend: los correos de confirmación.',
      'Vercel: el alojamiento de esta web.',
    ],
  },
  {
    titol: 'Transferencias fuera de la Unión Europea',
    paragrafs: [
      'Algunos de estos proveedores son de Estados Unidos o pueden tratar datos allí. En esos casos, la transferencia se hace con las garantías que exige el RGPD: el Marco de privacidad de datos UE-EE. UU. o las cláusulas contractuales tipo de la Comisión Europea.',
    ],
  },
  {
    titol: 'Cuánto tiempo los guardamos',
    llista: [
      `Las conversaciones de WhatsApp y las llamadas (texto, audio y transcripción): ${DIES_CONVERSES} días. Después se borran. Lo que quede anotado en la reserva o la cita se guarda con ellas.`,
      'Las reservas, los alquileres, las citas, los pagos y las condiciones firmadas: mientras dure la relación y, después, el tiempo que la ley obliga a guardarlos (en general, seis años la documentación mercantil y cuatro la fiscal).',
      'Las consultas que no acaban en ninguna reserva: el tiempo necesario para responderlas y, como máximo, 24 meses.',
    ],
  },
  {
    titol: 'Tus derechos',
    paragrafs: [
      `Puedes pedir ver tus datos, corregirlos, borrarlos, limitar su tratamiento, oponerte y llevártelos. Escribe a ${RESPONSABLE.correu} diciendo qué quieres. Si no sabemos quién eres, podemos pedirte que lo acredites.`,
      'Si crees que no los tratamos bien, puedes reclamar a la Agencia Española de Protección de Datos (www.aepd.es).',
    ],
  },
  {
    titol: 'Menores',
    paragrafs: ['Para reservar o pedir una cita tienes que tener 18 años. Los datos de un menor que venga a alquilar los da la persona adulta que hace la reserva.'],
  },
];

const en: Seccio[] = [
  {
    titol: 'Who handles your data',
    paragrafs: [
      `The controller is ${RESPONSABLE.rao}, tax ID ${RESPONSABLE.nif}, registered office at ${RESPONSABLE.domicili}. The shop is at ${RESPONSABLE.botiga}.`,
      `For anything about your data, write to ${RESPONSABLE.correu} or call ${RESPONSABLE.telefon}.`,
    ],
  },
  {
    titol: 'What data we handle',
    llista: [
      'Contact details: name, phone and email.',
      'Booking or appointment details: dates, bikes, size, height, extras, nutrition, the bike you bring to the workshop and any comments you add.',
      'Payment details: the amount and whether it has been paid. Your card number is handled by Stripe; Tecnibike never sees or stores it.',
      'WhatsApp conversations: the text, photos and voice notes you send us.',
      'Calls with the voice assistant: the recorded audio, the transcript and a summary.',
      'The rental terms you sign at the shop, if you sign them.',
    ],
    despres: ['You give us all of it. We do not ask for health data or any other special category of data.'],
  },
  {
    titol: 'What we use it for, and on what basis',
    llista: [
      'To manage bookings, rentals, workshop appointments and payments. Basis: our contract with you, or the steps you ask us to take before it (Art. 6(1)(b) GDPR).',
      'To answer you when you write or call. Basis: your request and our legitimate interest in helping you (Art. 6(1)(b) and 6(1)(f)).',
      'To record and transcribe calls with the voice assistant, so there is a record of what you asked for and we can sort out problems. Basis: our legitimate interest (Art. 6(1)(f)). We tell you at the start of the call, and you can object.',
      'To invoice and meet our accounting and tax obligations. Basis: a legal obligation (Art. 6(1)(c)).',
      'To send you news or offers, only if you have given us your consent (Art. 6(1)(a)). You can withdraw it at any time.',
    ],
  },
  {
    titol: 'The virtual assistant',
    paragrafs: [
      'When you write to us on WhatsApp or call the voice assistant, a virtual assistant answers: an artificial intelligence program, and it tells you so at the start. It checks availability and prices, and it can leave a booking or an appointment request.',
      'It does not take any decision that could significantly affect you: the bookings it leaves stay pending until the shop confirms them. If you want to talk to a person, just ask and we will put you through to the shop or call you back.',
    ],
  },
  {
    titol: 'Who else handles it on our behalf',
    paragrafs: ['We use these providers, which handle the data only to provide their service to us, under a data processing agreement:'],
    llista: [
      'Nertel (nertel.ai): the platform where we manage bookings and appointments, the WhatsApp assistant and the voice agent.',
      'ElevenLabs: the voice of the phone assistant, and the recording and transcription of calls.',
      'Twilio: the phone line.',
      'YCloud and Meta (WhatsApp): sending and receiving WhatsApp messages.',
      'Artificial intelligence model providers, through OpenRouter: so the WhatsApp assistant can understand messages and write replies.',
      'Stripe: card payments.',
      'Resend: confirmation emails.',
      'Vercel: hosting for this website.',
    ],
  },
  {
    titol: 'Transfers outside the European Union',
    paragrafs: [
      'Some of these providers are based in the United States or may handle data there. In those cases the transfer is made with the safeguards the GDPR requires: the EU-US Data Privacy Framework or the European Commission’s standard contractual clauses.',
    ],
  },
  {
    titol: 'How long we keep it',
    llista: [
      `WhatsApp conversations and calls (text, audio and transcript): ${DIES_CONVERSES} days. Then they are deleted. Anything noted on the booking or appointment is kept with it.`,
      'Bookings, rentals, appointments, payments and signed terms: for as long as our relationship lasts and then for as long as the law requires (generally six years for commercial records and four for tax records).',
      'Enquiries that do not lead to a booking: for as long as it takes to answer them, and 24 months at most.',
    ],
  },
  {
    titol: 'Your rights',
    paragrafs: [
      `You can ask to see your data, correct it, delete it, restrict its use, object to it and take it with you. Write to ${RESPONSABLE.correu} saying what you want. If we cannot tell who you are, we may ask you to prove it.`,
      'If you think we are not handling it properly, you can complain to the Spanish Data Protection Agency (www.aepd.es).',
    ],
  },
  {
    titol: 'Minors',
    paragrafs: ['You must be 18 to make a booking or an appointment. The details of a minor who comes to rent a bike are given by the adult who makes the booking.'],
  },
];

const fr: Seccio[] = [
  {
    titol: 'Qui traite vos données',
    paragrafs: [
      `Le responsable est ${RESPONSABLE.rao}, NIF ${RESPONSABLE.nif}, siège social : ${RESPONSABLE.domicili}. La boutique se trouve ${RESPONSABLE.botiga}.`,
      `Pour toute question sur vos données, écrivez à ${RESPONSABLE.correu} ou appelez le ${RESPONSABLE.telefon}.`,
    ],
  },
  {
    titol: 'Quelles données nous traitons',
    llista: [
      'Vos coordonnées : nom, téléphone et e-mail.',
      'Celles de la réservation ou du rendez-vous : dates, vélos, taille, hauteur, options, nutrition, le vélo que vous apportez à l’atelier et vos commentaires.',
      'Celles du paiement : le montant et s’il a été payé. Le numéro de carte est traité par Stripe ; Tecnibike ne le voit ni ne le conserve.',
      'Les conversations WhatsApp : le texte, les photos et les messages vocaux que vous nous envoyez.',
      'Les appels avec l’assistant vocal : l’audio enregistré, la transcription et un résumé.',
      'Les conditions de location signées à la boutique, si vous les signez.',
    ],
    despres: ['C’est vous qui nous les donnez. Nous ne demandons aucune donnée de santé ni d’aucune autre catégorie particulière.'],
  },
  {
    titol: 'À quoi elles servent, et sur quelle base',
    llista: [
      'Gérer les réservations, les locations, les rendez-vous de l’atelier et les paiements. Base : le contrat que nous concluons avec vous, ou les démarches préalables que vous nous demandez (art. 6.1.b du RGPD).',
      'Vous répondre quand vous nous écrivez ou nous appelez. Base : votre demande et notre intérêt légitime à vous servir (art. 6.1.b et 6.1.f).',
      'Enregistrer et transcrire les appels avec l’assistant vocal, pour garder une trace de votre demande et résoudre les incidents. Base : notre intérêt légitime (art. 6.1.f). Nous vous le disons au début de l’appel, et vous pouvez vous y opposer.',
      'Facturer et respecter nos obligations comptables et fiscales. Base : une obligation légale (art. 6.1.c).',
      'Vous envoyer des nouveautés ou des offres, seulement si vous y avez consenti (art. 6.1.a). Vous pouvez retirer votre consentement à tout moment.',
    ],
  },
  {
    titol: 'L’assistant virtuel',
    paragrafs: [
      'Quand vous nous écrivez sur WhatsApp ou appelez l’assistant vocal, c’est un assistant virtuel qui vous répond, un programme d’intelligence artificielle, et il vous le dit dès le début. Il consulte les disponibilités et les prix, et peut enregistrer une demande de réservation ou de rendez-vous.',
      'Il ne prend aucune décision qui pourrait vous affecter de manière importante : les réservations qu’il enregistre restent en attente jusqu’à ce que la boutique les confirme. Si vous voulez parler à une personne, demandez-le et nous vous passerons la boutique ou vous rappellerons.',
    ],
  },
  {
    titol: 'Qui d’autre les traite pour notre compte',
    paragrafs: ['Nous faisons appel à ces prestataires, qui traitent les données uniquement pour nous fournir leur service, dans le cadre d’un contrat de sous-traitance :'],
    llista: [
      'Nertel (nertel.ai) : la plateforme où nous gérons les réservations et les rendez-vous, l’assistant WhatsApp et l’agent vocal.',
      'ElevenLabs : la voix de l’assistant téléphonique, l’enregistrement et la transcription des appels.',
      'Twilio : la ligne téléphonique.',
      'YCloud et Meta (WhatsApp) : l’envoi et la réception des messages WhatsApp.',
      'Des fournisseurs de modèles d’intelligence artificielle, via OpenRouter : pour que l’assistant WhatsApp comprenne les messages et rédige les réponses.',
      'Stripe : les paiements par carte.',
      'Resend : les e-mails de confirmation.',
      'Vercel : l’hébergement de ce site.',
    ],
  },
  {
    titol: 'Transferts hors de l’Union européenne',
    paragrafs: [
      'Certains de ces prestataires sont établis aux États-Unis ou peuvent y traiter des données. Dans ce cas, le transfert est encadré par les garanties exigées par le RGPD : le cadre de protection des données UE-États-Unis ou les clauses contractuelles types de la Commission européenne.',
    ],
  },
  {
    titol: 'Combien de temps nous les conservons',
    llista: [
      `Les conversations WhatsApp et les appels (texte, audio et transcription) : ${DIES_CONVERSES} jours, puis ils sont supprimés. Ce qui est noté sur la réservation ou le rendez-vous est conservé avec eux.`,
      'Les réservations, les locations, les rendez-vous, les paiements et les conditions signées : pendant toute la relation, puis le temps que la loi impose (en général six ans pour les documents commerciaux et quatre pour les documents fiscaux).',
      'Les demandes qui n’aboutissent à aucune réservation : le temps nécessaire pour y répondre, et 24 mois au maximum.',
    ],
  },
  {
    titol: 'Vos droits',
    paragrafs: [
      `Vous pouvez demander à accéder à vos données, à les rectifier, à les effacer, à en limiter le traitement, à vous y opposer et à les récupérer. Écrivez à ${RESPONSABLE.correu} en précisant votre demande. Si nous ne pouvons pas vous identifier, nous pourrons vous demander de justifier votre identité.`,
      'Si vous estimez que nous ne les traitons pas correctement, vous pouvez déposer une réclamation auprès de l’Agence espagnole de protection des données (www.aepd.es).',
    ],
  },
  {
    titol: 'Mineurs',
    paragrafs: ['Il faut avoir 18 ans pour réserver ou prendre rendez-vous. Les données d’un mineur qui vient louer un vélo sont fournies par l’adulte qui fait la réservation.'],
  },
];

export const SECCIONS_PRIVACITAT: Record<Locale, Seccio[]> = { ca, es, en, fr };
