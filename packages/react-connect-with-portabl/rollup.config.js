import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const PKG_NAME = 'Portabl.connect';

export default {
  input: './src/index.tsx',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      name: PKG_NAME,
      exports: 'named',
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
    terser(),
  ],
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
};
