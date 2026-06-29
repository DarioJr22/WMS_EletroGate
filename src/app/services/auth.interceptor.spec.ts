import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { UserService } from './user.service';
import { TokenService } from './token.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['refreshToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'limparLocalStorage',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('adiciona enable-jwt e Bearer em requisições /Api', () => {
    localStorage.setItem('access_token', 'abc123');

    http.get('/Api/v3/pedidos/vendas').subscribe();

    const req = httpMock.expectOne('/Api/v3/pedidos/vendas');
    expect(req.request.headers.get('enable-jwt')).toBe('1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('adiciona enable-jwt mas NÃO Bearer no endpoint de token', () => {
    localStorage.setItem('access_token', 'abc123');

    http.post('/Api/v3/oauth/token', 'grant_type=authorization_code').subscribe();

    const req = httpMock.expectOne('/Api/v3/oauth/token');
    expect(req.request.headers.get('enable-jwt')).toBe('1');
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('não toca em requisições fora de /Api', () => {
    localStorage.setItem('access_token', 'abc123');

    http.get('/relatorios/danfe').subscribe();

    const req = httpMock.expectOne('/relatorios/danfe');
    expect(req.request.headers.get('enable-jwt')).toBeNull();
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('renova o token no 401 e repete a requisição com o novo token', () => {
    localStorage.setItem('access_token', 'old');
    userServiceSpy.refreshToken.and.callFake(() => {
      localStorage.setItem('access_token', 'new');
      return of('new');
    });

    let result: any;
    http.get('/Api/v3/pedidos/vendas').subscribe((r) => (result = r));

    const first = httpMock.expectOne('/Api/v3/pedidos/vendas');
    expect(first.request.headers.get('Authorization')).toBe('Bearer old');
    first.flush({}, { status: 401, statusText: 'Unauthorized' });

    const retry = httpMock.expectOne('/Api/v3/pedidos/vendas');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new');
    retry.flush({ ok: true });

    expect(userServiceSpy.refreshToken).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true });
  });

  it('faz logout quando a renovação falha no 401', () => {
    localStorage.setItem('access_token', 'old');
    userServiceSpy.refreshToken.and.returnValue(
      throwError(() => new Error('refresh failed'))
    );

    http.get('/Api/v3/pedidos/vendas').subscribe({
      next: () => {},
      error: () => {},
    });

    const first = httpMock.expectOne('/Api/v3/pedidos/vendas');
    first.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(tokenServiceSpy.limparLocalStorage).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
