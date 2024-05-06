import html2canvas from "html2canvas"
import * as JsBarcode from "jsbarcode"
import { LineCapStyle, PDFDocument, PDFFont, PDFPage, rgb ,StandardFonts} from "pdf-lib"



export default class Utils{

  eletroGateLogo:any = "data:image/jpeg;base64,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"
  static  defineWidthBarCode(code:any) {
    //Se o tamanho do código for maio do que 8 caractéres então o tamanho será 0.5
    let width = code.length >= 10 ? 0.5 : 1
    return width
  }

 static maskKey(key?: string) {
    //Aplicação de placeholders baseados no regex de dígitos da chave
    let keyMask = key;
     return keyMask?.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11");
    }

 static async generateBarcode(code:any){
  const canvas = document.createElement('canvas')
  JsBarcode(canvas,code, {
    format: "CODE128",
    displayValue: false,
    lineColor: "#000000",
    width: 3,
    height: 45,
    textMargin: 0
  } )

  return canvas.toDataURL('image/png')
} /**/

static estimateTextWidth(text: string, fontSize: number) {
  const averageCharWidth = fontSize * 0.6; // Ajuste conforme necessário para a fonte específica
  return text.length * averageCharWidth;
}

static drawDashedLine(page:PDFPage, startX: number, startY: number, endX: number, endY: number, dashLength = 10, spaceLength = 2) {
  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const n = Math.floor(length / (dashLength + spaceLength));
  for (let i = 0; i < n; i++) {
      const x1 = startX + (i * (dashLength + spaceLength)) / length * (endX - startX);
      const y1 = startY + (i * (dashLength + spaceLength)) / length * (endY - startY);
      const x2 = x1 + (dashLength / length * (endX - startX));
      const y2 = y1 + (dashLength / length * (endY - startY));
      page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          color: rgb(0.5, 0.5, 0.5),
          thickness: 1
      });
  }
}

