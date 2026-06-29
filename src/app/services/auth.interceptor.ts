import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from './token.service';
import { UserService } from './user.service';

/**
 * Centraliza a autenticação com a API do Bling.
 * - Adiciona o header `enable-jwt: 1` em toda requisição para `/Api` (migração JWT).
 * - Injeta `Authorization: Bearer <token>` (exceto no endpoint de token, que usa Basic).
 * - Em caso de 401, renova o token via refresh_token e repete a requisição uma vez.
 *
 * Requisições fora de `/Api` (DANFE/XML em /relatorios, PDFs no S3, etc.) não são tocadas.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  // O Injector é usado para obter UserService/Router de forma preguiçosa e
  // evitar dependência circular (UserService depende de HttpClient).
  constructor(private tokenService: TokenService, private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Só interfere nas chamadas à API do Bling.
    if (!req.url.startsWith('/Api')) {
      return next.handle(req);
    }

    const authReq = this.addHeaders(req);

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isTokenEndpoint(req)
        ) {
          return this.handle401(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  /** Clona a requisição adicionando os headers exigidos pela API. */
  private addHeaders(req: HttpRequest<any>): HttpRequest<any> {
    const headers: { [name: string]: string } = { 'enable-jwt': '1' };

    // O endpoint de token usa `Authorization: Basic`, definido no serviço.
    if (!this.isTokenEndpoint(req)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return req.clone({ setHeaders: headers });
  }

  private isTokenEndpoint(req: HttpRequest<any>): boolean {
    return req.url.includes('/oauth/token');
  }

  /** Renova o token (um refresh por vez) e repete a requisição original. */
  private handle401(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userService = this.injector.get(UserService);
    const router = this.injector.get(Router);

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return userService.refreshToken().pipe(
        switchMap((newToken: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addHeaders(req));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.tokenService.limparLocalStorage();
          router.navigate(['/']);
          return throwError(() => err);
        })
      );
    }

    // Já há um refresh em andamento: aguarda o novo token e repete.
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => next.handle(this.addHeaders(req)))
    );
  }
}
