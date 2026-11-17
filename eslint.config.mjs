import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // La lògica pura (fases, preus, plataforma de proves, perfils) no depèn del framework.
    files: ['src/lib/**', 'src/components/anatomia/anatomia-fases.ts'],
    ignores: ['src/lib/scroll-scene.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['react', 'react-dom', 'next', 'next/*', 'maplibre-gl'], message: 'Aquest mòdul ha de ser TypeScript pur.' }] },
      ],
    },
  },
  // `.claude/` no és codi de la web: hi pot haver còpies del repositori (worktrees) amb el seu `.next`.
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'coverage/**', 'public/vendor/**', '.claude/**']),
]);
