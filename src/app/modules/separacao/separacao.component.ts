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
import { situacoes } from 'src/app/services/itens';
import { LogisticasService } from 'src/app/services/logisitica.service';
import { NotificationType } from 'src/app/services/notification';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification/notification.service';
import { BuscaParams } from 'src/app/shared/params';
export interface Contato {
  id: number;
  nome: string;
  tipoPessoa: string;
  numeroDocumento: string;
}

export interface Situacao {
  id: number;
  valor: number;
}

export interface Loja {
  id: number;
}

export interface Objeto {
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
  //Entidades
  dadosFilter: Objeto[] = [];
  dados: Objeto[] = [];
  form: FormGroup;
  data: any;
  options: any;
  pedido: any;
  situacoes: any[] = situacoes;
  //Elementos de tela
  expandedRows: { [key: string]: boolean } = {};

  isLoading: boolean = false;

  visualizarDialog = false;
  first = 0;
  rows = 10;
  hoje = new Date();
  rangeDates: any;

  dataTempTable: any[] = [];
  dataTempChart: any[] = [];
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
    private pedidoServ: PedidosService,
    private notify: NotificationService
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
  generateBarcode(): Promise<any> {
    //Promise de criação do barcode
    let promise = new Promise((result, reject) => {
      // Observable que verifica se foi renderizado de 100 em 100 centézimos
      let intervalo = interval(100);
      // Subscriber para a observable
      let subs = intervalo.subscribe({
        next: (n) => {
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
            result(true);
          }
        },
        error: (err) => {
          reject(err);
          this.notify.notify({
            message: `Erro: ${err}`,
            type: NotificationType.ERROR,
          });
        },
      });
    });

