const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/nameless-housework-notification', // github remote repository name
  assetsDir: 'static',
  outputDir: './ghpages',
});
