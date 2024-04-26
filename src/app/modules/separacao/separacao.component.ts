import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as JsBarcode from 'jsbarcode';
import { interval } from 'rxjs';
import { LogisticasService } from 'src/app/services/logisitica.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
interface Contato {
  id: number;
  nome: string;
  tipoPessoa: string;
  numeroDocumento: string;
}

interface Situacao {
  id: number;
  valor: number;
}

interface Loja {
  id: number;
}

interface Objeto {
  id: number;
  numero: number;
  numeroLoja: string;
  data: string;
  dataSaida: string;
  dataPrevista: string;
  totalProdutos: number;
  total: number;
  contato: Contato;
  situacao: Situacao;
  loja: Loja;
}
@Component({
  selector: 'app-separacao',
  templateUrl: './separacao.component.html',
  styleUrls: ['./separacao.component.scss'],
})
export class SeparacaoComponent implements OnInit {
  dadosFilter: Objeto[] = [];
  dados: Objeto[] = [];
  expandedRows: { [key: string]: boolean } = {};
  toggleRow(ped: any) {
    this.expandedRows[ped.name] = !this.expandedRows[ped.name];
  }

  toggleAllRows() {
    this.pedido.itens.forEach((item:any) => this.expandedRows[item.name] = true);
    this.generateBarcode();
  }




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
  rangeDates: any;
  query = {
    limit: 100,
    page: 1,
    start: '',
    end: '',
  };

  @ViewChildren('barcodeElement') barcodeElements!: QueryList<
    ElementRef<HTMLImageElement>
  >;
  @ViewChildren('name') names!: QueryList<ElementRef<any>>;
  @ViewChildren('sku') skus!: QueryList<ElementRef<any>>;
  @ViewChildren('elementPrint') print!: QueryList<ElementRef<any>>;

  constructor(
    // private cookie: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private logisticasService: LogisticasService,
    private router: Router,
    private pedidoServ: PedidosService
  ) {
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
    let intervalo = interval(100);
    let subs = intervalo.subscribe((n) => {
      console.log(n);
      if (n == 4) {
        subs.unsubscribe();
      } else {
        this.barcodeElements
          .toArray()
          .forEach((el: ElementRef<HTMLImageElement>, idx) => {
            this.names.toArray()[idx].nativeElement.innerHTML =
              this.pedido.itens[idx].descricao;
              this.skus.toArray()[idx].nativeElement.innerHTML =
              this.pedido.itens[idx].codigo;
              JsBarcode(el.nativeElement, this.pedido.itens[idx].codigo, {
                format: 'CODE128',
                lineColor: '#000000',
                textAlign: 'center',
                width: 1,
                height: 25,
                margin: 0,
                displayValue: false,
              });
            });
          }
        });
  }

  ngOnInit(): void {

    this.getPedidos(
      { page: 1, limit: 100 },
      { start: '2024-01-01', end: '2024-04-20' }
    );
    this.getModulo();
  }

  printAll(){
    //Abre os campos
    this.toggleAllRows();
    // Gera os códigos de barra
    this.generateBarcode()
    //Pega os elementos gerados nos códigos de barra
    const printContents = this.print.toArray();
    const content = printContents.map((el) => el.nativeElement.innerHTML).join(' \n');

    console.log(content);

    // Seleciona apenas o primeiro elemento encontrado, ajuste se necessário
    const windowPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint!.document.write(`<html>
    <header>
      <title>Impressão de Etiquetas</title>
      <style>
      .wrapper-40x25 {
        width: 40mm;
        height: 23mm;

        padding: 0mm 1.5mm;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

    .barcode-holder {
      text-align: center;
      vertical-align: middle;
      padding-top: 0.5mm;
      height: 30px;
      margin-left: 5px;
    }

    .titleSKU {
      font-size: 10px;
      font-weight: 700;
      text-align: left;
      max-height: 6mm;
      margin-left: 10px;
    }

    .barcode-holder {
      text-align: center;
      vertical-align: middle;
      padding-top: 0.5mm;
      height: 30px;
      margin-left: 5px;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-left: 10px;
      font-weight: 700;
      font-size: 13px;
    }

    body{
      font-family: 'Inter var', sans-serif;
    }



			.spacer {
				margin: 0;
				page-break-after: always;
			}
      </style>
    </header>
    <body>${content}</body>
    </html>`);
    windowPrint!.document.close();
    windowPrint!.focus();

    setTimeout(() => {
      windowPrint!.print();
      windowPrint!.close();
    }, 250);
  }

  printElementId(element: HTMLElement) {
    const printContents = element.innerHTML; // document.querySelector('#print')?.innerHTML;
    console.log(printContents);
      // Seleciona apenas o primeiro elemento encontrado, ajuste se necessário
    const windowPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint!.document.write(`<html>
    <header>
      <title>Impressão de Etiquetas</title>
      <style>
      .wrapper-40x25 {
        width: 40mm;
        height: 23mm;

        padding: 0mm 1.5mm;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

    .barcode-holder {
      text-align: center;
      vertical-align: middle;
      padding-top: 0.5mm;
      height: 30px;
      margin-left: 5px;
    }

    .titleSKU {
      font-size: 10px;
      font-weight: 700;
      text-align: left;
      max-height: 6mm;
      margin-left: 10px;
    }

    .barcode-holder {
      text-align: center;
      vertical-align: middle;
      padding-top: 0.5mm;
      height: 30px;
      margin-left: 5px;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-left: 10px;
      font-weight: 700;
      font-size: 13px;
    }

    body{
      font-family: 'Inter var', sans-serif;
    }
      </style>
    </header>
    <body>${printContents}</body>
    </html>`);
    windowPrint!.document.close();
    windowPrint!.focus();

    setTimeout(() => {
      windowPrint!.print();
      windowPrint!.close();
    }, 250);
  }

