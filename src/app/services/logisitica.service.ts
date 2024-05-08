import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import {catchError, map} from 'rxjs/operators'
import { NotificationService } from '../shared/notification/notification.service';
import { NotificationType } from './notification';
import { PedidosService } from './pedidos.service';
import { throwError } from 'rxjs';

//Sem o code

@Injectable({
  providedIn: 'root',
})
export class LogisticasService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private notify:NotificationService,
    private pedidoServ:PedidosService
  ) {}

  getLogisticaRemessa(id: any) {
    const token: any = this.tokenService.getToken();

    const urlToken = `/Api/v3/logisticas/remessas/${id}`;
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(urlToken, { headers: header });
  }

  getEtiquetaDeTransporte(idPedido: number[]) {
    const token: any = this.tokenService.getToken();

    const urlToken = `/Api/v3/logisticas/etiquetas?idsVendas%5B%5D=${idPedido}&formato=PDF`;
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    });

    return this.http.get(urlToken, { headers: header });
  }

  getBlob(url: string) {
    return this.http.get(url,{responseType: 'blob'});

  }

  getPDFUrl(url: string) {
    //Visualizador do arquivo de pdf
    return this.http.get(url, {
      responseType: 'blob',

    })
  }


  openWindown(url:string) {
    this.getPDFUrl(url).subscribe({
      next:(res:any)=>{
        //Faz uma url de um blob
        let blob = new Blob([res.blob()], { type: 'application/pdf' });
        //Abre a url do blob em outra janela
        this.openPdfWindow(blob);
      },

      error:(err:any)=>{
        this.notify.notify({message: 'Erro ao baixar o PDF !', type: NotificationType.ERROR,})
      }
    })
  }


  openPdfWindow(blob:Blob){
   let url = URL.createObjectURL(blob);
   window.open(url,'_blank')?.addEventListener('load',(e) => console.log(e))

  }

  getLogisticas(){
    const token: any = this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    })

    return this.http.get('/Api/v3/logisticas?situacao=H', { headers: header })
  }

  getLogisticasServicos(){
    const token: any =  this.tokenService.getToken();
    const header = new HttpHeaders({
      Authorization: `Bearer ${token.__zone_symbol__value}`,
    })

    return this.http.get('/Api/v3/logisticas/servicos ', { headers: header })
  }






}
