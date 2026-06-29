import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Config } from './config';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        'enable-jwt': '1',
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

  // Renova o token de acesso usando o refresh_token (mantendo o header enable-jwt).
  refreshToken(): Observable<string> {
    const urlToken = '/Api/v3/oauth/token';
    const refreshToken = localStorage.getItem('refresh_token') ?? '';

    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '1.0',
        Authorization: `Basic ${btoa(Config.clientId + ':' + Config.secretId)}`,
        'enable-jwt': '1',
      }),
    };

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return this.http.post(urlToken, body.toString(), header).pipe(
      map((data: any) => {
        const { access_token, expires_in, token_type, scope, refresh_token } =
          data;
        this.tokenService.setLocalStorage('access_token', access_token);
        this.tokenService.setLocalStorage('token_type', token_type);
        this.tokenService.setLocalStorage('refresh_token', refresh_token);
        this.tokenService.setLocalStorage('scope', scope);
        this.tokenService.setLocalStorage('expires_in', expires_in);
        return access_token as string;
      })
    );
  }

  async getAuthCode() {
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
