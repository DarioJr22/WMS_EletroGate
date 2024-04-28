import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Config } from './config';
import { TokenService } from './token.service';
import { BuscaParams } from '../shared/params';

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

    const urlToken = `/Api/v3/pedidos/vendas?pagina=${params?.pagination?.page}
      &limite=${params?.pagination?.limit}
      &idContato=${params.idContato}
      &idLoja=${params.idLoja}
      &numero=${params.numero}
      &dataInicial=${params?.period?.start}
      &dataFinal=${params?.period?.end}
      &idsSituacoes=${params?.situations}`;

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
}
