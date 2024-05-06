import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Config } from './config';
import { TokenService } from './token.service';
import { BuscaParams } from '../shared/params';
import { Observable } from 'rxjs';

interface JsonElement {
  [key: string]: any;
  "@attributes"?: {[key: string]: string};
}
//Sem o code

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(
    // private cookie: CookieService,
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  getAccessToken(code: string) {
    //Obtem o token de acesso
    //Como o proxy foi configurado com o base url da bling, então só é necessário por o caminho da req

    let urlToken = '/Api/v3/oauth/token';
    //Configura o cabeçalho de autenticação
    //Esse autorization é encodado em base64 o clientId e secretId separado por ':'
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '1.0',
        Authorization: `Basic ${btoa(Config.clientId + ':' + Config.secretId)}`,
      }),
    };

    //Configura os parâmetros da requisição
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code);

    // Envia a requisição
    /* {
    //RETORNO
    "access_token": "fb1af838eedf740d9ca7968b055af84dfcd5226c",
    "expires_in": 21600,
    "token_type": "Bearer",
    "scope": "98309 98310 98313 199272829 220621674 318257556 318257570 363921589 363921592 791588404",
    "refresh_token": "b794c0cd9d1d8071a059e918ed4a03128a924c55"
} */
    this.http.post(urlToken, body.toString(), header).subscribe({
      next: (data: any) => {
        //Desestrutura o retorno em variáveis
        let { access_token, expires_in, token_type, scope, refresh_token } =
          data;

        //Atribui á parâmetros de autenticação em "COOKIES"
        this.tokenService.setLocalStorage('access_token', access_token);
        this.tokenService.setLocalStorage('token_type', token_type);
        this.tokenService.setLocalStorage('refresh_token', refresh_token);
        this.tokenService.setLocalStorage('scope', scope);
        this.tokenService.setLocalStorage('expires_in', expires_in);
      },
      error: (err) => {
        //Por uma notificação ou algo do tipo aqui.
        console.log(err);
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
    });
  }

  getPedidos(params: BuscaParams) {
    const token: any = this.tokenService.getToken();

    let urlToken = `/Api/v3/pedidos/vendas?pagina=${params?.pagination?.page}&limite=${params?.pagination?.limit}&idContato=${params.idContato}&numero=${params.numero}&dataInicial=${params?.period?.start}&dataFinal=${params?.period?.end}&idsSituacoes=${params?.situations}`;
    params.idLoja != null
      ? (urlToken += `&numerosLojas=${params.idLoja}`)
      : null;
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(urlToken, { headers: header });
  }

  getPedidosDetail(id: number) {
    const urlToken = `/Api/v3/pedidos/vendas/${id}`;
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(urlToken, { headers: header });
  }

  getModule() {
    const url = '/Api/v3/situacoes/modulos';
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(url, { headers: header });
  }

  getSituations(id: number) {
    const url = `/Api/v3/situacoes/modulos/${id}`;
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(url, { headers: header });
  }

  putOrderSit(idOrder: number, idSituation: number) {
    const url = `/Api/v3/pedidos/vendas/${idOrder}/situacoes/${idSituation}`;
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.patch(
      url,
      {
        idPedidoVenda: idOrder,
        idSituacao: idSituation,
      },
      { headers: header }
    );
  }

  handleError(error: any) {
    let erro = error

    if(error.error.error){
      let titulo = error.error.error.description;
      let fields = error.error.error.fields
      ? error.error.error.fields.map((i: any) => `- ${i.msg} <br>`)
      : error.error.error.message ? error.error.error.message :
      'Sem campos';

      erro =  `${titulo}
      <br>
        Campo(s):
      <br>
      ${fields}`;

    if(error.error.error.type == 'invalid_token'){
      //TODO - Inserir notificação aqui e view de notificação em opções
      this.tokenService.limparLocalStorage();
      this.router.navigate(['/']);
    }
    }


    return erro
  }


  getNF(idNfe: number) {
    const url = `/Api/v3/nfe/${idNfe}`;
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });
    return this.http.get(url, { headers: header });
  }

  getDanfe(danfeURL: string) {
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    })
    //Separa a parte da url que contem a extensão apropriada de acordo com a configuaração do proxy
    const urlTransf = danfeURL.split('.br')[1]
    //Busca a página em formato de blob
    return this.http.get(urlTransf, { headers: header, responseType: 'text' });
  }

  getXml(xmlURL: string) {
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    })
    //Separa a parte da url que contem a extensão apropriada de acordo com a configuaração do proxy
    const urlTransf = xmlURL.split('.br')[1]
    console.log(urlTransf);

    //Busca a página em formato de blob
    return this.http.get(urlTransf, { headers: header, responseType: 'text' });
  }




  decoderBlob(blob: Blob) {
   //Lê o blob e retorna em uma promise
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result)
      };

      reader.readAsDataURL(blob)
      if (reader.error) {
        reject(reader.error)
      }
    });
  }


  gerarDanfeSimplificadoHtml(
    nomeFantasia: string,
    svgBarcode?: string,
    codigo?:string,
    protocolo?:string,
    tipo?:string,
    numero?:string,
    serie?:string,
    dataEmissao?:string,
    qtde?:string,
    doc?:string,
    destIE?:string,
    nome?:string,
    endereco?:string,
    observacao?:string
  ):Observable<any> {
    let template = `
    <!DOCTYPE html>
      <html>
      <head>
      <title>Bling - DANFE Simplificado</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="noindex" />
      <script src="https://www.bling.com.br/libs/jquery-1.9.1.min.js" type="text/javascript"></script>
      <link rel="stylesheet" type="text/css" href="https://www.bling.com.br/styles/danfe.css" />
      <link rel="stylesheet" type="text/css" href="https://www.bling.com.br/styles/danfe.simplificado.css" />
      <link rel="icon" type="image/x-icon" href="https://www.bling.com.br/images/favicons/logo-bling-dark-32.ico" />
      <style>
      .p-button:focus {
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #156401, 0 1px 2px 0 rgb(0, 0, 0);
      }

        .p-button {
          cursor: pointer;
          color: #fff;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          background: #22c55e;
          border: 1px solid #22c55e;
        }
        .p-button:hover {
          background: #22c55e;
          border: 1px solid #22c55e;
      }

      @media print{
        .p-button {
          visibility: hidden;
        }
      }
      </style>
      </head>
      <body>

      <div id="container">
    <button class="p-button" style="margin: 2rem" onclick="window.print()">
    IMPRIMIR
    </button>
      <table>
      <tr>
      <td colspan="2" style="text-align:center;">
      <hr/>
      <strong>DANFE Simplificado - Etiqueta</strong>
      <hr/>
      </td>
      </tr>
      <tr>
      <td colspan="2">
      <table>
      <tr>
      <td width="150">
      <img src="data:image/jpeg;base64,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" style="max-height: 100px; max-width: 120px;" class="center-image img-responsive" />
      </td>
      <td>

      ${
        /* Nome do remetente */
        nomeFantasia
      }
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td colspan="2" style="text-align:center;">
      <hr/>
      <div style="text-align:center;">

      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      ${svgBarcode}
      </div>
      </td>
      </tr>
      <tr>
      <td colspan="2" style="word-wrap:break-word;text-align:center;">
      ${this.maskKey(codigo)}
      <p class="caption">Protocolo de autorização de uso</p>
      <span>${protocolo}</span><br/>
      TIPO: ${tipo} |
      Nº NFe: ${numero} |
      SERIE: ${serie}<br/>
      Data de emissão: ${dataEmissao} <hr/>
      </td>
      </tr>
      <tr>
      <td>QTD. TOTAL DE ITENS</td>
      <td style="text-align:right">${qtde}</td>
      </tr>
      <tr>
      <td colspan="2" style="text-align:center;"><hr/><strong>CONSUMIDOR</strong></td>
      </tr>
      <tr>
      <td colspan="2" style="text-align:center;">CNPJ/CPF/ID Estrangeiro:
      ${doc + ' ' + destIE + ' ' + nome}<br/>
      ${endereco}</td>
      </tr>
      <tr>
      </tr>
      <tr><td colspan="2"><hr/></td></tr>
      <tr>
      <td colspan="2"><strong>INFORMAÇÕES ADICIONAIS DE INTERESSE DO CONTRIBUINTE</strong></td>
      </tr>
      <tr>
      <td colspan="2">${observacao}</td>
      </tr>
      </table>
      </div>

      </body>
      </html>

    `
 return new Observable((subscriber) => {
    subscriber.next(template)
  })

  }


  parseXml(xml: string): any {
    const parser = new DOMParser();
    console.log(xml);

    const xmlDoc = parser.parseFromString(xml, "application/xml");
    return this.xmlToJson(xmlDoc.documentElement);
  }

  private xmlToJson(xml: any): any {
    let obj: any = {};

    // Tratando apenas elementos e garantindo que são elementos com filhos
    if (xml.nodeType === 1 && xml.hasChildNodes()) {
      const children = xml.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === 3) {  // Nó de texto
          const text = child.nodeValue.trim();
          if (text.length > 0) obj.text = (obj.text ? obj.text + ' ' : '') + text;  // Concatena textos se necessário
        } else if (child.nodeType === 1) {  // Nó de elemento
          const childJson = this.xmlToJson(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(childJson);
          } else {
            obj[child.nodeName] = childJson;
          }
        }
      }
    }
    return obj;
  }

  maskKey(key?: string) {
  //Aplicação de placeholders baseados no regex de dígitos da chave
  let keyMask = key;
   return keyMask?.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11");
  }

  maskDoc(docN?:string,docType?:'pj' | 'pf' ){
   if(docType == 'pj'){
    return docN?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
   }else{
    return docN?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
   };//122.037.294-30
  }




}// <script defer src="https://static.cloudflareinsights.com/beacon.min.js/vedd3670a3b1c4e178fdfb0cc912d969e1713874337387" integrity="sha512-EzCudv2gYygrCcVhu65FkAxclf3mYM6BCwiGUm6BEuLzSb5ulVhgokzCZED7yMIkzYVg65mxfIBNdNra5ZFNyQ==" data-cf-beacon='{"rayId":"87d21feacc506f86","version":"2024.4.1","token":"182ecdcfb8194b148324a79d58192b9b"}' crossorigin="anonymous"></script>
