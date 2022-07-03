const path = require("path");
const resolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript");
const commonjs = require("rollup-plugin-commonjs");

const resolvePath = function (filePath) {
  return path.join(__dirname, "./", filePath);
};

module.exports = {
  input: resolvePath("src/index.ts"),
  output: {
    file: resolvePath("example/tyro2d.js"),
    format: "es",
    name: "tyro2d",
  },
  plugins: [
    resolve(), // 查找和打包 node_modules 中的第三方模块
    commonjs(), // 将 CommonJS 装为 ES2015 模块
    typescript(),
  ],
};
