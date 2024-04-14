import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-conferencia',
  templateUrl: './conferencia.component.html',
  styleUrls: ['./conferencia.component.scss'],
})
export class ConferenciaComponent implements OnInit {
  dados: any[] = [];

  data: any;
  options: any;
  constructor(
    // private cookie: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private pedidoServ: PedidosService
  ) {}
  ngOnInit(): void {
    // !this.tokenService.getToken() || this.tokenService.getToken() === null
    // ?
    //Aqui o usuário inicia o fluxo de autenticação,
    // this.userService.getAuthCode()
    // :
    //Se o bonito já tiver autenticado, então ele segue pra a tela onde ele escolherá oque ele quer da vida dele: Separação / Conferência
    this.getPedidos();

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

  getPedidos() {
    this.pedidoServ.getPedidos().subscribe({
      next: (data: any) => {
        console.log('Pedidos', data);

        this.dados = data.data;
        /* dataTemp.forEach((element:any) => {
          //this.getPedidosDetalhe(element.id)
        }) */
        debugger;
      },
      error: (err: any) => {
        debugger;
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
      complete: () => {},
    });
  }

  getPedidosDetalhe(id: string) {
    this.pedidoServ.getPedidosDetail(id).subscribe({
      next: (data: any) => {
        console.log('Pedido Detail', data);

        this.dados.push(data);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}