  modalidadeEnvio(vol: any[]) {
    return vol.map((i: any) => `${i.id} - ${i.servico}`);
  }

  getModulo() {
    this.pedidoServ.getModule().subscribe({
      next: (res: any) => {
        let retorno: any = [];
        let id = 0;
        retorno = res.data;
        id = retorno.find((i: any) => i.nome == 'Vendas').id;
        this.getSituacoes(id);
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
    });
  }

  getSituacoes(id: number) {
    this.pedidoServ.getSituations(id).subscribe({
      next: (res: any) => {
        this.situacoes = res.data;
        this.createChart();
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
    });
  }

  getSitucaoStl(id: number) {
    let situacao = this.situacoes.find((i) => i.id == id);
    if (situacao) {
      return [situacao.nome, situacao.cor];
    }
    return '';
  }
  getPedidos(pagination: any, data: any) {
    this.pedidoServ.getPedidos(pagination, data).subscribe({
      next: (res: any) => {
        if (res.data.length == 100) {
          let itens = [];
          itens.push(...res.data);
          this.dados = itens;
          this.dadosFilter = itens;
        } else {
          this.dados.push(...res.data);
        }
      },
      error: (err: any) => {
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
      },
      complete: () => {},
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
    const {
      labels,
      values,
      colors,
      darkerColors,
    }: { labels: any; values: any[]; colors: any; darkerColors: any } =
      this.getValuesGrafico(this.dados, this.situacoes);

    this.data = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: darkerColors,
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

  getValuesGrafico(dados: any, situacoes: any) {
    const counts: any = {};

    dados.forEach((item: any) => {
      const situacaoId: any = item.situacao.id;
      counts[situacaoId] = (counts[situacaoId] || 0) + 1;
    });

    const labels: any = Object.keys(counts).map((id) => {
      const situacao = situacoes.find((s: any) => s.id === parseInt(id));
      return situacao ? situacao.nome : id;
    });

    const values = Object.values(counts);

    const colors: any = labels.map((label: any) => {
      const situacao = situacoes.find((s: any) => s.nome === label);
      return situacao ? situacao.cor : '';
    });

    // Função para escurecer ligeiramente a cor hexadecimal
    function darkenColor(color: string) {
      const hex = color.slice(1);
      const num = parseInt(hex, 16);
      const amt = -20; // Quantidade para escurecer
      const r = (num >> 16) + amt;
      const b = ((num >> 8) & 0x00ff) + amt;
      const g = (num & 0x0000ff) + amt;
      const newColor = `#${(g | (b << 8) | (r << 16)).toString(16)}`;
      return newColor;
    }

    const darkerColors: any = colors.map((color: any) => darkenColor(color));

    return { labels, values, colors, darkerColors };
  }

  pageChange(event: any) {
    debugger;
  }

  //prettier-ignore
  buscarItemLista() {
    this.dadosFilter = this.dados
    if (this.form.controls['numCliente'].value) {
      this.dadosFilter = this.dadosFilter.filter((x: Objeto) => {
        return x.contato.nome
                        .toUpperCase()
                        .includes(
                          String(
                            this.form.controls['numCliente'].value
                          )
                        .toUpperCase());
      });
    }

    if (this.form.controls['numPedido'].value) {
      this.dadosFilter = this.dadosFilter.filter((x: Objeto) => {
        return x.id
                .toString()
                .includes(
                  this.form.controls['numPedido'].value
                );
      });
    }

    if (this.form.controls['numPedidoLojaVirtual'].value) {
      this.dadosFilter = this.dadosFilter.filter((x: Objeto) => {
        return x.loja.id
                     .toString()
                     .includes(
                       this.form.controls['numPedidoLojaVirtual'].value
                     );
      });
    }

    if (this.form.controls['numNotaFiscal'].value) {
      this.dadosFilter = this.dadosFilter.filter((x: Objeto) => {
        return x.numero
                .toString()
                .includes(
                  this.form.controls['numNotaFiscal'].value
                );
      });
    }

    // this.dadosFilter = this.dados
    // .map((numCliente: any) => {})
    // .map((numPedido: any) => {})
    // .map((numPedidoLojaVirtual: any) => {})
    // .map((numNotaFiscal: any) => {})

    // this.form.controls['numCliente'].value;
    // this.form.controls['numPedido'].value;
    // this.form.controls['numPedidoLojaVirtual'].value;
    // this.form.controls['numNotaFiscal'].value;

    if(this.form.controls['data'].value){
      let dateIni, dateFin = this.convertDate(this.form.controls['data'].value)
    }



  }

  convertDate(dateRange: Date[]) {
    let dateIni = new Date(dateRange[0]).toISOString().split('T')[0];
    let dateFin = new Date(dateRange[1]).toISOString().split('T')[0];
    return {dateIni, dateFin};
  }

  limpar() {
    this.dadosFilter = this.dados;
    this.form.reset();
  }
}
