module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://api.vikingship.xyz",  //代理服务器
        changeOrigin: true
      }
    }
  }
}