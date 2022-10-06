import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import cssnano from 'cssnano';
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

const esOutput = {
  file: pkg.module,
  format: 'es',
  plugins: [terser()],
};

export default {
  input: './src/index.ts',
  output: [cjsOutput, cjsMinOutput, esOutput],
  plugins: [
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
      plugins: [
        url({
          url: 'inline', // enable inline assets using base64 encoding
          fallback: 'copy', // fallback method to use if max size is exceeded
        }),
        cssnano({
          preset: 'default',
        }),
      ],
    }),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
    image(),
  ],
  external: ['react'],
};
