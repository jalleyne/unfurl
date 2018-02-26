// Rollup plugins
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
// import eslint from 'rollup-plugin-eslint'
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default {
  input: "index.js",
  output: {
    name: "unfurl.js",
    format: "cjs",
    file: "dist/index.js"
  },
  external: Object.keys(pkg.dependencies || {}).concat(
    Object.keys(pkg.peerDependencies || {})
  ),
  plugins: [
    resolve({
      jsnext: true,
      browser: false,
      extensions: [".js", ".json"]
    }),
    commonjs({
      exclude: "node_modules"
    }),
    // eslint({
    // exclude: ['*.js']
    // }),
    json(),
    babel({
      runtimeHelpers: true,
      exclude: ["node_modules/**", "*.json"]
    })
  ]
};
