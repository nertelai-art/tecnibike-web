"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { scrubAt, totalScroll, type ScrubState } from "@/lib/scrub-timeline";

export interface ScrollVideoClip {
  /** Vídeo sense àudio, codificat amb GOP curt (vegeu la skill `scroll-video`). */
  src: string;
  /** Versió per a mòbil (720 px d'ample, idealment 9:16). Si no n'hi ha, es fa servir `src`. */
  srcMobile?: string;
  /** Primer fotograma del clip: es veu fins que el vídeo pinta, i sol amb moviment reduït. */
  poster: string;
  posterMobile?: string;
  /** Recorregut de scroll d'aquest clip, en alçades de pantalla. Per defecte, 1,3. */
  scroll?: number;
}

export interface ScrollVideoFrame extends ScrubState {
  progress: number;
}

interface ScrollVideoProps {
  clips: readonly ScrollVideoClip[];
  /** Descripció del que es veu, per a lectors de pantalla. */
  label: string;
  /** Es crida a cada fotograma amb l'estat del recorregut. Escriu estils a refs; no facis `setState`. */
  onFrame?: (frame: ScrollVideoFrame) => void;
  /** Alçada d'una capçalera fixa, en píxels. */
  offsetTop?: number;
  /** Part final de cada clip durant la qual el següent hi entra per sobre. */
  fade?: number;
  /** Contingut HTML de sobre del vídeo. */
  children?: ReactNode;
  /** Fons de l'escenari, per sota del vídeo (quan el vídeo va dins d'una caixa). */
  background?: ReactNode;
  /**
   * Converteix la posició dins del clip (0–1) en la posició del vídeo (0–1). Serveix per fer
   * aturades: trams de scroll on el vídeo no avança.
   */
  remap?: (local: number, index: number) => number;
  /** Classe per a la capa del vídeo, per posar-lo dins d'una caixa en lloc de pantalla completa. */
  mediaClassName?: string;
  /**
   * Com de de pressa el vídeo atrapa el scroll (més baix = més suau i flotant, amb més inèrcia).
   * Per defecte 14, gairebé enganxat al dit.
   */
  smoothing?: number;
}

const DEFAULT_SCROLL = 1.3;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const mobileQuery = "(pointer: coarse), (max-width: 860px)";

