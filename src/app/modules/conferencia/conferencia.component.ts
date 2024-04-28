import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { situacoes } from 'src/app/services/itens';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { LogisticasService } from '../../services/logisitica.service';
import { NotificationType } from 'src/app/services/notification';
import { NotificationService } from 'src/app/shared/notification/notification.service';

@Component({
  selector: 'app-conferencia',
  templateUrl: './conferencia.component.html',
  styleUrls: ['./conferencia.component.scss'],
})
export class ConferenciaComponent implements OnInit {
  dados: any[] = [];
  form: FormGroup;
  data: any;
  options: any;
  pedido: any;
  situacoes = situacoes;
  visualizarDialog = false;
  teste: any = [];

  constructor(
    // private cookie: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private pedidoServ: PedidosService,
    private logisticasService: LogisticasService,
    private notify:NotificationService
  ) {
    this.createChart();

    this.form = new FormGroup({
      numCliente: new FormControl(),
      numPedido: new FormControl(),
      numPedidoLojaVirtual: new FormControl(),
      numNotaFiscal: new FormControl(),
    });
  }

  ngOnInit(): void {
this.getPedidos()
  }

  getPedidos() {
    this.pedidoServ.getPedidos(
      { page: 1, limit: 100 },
      { start: '2024-01-01', end: '2024-04-27' },
      [223275]
    ).subscribe({
      next: (res: any) => {
        console.log('Pedidos', res);
        this.dados = res.data;
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
      complete: () => {},
    });
  }

  getEtiquete(pedido:number[]){
    this.logisticasService.getEtiquetaDeTransporte(pedido).subscribe({
      next: (res: any) => {
        console.log('Etiquetas', res);
        let result = [];
        result = res.data;
        result.map((et:{id:number,link:string,observacao:string}) =>  window.open(et.link)) // window.open(et.link,'_blank'))
      },
      error: (err: any) => {
        console.log(err);

      },
      complete: () => {},
    });
  }

  getDetalhePedido(item?: any) {
    this.visualizarDialog = false;
    this.pedidoServ.getPedidosDetail(item.id).subscribe({
      next: (res: any) => {
        console.log('Pedido Detail', res);
        this.pedido = res.data;

        this.visualizarDialog = true;
      },
      error: (err: any) => {
        this.visualizarDialog = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  createChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }

  putSituation(orderId:number,situationId:number){
    let situacao = situacoes.find((i) => i.id == situationId);
    this.pedidoServ.putOrderSit(orderId,situationId).subscribe({
      next:(result:any) =>{
        this.notify.notify({
          message: `Situação alterada: ${situacao?.nome}`,
          type: NotificationType.SUCSESS,
        })


      },
      error: (err:any)=>{
        this.notify.notify({
          message: 'Erro ao mudar o status do pedido ! ' + err,
          type: NotificationType.ERROR,
        })
        console.log(err);

      }
    })
  }
}
