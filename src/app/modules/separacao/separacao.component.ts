import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-separacao',
  templateUrl: './separacao.component.html',
  styleUrls: ['./separacao.component.scss'],
})
export class SeparacaoComponent implements OnInit {
  dados: any[] = [];
  form: FormGroup;
  data: any;
  options: any;
  constructor(
    // private cookie: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private pedidoServ: PedidosService
  ) {
    this.form = new FormGroup({
      numCliente: new FormControl(),
      numPedido: new FormControl(),
      numPedidoLojaVirtual: new FormControl(),
      numNotaFiscal: new FormControl(),
    });
  }
  ngOnInit(): void {
    this.getPedidos();
    this.createChart();
  }

  getPedidos() {
    this.pedidoServ.getPedidos().subscribe({
      next: (data: any) => {
        console.log('Pedidos', data);

        this.dados = data.data;
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
      complete: () => {},
    });
  }

  getPedidosDetalhe() {
    this.pedidoServ
      .getPedidosDetail(this.form.controls['numPedido'].value)
      .subscribe({
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
}
