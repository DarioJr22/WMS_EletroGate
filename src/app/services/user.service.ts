import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Config } from './config';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

//Sem o code

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private stateSubject = new BehaviorSubject<string>('');
  private codeSubject = new BehaviorSubject<string>('');

  constructor(
    private tokenService: TokenService,
    private router: Router,
    // private coockie: CookieService,
    private actRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  async getAccessToken(code: string): Promise<void> {
    //Obtem o token de acesso
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

    return new Promise<void>((resolve, reject) => {
      this.http.post(urlToken, body.toString(), header).subscribe({
        next: (data: any) => {
          let { access_token, expires_in, token_type, scope, refresh_token } =
            data;

          //Atribui á parâmetros de autenticação em "COOKIES"
          this.tokenService.setLocalStorage('access_token', access_token);
          this.tokenService.setLocalStorage('token_type', token_type);
          this.tokenService.setLocalStorage('refresh_token', refresh_token);
          this.tokenService.setLocalStorage('scope', scope);
          this.tokenService.setLocalStorage('expires_in', expires_in);
          // this.coockie.set('access_token', access_token);
          // this.coockie.set('token_type', token_type);
          // this.coockie.set('refresh_token', refresh_token);
          // this.coockie.set('scope', scope);
          // this.coockie.set('expires_in', expires_in);
          this.router.navigate(['/opcoes']);

          resolve();
        },
        error: (err) => {
          this.router.navigate(['/']);
          this.tokenService.limparLocalStorage();
          reject(err);
        },
      });
    });
  }

  async getAuthCode() {
    const token = await this.tokenService.getToken();
    debugger;
    let { code, state } = this.actRoute.snapshot.queryParams;
    if (!code && !state) {
      // Fluxo de autorização inicial
      window.location.href = Config.UrlLogin;
    } else {
      this.tokenService.setLocalStorage('code', code);
      this.tokenService.setLocalStorage('state', state);

      await this.getAccessToken(code);
    }
  }
}
