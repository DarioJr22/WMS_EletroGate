import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LogisticasService } from 'src/app/services/logisitica.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import * as JsBarcode from 'jsbarcode';
import { interval } from 'rxjs';
import { Item } from 'src/app/services/itens';


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
  pedido: any;
  situacoes: any[] = [];
  visualizarDialog = false;
  teste: any = [];
  first = 0;
  rows = 10;
  hoje = new Date();
  rangeDates:any
  query = {
    limit:100,
    page:1,
    start:'',
    end:''
  }

  testes(){
    console.log(this.form);
  }
  @ViewChildren('barcodeElement') barcodeElements!: QueryList<ElementRef<HTMLImageElement>>;
  @ViewChildren('name') names!: QueryList<ElementRef<any>>;
  @ViewChildren('sku') skus!: QueryList<ElementRef<any>>;
  @ViewChildren('printElement') print!: QueryList<ElementRef<any>>;



  constructor(
    // private cookie: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private logisticasService: LogisticasService,
    private router: Router,
    private pedidoServ: PedidosService
  ) {
    this.createChart();

    this.form = new FormGroup({
      numCliente: new FormControl(),
      numPedido: new FormControl(),
      numPedidoLojaVirtual: new FormControl(),
      numNotaFiscal: new FormControl(),
      data: new FormControl(),
    });
  }

  /* Barcode */
  generateBarcode() {
    let intervalo = interval(300)
    let subs = intervalo.subscribe(n => {
      console.log(n);
        if(n == 2){
          subs.unsubscribe()
        }else{
          this.barcodeElements.toArray().forEach((el: ElementRef<HTMLImageElement>,idx) => {
            this.names.toArray()[idx].nativeElement.innerHTML = this.pedido.itens[idx].descricao
            this.skus.toArray()[idx].nativeElement.innerHTML = this.pedido.itens[idx].codigo
            JsBarcode(el.nativeElement, this.pedido.itens[idx].codigo, {
              format: 'CODE128',
              lineColor: '#000000',
              textAlign: "center",
              width: 1,
              height: 25,
              margin: 0,
              displayValue: false
            });
          })
        }
      })
    }

    printElementId(){
      window.print();

    }

  ngOnInit(): void {

    this.getPedidos(
      {page:1, limit:100},
      {start:'2024-01-01', end:'2024-04-20'}
    );
    this.getModulo();
  }

  modalidadeEnvio(vol:any[]){
    return vol.map((i:any) => `${i.id} - ${i.servico}`)
  }

  getModulo(){
    this.pedidoServ.getModule().subscribe({
      next: (res: any) => {
        let retorno:any = [];
        let id = 0
        retorno = res.data
        id = retorno.find((i:any) => i.nome == "Vendas").id
       this.getSituacoes(id) ;
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      }
    })
  }

  getSituacoes(id:number){
    this.pedidoServ.getSituations(id).subscribe({
      next: (res: any) => {
        this.situacoes = res.data
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      }
    })
  }

  getSitucaoStl(id:number){
    let situacao = this.situacoes.find(i => i.id == id)
    return [situacao.nome,situacao.cor]
  }

  getPedidos(pagination:any, data:any) {
    this.pedidoServ.getPedidos(pagination,data).subscribe({
      next: (res: any) => {
        let result = [];
        result = res.data;
        if(result.length == 100){
          console.log(result);

          this.dados.push(result);
          this.getPedidos(
            {
              page:pagination.page+1,
              limit:pagination.limit
            }
            ,
            data)
        }else{
          this.dados.push(result);
        }
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
      complete: () => {

      },
    });
  }

  getDetalhePedido(item?: any) {
    this.visualizarDialog = false;
    this.pedidoServ.getPedidosDetail(item.id).subscribe({
      next: (res: any) => {
        this.pedido = res.data;
        this.logisticasService
          .getLogisticaRemessa(res.data.transporte.volumes[0].id)
          .subscribe({
            next: (res) => {
              console.log('--------------------------');
              console.log(res);
            },
            error: (e) => {
              console.log(e);
            },
          });

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
}
