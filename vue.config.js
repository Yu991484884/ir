// const {defineConfig} = require('@vue/cli-service')
// module.exports = defineConfig({
//     transpileDependencies: true,
//     lintOnSave: false
// })


const { defineConfig } = require('@vue/cli-service');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "netlify.toml", to: "" }, // 从项目根目录复制到 dist/
        ],
      }),
    ],
  },
});
