module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "styled-components",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
  ],
  env: {
    production: {
      only: ["app"],
      plugins: ["lodash"],
    },
    test: {
      plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "dynamic-import-node",
      ],
    },
  },
};
