'use client';

// Escena 3D de l'anatomia: la bici muntada a la portada, s'esbotza en fer scroll, es recorre
// peça per peça (la que s'explica queda en color i la resta, en gris) i es torna a muntar.

import { PerformanceMonitor, Preload } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { CanvasTexture, Color, MathUtils, Vector3, type Mesh, type PerspectiveCamera } from 'three';
import { ORDRE_PECES, obertura, pasActiu } from './anatomia-fases';
import { crearBici, MIDES } from './bici-geometria';

export type AnatomiaSceneProps = { progress: RefObject<number>; reducedMotion: boolean };

const SMOOTHING = 4.5;
const MAX_DELTA = 1 / 30; // una pausa de pestanya no ha de fer saltar l'animació
const FOV = 30;
/** Amb moviment reduït es mostra la bici oberta, amb totes les peces a la vista. */
const PROGRES_ESTATIC = 0.29;
const GRIS = new Color('#dde1e6');

// Temporals reutilitzats: zero objectes nous per fotograma.
const objectiu = new Vector3();
const centreObert = new Vector3();
const CENTRE_BICI = new Vector3(0, 0.5, 0);

/** Ombra difusa pintada una vegada (ContactShadows re-renderitzaria l'escena a cada fotograma). */
function useOmbra() {
  return useMemo(() => {
    // Quadrat amb un degradat circular que arriba a zero abans de les vores; l'el·lipse la fa
    // l'escala del pla.
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(18,20,23,0.3)');
      gradient.addColorStop(0.55, 'rgba(18,20,23,0.08)');
      gradient.addColorStop(1, 'rgba(18,20,23,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new CanvasTexture(canvas);
  }, []);
}

function Coreografia({ progress, reducedMotion }: AnatomiaSceneProps) {
  const peces = useMemo(() => crearBici(), []);
  const ombra = useRef<Mesh>(null);
  const textura = useOmbra();
  const suau = useRef(reducedMotion ? PROGRES_ESTATIC : (progress.current ?? 0));
  const focus = useRef(0);
  const ressalt = useRef(peces.map(() => 0));
  const { invalidate } = useThree();

  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [invalidate]);

  // Quan canvia la mida o el dpr (el PerformanceMonitor l'ajusta uns segons després de carregar),
  // el canvas s'esborra: cal tornar a pintar, o la bici no es veu fins al primer scroll.
  const { width, height } = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  useEffect(() => {
    invalidate();
  }, [invalidate, width, height, dpr]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_DELTA);
    const target = reducedMotion ? PROGRES_ESTATIC : (progress.current ?? 0);
    suau.current = MathUtils.damp(suau.current, target, SMOOTHING, delta);
    let quiet = Math.abs(suau.current - target) < 0.0004;
    if (quiet) suau.current = target;
    const p = suau.current;

    const oberta = obertura(p);
    const pas = pasActiu(p);
    const pecaActiva = pas >= 0 && pas < ORDRE_PECES.length ? ORDRE_PECES[pas] : null;

    focus.current = MathUtils.damp(focus.current, pecaActiva ? 1 : 0, 6, delta);
    if (Math.abs(focus.current - (pecaActiva ? 1 : 0)) > 0.001) quiet = false;

    centreObert.copy(CENTRE_BICI);
    peces.forEach((peca, i) => {
      const activa = peca.peca === pecaActiva;
      ressalt.current[i] = MathUtils.damp(ressalt.current[i] ?? 0, activa ? 1 : 0, 7, delta);
      if (Math.abs((ressalt.current[i] ?? 0) - (activa ? 1 : 0)) > 0.001) quiet = false;
      const h = ressalt.current[i] ?? 0;

      // Cap on va: la posició esbotzada, i la peça que s'explica s'apropa una mica a la càmera.
      peca.grup.position.copy(peca.desplacament).multiplyScalar(oberta);
      peca.grup.position.z += 0.06 * h;

      // La que no s'explica es torna grisa quan hi ha una peça en focus.
      // La que no s'explica es torna grisa quan hi ha una peça en focus. (Encendre l'activa amb
      // taronja tenyia de lila el quadre blau: el contrast amb el gris ja la fa destacar.)
      const apagat = focus.current * (1 - h) * 0.85;
      for (const { material, base } of peca.materials) material.color.copy(base).lerp(GRIS, apagat);

      if (activa) centreObert.copy(peca.centre).add(peca.grup.position);
    });

    if (ombra.current) ombra.current.scale.set(MIDES.llarg * (1.25 + oberta * 0.5), 0.55 + oberta * 0.6, 1);

    // Càmera: de perfil a la portada, tres quarts quan s'obre, i s'apropa a la peça activa.
    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    const aspect = width / height;
    const ample = aspect > 1.05;
    const amplada = MathUtils.lerp(MIDES.llarg, MIDES.llarg * 1.55, oberta) / (ample ? 0.52 : 0.8);
    const radi =
      (amplada / 2 / (Math.tan(MathUtils.degToRad(FOV / 2)) * Math.min(aspect, 1.6))) * MathUtils.lerp(1, 0.86, focus.current);
    const azimut = MathUtils.lerp(0.04, 0.62, oberta);
    const elevacio = MathUtils.lerp(0.06, 0.32, oberta);
    objectiu.copy(CENTRE_BICI).lerp(centreObert, focus.current * 0.3);
    camera.position.set(
      objectiu.x + Math.sin(azimut) * radi * Math.cos(elevacio),
      objectiu.y + Math.sin(elevacio) * radi,
      objectiu.z + Math.cos(azimut) * radi * Math.cos(elevacio),
    );
    camera.lookAt(objectiu);

    // A l'escriptori la bici va a la dreta (el text és a l'esquerra); al mòbil, a dalt.
    if (ample) camera.setViewOffset(width, height, -width * 0.24, 0, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.28, width, height);

    if (!quiet) invalidate();
  });

  return (
    <>
      {peces.map((peca) => (
        <primitive key={peca.peca} object={peca.grup} />
      ))}
      <mesh ref={ombra} rotation-x={-Math.PI / 2} position={[0, 0.0005, 0]}>
        <planeGeometry />
        <meshBasicMaterial map={textura} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

export default function AnatomiaScene({ progress, reducedMotion }: AnatomiaSceneProps) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      camera={{ position: [0, 0.6, 4], fov: FOV, near: 0.05, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 150 } }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} flipflops={3} onFallback={() => setDpr(1)} />
      {/* Sense mapa d'entorn: el prefiltrat PMREM bloquejaria la pàgina prop d'un segon. */}
      <hemisphereLight args={['#ffffff', '#b9c2cc', 1.25]} />
      <directionalLight position={[2.5, 4, 3.5]} intensity={2.4} />
      <directionalLight position={[-3, 2, -2.5]} intensity={1.4} color="#dbe6ff" />
      <directionalLight position={[0, -1.5, 3]} intensity={0.35} />
      <Coreografia progress={progress} reducedMotion={reducedMotion} />
      <Preload all />
    </Canvas>
  );
}
