import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const cjsOutput = {
  file: pkg.main,
  format: 'cjs',
  name: 'Portabl',
  exports: 'named',
};

const cjsMinOutput = {
  ...cjsOutput,
  file: 'dist/index.min.js',
  plugins: [terser()],
};

const umdOutput = {
  format: 'umd',
  file: 'dist/index.umd.js',
  name: 'Portabl',
  exports: 'named',
  compact: true,
  minifyInternalExports: true,
  globals: {
    portabl: 'Portabl',
  },
};

const umdMinOutput = {
  ...umdOutput,
  file: 'dist/index.umd.min.js',
  plugins: [terser()],
};
const esOutput = {
  file: pkg.module,
  format: 'es',
  plugins: [terser()],
};

export default {
  input: './src/index.ts',
  output: [cjsOutput, cjsMinOutput, umdOutput, umdMinOutput, esOutput],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
    url({
      include: ['**/*.woff2'],
      destDir: './dist/assets',
      limit: Infinity,
    }),
  ],
};
