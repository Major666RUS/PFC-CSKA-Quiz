module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  css: {
    loaderOptions: {
      stylus: {
        data: `
          @import 'vuetify/src/stylus/app.styl'
        `
      }
    }
  }
}