const subscribeTo = (query: string) => (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const subscribeReducedMotion = subscribeTo(reducedMotionQuery);

interface Slot {
  url?: string;
  loading: boolean;
  ready: boolean;
  /** Últim temps demanat mentre el descodificador encara cercava. */
  pending: number | null;
}

const cover: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

/**
 * Vídeo de fons lligat al scroll: el scroll mou el temps d'una cadena de clips.
 * Cada clip es baixa com a `Blob` (sempre cercable, encara que el servidor no
 * serveixi peticions de rang) i només es carreguen l'actual i els veïns.
 */
export function ScrollVideo({ clips, label, onFrame, offsetTop = 0, fade = 0.06, children, background, remap, mediaClassName, smoothing = 14 }: ScrollVideoProps) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
  const track = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const onFrameRef = useRef(onFrame);
  const remapRef = useRef(remap);
  useEffect(() => {
    onFrameRef.current = onFrame;
    remapRef.current = remap;
  });

  const spans = clips.map((clip) => clip.scroll ?? DEFAULT_SCROLL);
  const spansKey = spans.join(",");
  const sourcesKey = clips.map((clip) => `${clip.src}|${clip.srcMobile ?? ""}`).join(",");

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const spanList = spansKey.split(",").map(Number);

    if (reduced) {
      onFrameRef.current?.({ progress: 0, ...scrubAt(0, spanList, fade) });
      return;
    }

    const mobile = window.matchMedia(mobileQuery).matches;
    const slots: Slot[] = clips.map(() => ({ loading: false, ready: false, pending: null }));
    const cleanups: (() => void)[] = [];
    // Còpia per a la neteja: quan corri, React ja pot haver buidat la ref.
    const mounted = videos.current.slice();
    let disposed = false;

    const seek = (index: number, local: number) => {
      const video = videos.current[index];
      const slot = slots[index];
      if (!video || !slot?.ready || !Number.isFinite(video.duration)) return;
      // Un pèl abans del final: cercar exactament a `duration` deixa alguns navegadors en negre.
      const time = Math.min(Math.max(0, local * video.duration), video.duration - 0.04);
      // No s'encuen cerques: si el descodificador encara cerca, es desa l'últim temps i prou.
      if (video.seeking) {
        slot.pending = time;
        return;
      }
      if (Math.abs(video.currentTime - time) > 1 / 120) video.currentTime = time;
    };

    const load = (index: number) => {
      const clip = clips[index];
      const slot = slots[index];
      const video = videos.current[index];
      if (!clip || !slot || !video || slot.loading) return;
      slot.loading = true;

      const onSeeked = () => {
        if (slot.pending === null) return;
        const time = slot.pending;
        slot.pending = null;
        video.currentTime = time;
      };
      const onReady = () => {
        slot.ready = true;
        // iOS no pinta un fotograma cercat d'un vídeo que no s'ha reproduït mai.
        video
          .play()
          .then(() => video.pause())
          .catch(() => {})
          .finally(() => {
            if (disposed) return;
            video.style.opacity = "1";
            apply(smoothed);
          });
      };
      video.addEventListener("seeked", onSeeked);
      video.addEventListener("loadeddata", onReady, { once: true });
      cleanups.push(() => {
        video.removeEventListener("seeked", onSeeked);
        video.removeEventListener("loadeddata", onReady);
      });

      fetch((mobile && clip.srcMobile) || clip.src)
        .then((response) => {
          if (!response.ok) throw new Error(`${response.status} ${response.url}`);
          return response.blob();
        })
        .then((blob) => {
          if (disposed) return;
          slot.url = URL.createObjectURL(blob);
          video.src = slot.url;
          video.load();
        })
        // Si el clip no arriba, es queda el pòster: la pàgina es continua llegint.
        .catch((error) => console.error("ScrollVideo: no s'ha pogut carregar el clip", index, error));
    };

    let target = 0;
    let smoothed = 0;
    let raf = 0;
    let lastTime = 0;

    function apply(progress: number) {
      const state = scrubAt(progress, spanList, fade);
      for (let i = 0; i < clips.length; i++) {
        const layer = layers.current[i];
        if (!layer) continue;
        const entering = i === state.index + 1 && state.blend > 0;
        const visible = i === state.index || entering;
        layer.style.visibility = visible ? "visible" : "hidden";
        layer.style.opacity = entering ? String(state.blend) : "1";
        layer.style.zIndex = entering ? "1" : "0";
      }
      for (const i of [state.index, state.index + 1, state.index - 1]) load(i);
      seek(state.index, remapRef.current ? remapRef.current(state.local, state.index) : state.local);
      if (state.blend > 0) seek(state.index + 1, 0);
      onFrameRef.current?.({ progress, ...state });
    }

    const tick = (now: number) => {
      raf = 0;
      // `delta` limitat: després d'una pausa de pestanya no ha de fer un salt.
      const delta = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      smoothed += (target - smoothed) * (1 - Math.exp(-delta * smoothing));
      if (Math.abs(target - smoothed) < 0.0004) smoothed = target;
      apply(smoothed);
      if (smoothed !== target) raf = requestAnimationFrame(tick);
    };

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const travel = rect.height - (window.innerHeight - offsetTop);
      target = travel > 0 ? Math.min(1, Math.max(0, (offsetTop - rect.top) / travel)) : 0;
      if (!raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    measure();
    smoothed = target;
    apply(smoothed);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      disposed = true;
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
      for (const cleanup of cleanups) cleanup();
      for (const [i, slot] of slots.entries()) {
        const video = mounted[i];
        if (video) {
          video.removeAttribute("src");
          video.load();
          video.style.opacity = "0";
        }
        if (slot.url) URL.revokeObjectURL(slot.url);
      }
    };
    // `clips` i `spans` entren per les seves claus: un array nou a cada render no ha de reiniciar-ho tot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, spansKey, sourcesKey, offsetTop, fade, smoothing]);

  return (
    <div
      ref={track}
      style={{ position: "relative", height: reduced ? "auto" : `${(totalScroll(spans) + 1) * 100}svh` }}
    >
      <div
        style={{
          position: reduced ? "relative" : "sticky",
          top: offsetTop,
          height: reduced ? "auto" : `calc(100svh - ${offsetTop}px)`,
          minHeight: reduced ? "100svh" : undefined,
          overflow: "hidden",
        }}
      >
        {background}
        <div role="img" aria-label={label} className={mediaClassName} style={mediaClassName ? undefined : { position: "absolute", inset: 0 }}>
          {clips.map((clip, i) => (
            <div
              key={clip.src}
              ref={(el) => void (layers.current[i] = el)}
              style={{ position: "absolute", inset: 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <picture>
                {clip.posterMobile ? <source media={mobileQuery} srcSet={clip.posterMobile} /> : null}
                {/* <img> i no next/image: el pòster ha de ser exactament el primer fotograma del clip. */}
                <img
                  src={clip.poster}
                  alt=""
                  style={cover}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                />
              </picture>
              {reduced ? null : (
                <video
                  ref={(el) => void (videos.current[i] = el)}
                  muted
                  playsInline
                  preload="none"
                  aria-hidden
                  tabIndex={-1}
                  style={{ ...cover, opacity: 0 }}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ position: mediaClassName ? "absolute" : "relative", inset: mediaClassName ? 0 : undefined, height: "100%" }}>{children}</div>
      </div>
    </div>
  );
}
