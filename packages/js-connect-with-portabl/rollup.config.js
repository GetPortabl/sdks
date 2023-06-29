import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const PKG_NAME = 'Portabl.connect';

const cjsOutput = {
  file: pkg.main,
  format: 'cjs',
  name: PKG_NAME,
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
  name: PKG_NAME,
  exports: 'named',
  compact: true,
  minifyInternalExports: true,
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
