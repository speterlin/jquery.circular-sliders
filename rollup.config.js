import pkg from "./package.json";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.js';
const outputName = 'JqueryCircularSliders';
const banner =
`/*
 * JqueryCircularSliders.js
 * ${pkg.description}
 * ${pkg.repository.url}
 * v${pkg.version}
 * ${pkg.license} License
 */
`;

export default [
  {
    input: input,
    external: ['jquery'],
    output: {
      name: outputName,
      file: pkg.main,
      format: 'umd',
      banner: banner,
      globals: {
        jquery: '$'
      },
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  {
    input: input,
    external: ['jquery'],
    output: {
      name: outputName,
      file: pkg.main.replace(/\.js$/, ".min.js"),
      format: "umd",
      globals: {
        jquery: '$'
      },
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },
  {
    input: input,
    external: ['jquery'],
    output: {
      file: pkg.module,
      format: 'es',
      banner: banner,
      globals: {
        jquery: '$'
      },
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
