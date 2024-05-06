const PROXY_CONFIG = [
  {
  context: ['/Api','/doc.view.php','/relatorios'],
  target: 'https://www.bling.com.br/',
  secure:false,
  changeOrigin: true,
  pathRewrite: { '^/': '/' }
  },
  //https://bling-storage.s3.sa-east-1.amazonaws.com/bling/104039974/etiqueta/17148555223505/etiqueta.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIATCLMSGFXX45OQA7D%2F20240504%2Fsa-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240504T204524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXNhLWVhc3QtMSJHMEUCIDbn%2BKz9ieINFEvjIhtEpDqJBOIAf3z%2ByA7kyNaBUJulAiEA9EkApp0YBqTsgMrIekp7QLvOnXI9jjbMk%2F5KC2dUQhcq8AMIlP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyMTEyMTc5NTMxMzUiDMR16rzoe%2BY4FfOGtCrEA1X4ZMbEMGRcTeFux3AEEh7NgChOiWZb%2FonC4M%2B%2FVoTgJDzzDqKXXRFv%2BKA60KdVQ9pZkAakNMNzibZrmsGGnR7NqeP3mO2Pv%2BV8IxE4YmAhBWd7IPFckm1AvKHXhHV%2B%2FZ2B7%2BSAobJrVHQn8MznMRSHBv805Y%2FiugYt%2BUt%2Fmf4h3cURv9EAsHNQgHJ28HcZWnKeVYcQt9iXoq%2F1CfeH0zm%2FmjTCWw%2F7pfImX1zjMSRR57nMfS16Gf5A2nhZba1CJd4joQjrb3SUPZ4HRTOr4YEnYVWwThDDRHDOE1B%2BTvUkRmiq30Mr78B1E3Ml5QDi%2FSCHOqYCYkZrfh0Ylyk3mTUnyeiXUsVu%2FNIVvEsMcQLfiH8xeEA4vcz2eKNmLzQ2g7e%2FWcJl2h96tra4lT0fBRKUCg%2FxGdfKNrIM%2BdaL84Zs2%2BCtp9DAewtxsnuhq9dSMpIIvxSAISdN55%2BYpgW7kGJ7BCvOzzMngyh1WfZbFrRmMYvt88tu1xhO6pENL6onPsAKqDuebnYq%2FLBgFN3iYdxRkKMtIAq9JOS7FNCFbTihjsXUnVhU4lzsO8HSlSbvLCmZewbPxZn9q%2B1tDQE9jAR0ej4hMKD%2B2bEGOqUBUE4Vcb6t0OeTtt9HuhIEloFHyTlExw5K6yb5HqJQYKvEUosS7dT%2FysVBpGYdNThWc5WAAlobKdJiIWTJJ5wSOuQx4%2FB6arXzIsGhuk1uF6mlA8ZaNwga%2BkzCjSHEzGkESKHbtDZUTeRZpoTgTdTwhtUl31dXYjjR6EeFeomj3fD%2FFPSzir978LN%2BOQI69%2BkEyvSVZyki2OxwrtaJ7se%2BsqUBquhD&X-Amz-SignedHeaders=host&x-id=GetObject&X-Amz-Signature=c4f1beff938ee0306b6083bdbc1da19e04e6b5adc801ddcba4eb2e2f89313953
  {
    context:['/bling'],
    target:'https://bling-storage.s3.sa-east-1.amazonaws.com',
    secure:false,
    changeOrigin:true,
    pathRewrite:{'^/':'/'}
  }
  ];
  module.exports = PROXY_CONFIG;