static drawTextWithLineBreaks(page: PDFPage, text: string, options: { x: number, y: number, size: number, maxWidth: number, lineHeight: number, color: any }) {
  const words = text.split(' ');
  let line = '';
  let currentY = options.y;

  words.forEach(word => {
    const testLine = line + word + ' ';
    const lineWidth = this.estimateTextWidth(testLine, options.size);
    if (lineWidth > options.maxWidth && line !== '') {
      page.drawText(line, { x: options.x, y: currentY, size: options.size, color: options.color });
      line = word + ' ';
      currentY -= options.lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line.length > 0) {
    page.drawText(line, { x: options.x, y: currentY, size: options.size, color: options.color });
  }
}




static async addImgeToPDF(data:any,blob:Blob){
    const eletroGateLogo = "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"

  /*   //Criara um nó de invisivel para inserir o conteúdo do html
    const container = document.createElement('div');

    container.innerHTML = html;
    document.body.appendChild(container)

    //Aplica estilo só se precisar
    //const style = document.createElement('style');
    //style.innerHTML = ''


    //Usa o html2canvas para printar o bixo
    const canvas = await html2canvas(container,{logging:true,scale:4});

    //Remove o nó invisível
    document.body.removeChild(container);
 */
    //Carrega o pdf
    const arrayBuffer = await blob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageHeight = pdfDoc.getPage(0).getHeight(); // 425
    const pageWidth = pdfDoc.getPage(0).getWidth(); // 284
    const hevelticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    console.log(pageHeight,pageWidth);
    //TODO - Carregar fonte

    //Define uma página nova
    const newPage = pdfDoc.insertPage(1,[pageWidth,pageHeight]);

    //Carrega uma linha
    /* newPage.drawLine({
      start: { x: 10, y: 415 },
      end: { x: 274, y: 415 },
      color: rgb(0.5, 0.5, 0.5),
      thickness: 1,
      lineCap: LineCapStyle.Butt
  }); */
  this.drawDashedLine(newPage, 10, 415, 274, 415,5);

this.drawDashedLine(newPage, 10, 395, 274, 395,5);
    //Carrega o titulo da página
    newPage.drawText("DANFE Simplificado - Etiqueta",
    {
      x: pageWidth/3 - 10,
      y: 402,
      size: 8,
      color: rgb(0, 0, 0),
      font: hevelticaBold
    }

    )

    //Carrega logo
    //Retira o começo
    const imgUint8Array = Uint8Array.from(atob(eletroGateLogo), c => c.charCodeAt(0));
    let img = await pdfDoc.embedJpg(imgUint8Array);
    newPage.drawImage(img,{
      x:12,
      y:335,
      width:95,
      height:55
    })



    let nomeFantasia = data.nomeFantasia.split('\n')
    let linePosition = 375
    nomeFantasia.forEach((element:string) => {

      newPage.drawText(element,
        {
          x: (pageWidth/2) - 20,
          y:linePosition,
          size: 7,
          color: rgb(0, 0, 0),
        }

        )
        linePosition -= 10
    })
    //Carre ga linha de baixo




  this.drawDashedLine(newPage, 10, 330, 274, 330,5);
    //Obter o código de barras
    // Converte a Data URL em uma Uint8Array
    const barcodeDataUrl = await this.generateBarcode(data.codigo);
    const pngImageBytes = Uint8Array.from(atob(barcodeDataUrl.split(',')[1]), c => c.charCodeAt(0));
    const pgnImage = await pdfDoc.embedPng(pngImageBytes);

    newPage.drawImage(pgnImage, {
      x: 23,
      y: 280,
      width: 240,
      height: 45
    })

    //Carrega a chave
    newPage.drawText(`${this.maskKey(data.codigo)}`,
        {
          x: 38,
          y:277,
          size: 8,
          color: rgb(0, 0, 0),
        }
      )

    //Carrega a Protocolo de autorização label
    newPage.drawText(`Protocolo de autorização de uso`,
        {
          x: 97,
          y:267,
          size: 8,
          color: rgb(0, 0, 0),
        }
      )

    //Carrega a Protocolo de autorização value + data
    newPage.drawText(`${data.protocolo}`,
        {
          x: 81,
          y:257,
          size: 8,
          color: rgb(0, 0, 0),
        }
      )

    //Carrega Tipo | Nfe | Serie
    newPage.drawText(`TIPO: ${data.tipo} | N° NFe: ${data.numero} | SERIE: ${data.serie}`,
      {
        x: 75,
        y:247,
        size: 8,
        color: rgb(0, 0, 0),
      }
    )

    //Data de emissao
    newPage.drawText(`Data de emissão: ${data.dataEmissao}`,
    {
      x: 97,
      y: 237,
      size: 8,
      color: rgb(0, 0, 0),
    }
  )


this.drawDashedLine(newPage, 10, 233, 274, 233,5);

    //QTD. TOTAL DE ITENS  - Label + Value
      newPage.drawText(`QTD. TOTAL DE ITENS                                                                        ${data.qtde} `,
      {
        x: 10,
        y: 223,
        size: 8,
        color: rgb(0, 0, 0),
      }
    )


  this.drawDashedLine(newPage, 10, 216, 274, 216,5);

    //Consumidor - Label
    newPage.drawText(`CONSUMIDOR`,
      {
        x: 107,
        y:206,
        size: 8,
        color: rgb(0, 0, 0),
        font: hevelticaBold
      }
    )




    Utils.drawTextWithLineBreaks(newPage, `CNPJ/CPF/ID Estrangeiro: ${data.doc} IE: ${data.destIE != null ? data.destIE : 'ISENTO'} ${data.nome} ${data.endereco}`, {
      x: 10,
      y: 196,
      size: 7,
      maxWidth: 284, // Largura máxima do texto antes de quebrar a linha
      lineHeight: 10, // Altura da linha
      color: rgb(0, 0, 0)
    });
    //CNPJ/CPF/ID Estrangeiro:
  /*   newPage.drawText(,
    {
      x: 23,
      y:196,
      size: 8,
      color: rgb(0, 0, 0),
    }
  )

      newPage.drawText(`${data.nome}`,
      {
        x: 20,
        y:186,
        size: 8,
        color: rgb(0, 0, 0),
      }
    )


      //Endereco
      newPage.drawText(`${data.endereco}`,
      {
        x: 30,
        y:176,
        size: 8,
        color: rgb(0, 0, 0),
      }
    ) */


    this.drawDashedLine(newPage, 10, 167, 274, 167,5);

    newPage.drawText(`INFORMAÇÕES ADICIONAIS DE INTERESSE DO CONTRIBUINTE`,
    {
      x: 10,
      y:157,
      size: 8,
      color: rgb(0, 0, 0),
      font: hevelticaBold
    }
    )

    let dataReplacedObs = data.observacao.replace(/<br \/>/gi, " ");

    Utils.drawTextWithLineBreaks(newPage, `${dataReplacedObs}`, {
      x: 10,
      y: 147,
      size: 7,
      maxWidth: 284, // Largura máxima do texto antes de quebrar a linha
      lineHeight: 10, // Altura da linha
      color: rgb(0, 0, 0)
    });



    //Serialize the pdf documente to bytes
    const pdfBytes = await pdfDoc.save();

    //Convert the bytes to blob

    return new Blob([pdfBytes],{type:'application/pdf'})
  }





  }
