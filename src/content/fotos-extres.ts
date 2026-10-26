// Fotos dels pedals i extres del lloguer. Són de Wikimedia Commons (llicències CC que demanen citar
// l'autor i la llicència): els crèdits surten al peu. Quan hi hagi fotos pròpies de la botiga,
// se substitueixen i aquests crèdits marxen.

import type { Foto } from './equipament';

export const FOTOS_EXTRES: Record<string, Foto> = {
  casc: {
    src: '/img/extres/casc.webp',
    autor: 'Ashley Pomeroy',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Bicycle_Helmet_0085.jpg',
  },
  cadenat: {
    src: '/img/extres/cadenat.webp',
    autor: 'DC',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Kryptonite_New_York_standard_lock.jpg',
  },
  cadiraNado: {
    src: '/img/extres/cadiraNado.webp',
    autor: 'MIKI Yoshihito',
    llicencia: 'CC BY 2.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by/2.0/',
    font: 'https://commons.wikimedia.org/wiki/File:HAMAX_Child_safety_seat._(4506790913).jpg',
  },
  alforges: {
    src: '/img/extres/alforges.webp',
    autor: 'Matti Blume',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:OutDoor_2018,_Friedrichshafen_(1X7A0503).jpg',
  },
  comptaquilometres: {
    src: '/img/extres/comptaquilometres.webp',
    autor: 'Glory Cycles',
    llicencia: 'CC BY 2.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by/2.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Now_this_is_a_cycling_computer_we_can_get_behind!_Garmin_530_with_hydration_reminders._-garmin_-garmin530_-cycling.jpg',
  },
  'pedals-plans': {
    src: '/img/extres/pedals-plans.webp',
    autor: 'Piotr Tysarczyk',
    llicencia: 'CC BY-SA 2.5',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    font: 'https://commons.wikimedia.org/wiki/File:Platform_pedal.jpg',
  },
  'pedals-spd': {
    src: '/img/extres/pedals-spd.webp',
    autor: 'Petar Milošević',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Shimano_SPD_pedal_PD-M520.jpg',
  },
  'pedals-spdSl': {
    src: '/img/extres/pedals-spdSl.webp',
    autor: 'Glory Cycles',
    llicencia: 'CC BY 2.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by/2.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Dura-Ace_9100_Pedals_01.jpg',
  },
  'pedals-look': {
    src: '/img/extres/pedals-look.webp',
    autor: 'Petar Milošević',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:LOOK_Keo_Blade_Carbon_clipless_pedals.jpg',
  },
};
