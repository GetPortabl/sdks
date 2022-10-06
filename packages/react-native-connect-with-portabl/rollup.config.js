import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: './src/index.tsx',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      name: 'Portabl',
      exports: 'named',
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
    image(),
    url({
      include: ['**/*.woff2'],
      destDir: './dist/assets',
      limit: Infinity,
    }),
    terser(),
  ],
  external: [
    'react',
    'react-native',
    'react/jsx-runtime', // 👈 this to be added
    'react/jsx-dev-runtime',
  ],
};
