const PROXY_CONFIG = [
  {
  context: ['/Api'],
  target: 'https://www.bling.com.br/',
  secure:false,
  changeOrigin: true,
  pathRewrite: { '^/': '' }
  }
  ];
  module.exports = PROXY_CONFIG;
