import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      name: 'Portabl',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve({ exportConditions: ['node'] }),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
  ],
  external: ['axios'],
};
