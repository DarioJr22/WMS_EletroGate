const PROXY_CONFIG = [
  {
  context: ['/Api','/doc.view.php','/relatorios'],
  target: 'https://www.api.bling.com.br/',
  secure:false,
  changeOrigin: true,
  pathRewrite: { '^/': '/' }
  },
  //bling-storage-replica.s3.us-east-1.amazonaws.com
  {
    context:['/bling'],
    target:'https://bling-storage-replica.s3.us-east-1.amazonaws.com',
    secure:false,
    changeOrigin:true,
    pathRewrite:{'^/':'/'}
  }
  ];
  module.exports = PROXY_CONFIG;
