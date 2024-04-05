import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-separacao',
    templateUrl: './separacao.component.html',
    styleUrls: ['./separacao.component.css'],
})
export class SeparacaoComponent implements OnInit {
    dados: any[] = [];
    constructor(
        private cookie: CookieService,
        private userService: UserService,
        private pedidoServ: PedidosService
    ) {}
    ngOnInit(): void {
        !this.cookie.get('access_token') ||
        this.cookie.get('access_token') === null
            ? //Aqui o usuário inicia o fluxo de autenticação,
              this.userService.getAuthCode()
            : //Se o bonito já tiver autenticado, então ele segue pra a tela onde ele escolherá oque ele quer da vida dele: Separação / Conferência
              this.getPedidos();
    }

    getPedidos() {
        this.pedidoServ.getPedidos().subscribe({
            next: (data: any) => {
                console.log('Pedidos', data);

                this.dados = data.data;
                /* dataTemp.forEach((element:any) => {
            //this.getPedidosDetalhe(element.id)
          }) */
            },
            error: (err: any) => {
                console.log(err);
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
