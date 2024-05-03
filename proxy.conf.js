const PROXY_CONFIG = [
  {
  context: ['/Api','/doc.view.php','/relatorios'],
  target: 'https://www.bling.com.br/',
  secure:false,
  changeOrigin: true,
  pathRewrite: { '^/': '/' }
  }
  ];
  module.exports = PROXY_CONFIG;