    return promise;
  }

  ngOnInit(): void {
    //Inicializa os parâmetros de busca
    this.getInitialDateRange();
    let paramsChat = this.fillParamsFilter([
      situacoes[9].id,
      situacoes[8].id,
      situacoes[7].id,
      situacoes[10].id,
    ]);
    let paramsTable = this.fillParamsFilter([situacoes[9].id, situacoes[8].id]);
    this.getPedidos(paramsTable, 'table');
    this.getPedidos(paramsChat, 'chart');
    this.createChart();
  }

  printAll() {
    //Abre os campos
    this.toggleAllRows();
    // Gera os códigos de barra | Aguarda a promisse ser resolvida para imprimir o código de barras
    this.generateBarcode().then(() => {
      //Imprime os códigos de barra
      //Pega os elementos gerados nos códigos de barra
      const printContents = this.print.toArray();
      const content = printContents
        .map((el) => el.nativeElement.innerHTML)
        .join(' \n');

      console.log(content);

      // Seleciona apenas o primeiro elemento encontrado, ajuste se necessário
      const windowPrint = window.open(
        '',
        '_blank',
        'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0'
      );
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
    });
  }

  printElementId(element: HTMLElement) {
    const printContents = element.innerHTML; // document.querySelector('#print')?.innerHTML;
    // Seleciona apenas o primeiro elemento encontrado, ajuste se necessário
    const windowPrint = window.open(
      '',
      '_blank',
      'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0'
    );
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
        console.log(err);
      },
    });
  }

  getSituacoes(idModule: number) {
    this.pedidoServ.getSituations(idModule).subscribe({
      next: (res: any) => {
        console.log(this.situacoes);
      },
      error: (err: any) => {
        console.log(err);

        /*    this.tokenService.limparLocalStorage();
        this.router.navigate(['/']); */
      },
    });
  }

  getSitucaoStl(id: number) {
    let situacao = this.situacoes.find((i) => i.id == id);
    if (situacao) {
      if (situacao.id == 223275) {
        return [situacao.nome, situacao.cor, '#000'];
      }
      return [situacao.nome, situacao.cor];
    }
    return '';
  }

  putSituation(orderId: number, situationId: number) {
    let situacao = situacoes.find((i) => i.id == situationId);
    this.pedidoServ.putOrderSit(orderId, situationId).subscribe({
      next: (result: any) => {
        this.notify.notify({
          message: `Situação alterada: ${situacao?.nome}`,
          type: NotificationType.SUCSESS,
        });
        if (situacao?.nome != '[Em separação]') {
          this.visualizarDialog = false;
          //Reloada a tabela
          this.dadosFilter = [];
          let params = this.fillParamsFilter([
            situacoes[9].id,
            situacoes[8].id,
          ]);
          this.getPedidos(params, 'table');
        }
      },
      error: (err: any) => {
        this.notify.notify({
          message: 'Erro ao mudar o status do pedido !',
          type: NotificationType.ERROR,
        });
      },
    });
  }

  getPedidos(params: BuscaParams, dataSource?: 'table' | 'chart') {
    this.isLoading = true;
    this.pedidoServ.getPedidos(params).subscribe({
      next: (res: any) => {
        let itens = [];
        itens.push(...res.data);
        //Verifica em qual fonte de dado será depositada a query
        dataSource == 'chart'
          ? this.dataTempChart.push(...itens)
          : this.dataTempTable.push(...itens);

        //Se a query 100 itens é porque ela ainda não terminou todos os registros.
        if (itens.length == 100) {
          params.pagination.page += 1;
          this.getPedidos(params, dataSource);
        } else if (itens.length < 100 && dataSource == 'table') {
          this.dadosFilter = this.dataTempTable;
          this.dataTempTable = [];
        } else if (itens.length < 100 && dataSource == 'chart') {
          this.dados = this.dataTempChart;
          this.createChart();
          this.dataTempChart = [];
        }
      },
      error: (err: any) => {
        this.notify.notify({
          message: this.pedidoServ.handleError(err),
          type: NotificationType.ERROR,
        });
        this.tokenService.limparLocalStorage();
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  reloadTable() {
    this.dadosFilter = [];
    let params = this.fillParamsFilter([situacoes[9].id, situacoes[8].id]);
    this.getPedidos(params, 'table');
  }

  /**
   * Retrieves the details of a specific pedido.
   *
   * @param {any} item - The item for which to retrieve the details.
   * @return {void} This function does not return anything.
   */
  getDetalhePedido(item?: any) {
    this.visualizarDialog = false;
    this.pedidoServ.getPedidosDetail(item.id).subscribe({
      next: (res: any) => {
        this.pedido = res.data;
        this.visualizarDialog = true;
        this.generateBarcode().then();
        //Id do pedido | Id da situação - Em separação
        if (item.situacao.id != situacoes[9].id) {
          this.putSituation(item.id, situacoes[9].id);
          this.reloadTable();
        }
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

  pageChange(event: any) {}

  fillParamsFilter(situations: number[]) {
    let params = new BuscaParams();
    params.idContato =
      this.form.controls['numCliente'].value != null
        ? parseInt(this.form.controls['numCliente'].value)
        : null;
    params.numero =
      this.form.controls['numPedido'].value != null
        ? parseInt(this.form.controls['numPedido'].value)
        : null;
    params.idLoja =
      this.form.controls['numPedidoLojaVirtual'].value != null
        ? parseInt(this.form.controls['numPedidoLojaVirtual'].value)
        : null;
    params.period = this.convertDate(this.form.controls['data'].value);
    params.pagination = { page: 1, limit: 100 };
    params.situations = situations;
    return params;
  }

  buscarItemLista() {
    this.isLoading = true;
    this.reloadTable();
  }

  convertDate(dateRange: Date[]) {
    let start = new Date(dateRange[0]).toISOString().split('T')[0];
    let end = new Date(dateRange[1]).toISOString().split('T')[0];
    return { start, end };
  }

  limpar() {
    this.dadosFilter = this.dados;
    this.form.reset();
  }

  toggleRow(ped: any) {
    this.expandedRows[ped.name] = !this.expandedRows[ped.name];
  }

  async toggleAllRows() {
    this.pedido.itens.forEach(
      (item: any) => (this.expandedRows[item.name] = true)
    );
    await this.generateBarcode().then();
  }

  onVisibleChange(ev: any) {
    this.getInitialDateRange();
    this.reloadTable();
  }

  getDateRange(dias: number) {
    //Seta um range datas de hoje até 30 dias atrás
    return [
      new Date(new Date().setDate(new Date().getDate() - dias)),
      new Date(),
    ];
  }

  getInitialDateRange() {
    //Seta um range datas de hoje até 30 dias atrás
    this.form.controls['data'].setValue(this.getDateRange(30));
  }
}
