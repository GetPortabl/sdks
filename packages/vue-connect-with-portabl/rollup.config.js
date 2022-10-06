import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: './src/index.vue',
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
    nodeResolve(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: true } },
    }),
    vue(),
    terser(),
  ],
  external: ['vue'],
};
