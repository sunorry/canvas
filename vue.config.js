const chalk = require('chalk')
const { VUE_APP_ENV, PUBLIC_URL } = process.env

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? PUBLIC_URL : '/',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.GENERATE_SOURCEMAP === 'true',
  crossorigin: 'anonymous',
  css: {
    sourceMap: process.env.GENERATE_CSS_SOURCEMAP === 'true'
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'canvas'
      return args
    })
    config.module.noParse(/lodash/)
    config.module
      .rule('webgl')
      .test(/\.(frag|vert|glsl)$/)
      .use('glsl-shader-loader')
      .loader('glsl-shader-loader')
      .end()
  },
  devServer: {
    open: process.platform === 'darwin',
    hot: true,
    port: process.env.PORT,
    disableHostCheck: process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {}
}
