import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

//Sem o code

@Injectable({
  providedIn: 'root',
})
export class LogisticasService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  getLogisticaRemessa(id: any) {
    const token: any = this.tokenService.getToken();

    const urlToken = `/Api/v3/logisticas/remessas/${id}`;
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(urlToken, { headers: header });
  }
}
