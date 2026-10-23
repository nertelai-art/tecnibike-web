/**
 * Línia de temps d'un vídeo lligat al scroll: reparteix el progrés 0–1 entre
 * els clips segons el recorregut de cadascun. TypeScript pur, sense DOM.
 */

export interface ScrubState {
  /** Clip actiu. */
  index: number;
  /** Posició dins del clip actiu, 0–1. */
  local: number;
  /** 0–1: quant es veu ja el clip següent per sobre de l'actiu (fos de la unió). */
  blend: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Recorregut total, en alçades de pantalla. */
export const totalScroll = (spans: readonly number[]): number => spans.reduce((sum, span) => sum + span, 0);

/**
 * `spans` és el recorregut de cada clip en alçades de pantalla. `fade` és la
 * part final de cada clip (0–1) durant la qual el següent hi entra per sobre.
 */
export function scrubAt(progress: number, spans: readonly number[], fade = 0.06): ScrubState {
  const total = totalScroll(spans);
  if (spans.length === 0 || total <= 0) return { index: 0, local: 0, blend: 0 };

  let position = clamp(progress) * total;
  let index = 0;
  while (index < spans.length - 1 && position >= spans[index]!) {
    position -= spans[index]!;
    index++;
  }
  const local = clamp(position / spans[index]!);
  const last = index === spans.length - 1;
  const blend = last || fade <= 0 ? 0 : clamp((local - (1 - fade)) / fade);
  return { index, local, blend };
}
