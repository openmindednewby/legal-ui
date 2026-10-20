import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', dom: 'src/dom/index.ts' },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    'react-native',
    'react-native-svg',
    '@dloizides/ui-feedback',
    '@dloizides/ui-icons',
    '@dloizides/design-tokens',
  ],
});
