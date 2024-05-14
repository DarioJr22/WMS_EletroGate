
//TODO: Upgrade pra configuração de código de barras
export class BarCodeConfig {
  constructor() {

  }
  public static get config() {
    return {
      width: 1,
      height: 50,
      displayValue: false
    };
  }
}




export function templatebarcode(printContents:any,number?:any) {
  let divspace = ''


 const template = `<html>
  <header>
    <title>Impressão de Etiquetas</title>
    <style>
    .wrapper-40x25 {
      width: 40mm;
      height: 24mm;
      background-color: #fff;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

  .barcode-holder {
    text-align: center;
    vertical-align: middle;
    padding-top: 0.5mm;
    height: 30px;

  }

  .titleSKU {
    font-size: 10px;
    font-weight: 700;
    text-align: left;
    max-height: 6mm;

  }

  .barcode-holder {
    text-align: center;
    vertical-align: middle;
    padding-top: 0.5mm;
    height: 30px;

  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    font-weight: 700;
    font-size: 13px;
  }

  body{
    font-family: 'Inter var', sans-serif;
  }

  .spacer {
    margin: 0;
    page-break-after: always;
  }
    </style>
  </header>
  <body>


  ${printContents}



  ${
    number == 2  ?
    '<div class="space" style="height: 100vh"></div> ' +
    '<div class="space" style="height: 100vh"></div>' : ''
  }

  </body>
  </html>`

  return template
}

