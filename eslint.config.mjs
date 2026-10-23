import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // three.js pesa ~250 kB: només hi pot entrar l'escena, que es carrega en diferit.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/anatomia/AnatomiaScene.tsx', 'src/components/anatomia/bici-geometria.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'three', message: "three.js només s'importa des de l'escena (src/components/anatomia)." }],
          patterns: [{ group: ['@react-three/*'], message: "three.js només s'importa des de l'escena (src/components/anatomia)." }],
        },
      ],
    },
  },
  {
    // La lògica pura (fases, preus, plataforma de proves, atzar) no depèn del framework.
    files: ['src/lib/**', 'src/components/anatomia/anatomia-fases.ts'],
    ignores: ['src/lib/scroll-scene.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['react', 'react-dom', 'next', 'next/*', 'three', '@react-three/*'], message: 'Aquest mòdul ha de ser TypeScript pur.' }] },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'coverage/**']),
]);
