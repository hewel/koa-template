import commonjs from "rollup-plugin-commonjs";
// import resolve from "rollup-plugin-node-resolve";
// import json from "rollup-plugin-json";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";
import run from "rollup-plugin-run";

const isDev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/server.js",
  cache: true,
  output: {
    file: "build/server/server.js",
    format: "cjs",
  },
  external: ["koa", "koa-router", "koa-bodyparser"],
  plugins: [
    eslint({
      fix: true,
      throwOnError: true,
      include: "src/*",
    }),
    commonjs({
      include: "node_modules/**",
      sourceMap: false,
    }),
    // json(),
    // resolve(),
    terser(),
    isDev && run(),
  ],
};
