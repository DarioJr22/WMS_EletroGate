import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Config } from './config';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

//Sem o code

@Injectable({
    providedIn: 'root',
})
export class PedidosService {
    constructor(private coockie: CookieService, private http: HttpClient) {}

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
                Authorization: `Basic ${btoa(
                    Config.clientId + ':' + Config.secretId
                )}`,
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
                let {
                    access_token,
                    expires_in,
                    token_type,
                    scope,
                    refresh_token,
                } = data;

                //Atribui á parâmetros de autenticação em "COOKIES"
                this.coockie.set('access_token', access_token);
                this.coockie.set('token_type', token_type);
                this.coockie.set('refresh_token', refresh_token);
                this.coockie.set('scope', scope);
                this.coockie.set('expires_in', expires_in);
            },
            error: (err) => {
                //Por uma notificação ou algo do tipo aqui.
                console.log(err);
            },
        });
    }

    getPedidos() {
        const urlToken = '/Api/v3/pedidos/vendas';
        const header = new HttpHeaders({
            Authorization: `Bearer ${this.coockie.get('access_token')}`,
        });

        return this.http.get(urlToken, { headers: header });
    }

    getPedidosDetail(code: string) {
        const urlToken = `/Api/v3/pedidos/vendas/${code}`;
        const header = new HttpHeaders({
            Authorization: `Bearer ${this.coockie.get('access_token')}`,
        });

        return this.http.get(urlToken, { headers: header });
    }
}
