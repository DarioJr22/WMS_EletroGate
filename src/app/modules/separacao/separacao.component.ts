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
import { catchError, forkJoin, interval, map, of, switchMap, Observable } from 'rxjs';
import Utils from 'src/app/services/Utils';
import { situacoes } from 'src/app/services/itens';
import { LogisticasService } from 'src/app/services/logisitica.service';
import { NotificationType } from 'src/app/services/notification';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification/notification.service';
import { BuscaParams } from 'src/app/shared/params';
import { logistic,salesChanel,service } from 'src/app/services/logistcMock';
import { templatebarcode } from 'src/app/services/barcode.config';
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
  @ViewChildren('qtde') qtde!: QueryList<ElementRef<any>>;

  logisticas = logistic
  servico = service
  isLoadingProduct: boolean = false
  filterActive:boolean = false
  dadosFilterArr:any[] = []

  searchOnEnter(e:KeyboardEvent | Date){
   if(e instanceof KeyboardEvent && e.code == "Enter" || e instanceof Date){
      this.buscarItemLista()
   }
  }
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


  etqEmBrancoChk: boolean = false

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
            //Recupera todos os códigos de barra não renderizados em tela e utiliza o indice dos mesmo para passar dados para os itens
            this.barcodeElements
              .toArray()
              .forEach((el: ElementRef<HTMLImageElement>, idx) => {
                this.names.toArray()[idx].nativeElement.innerHTML = this.pedido.itens[idx].descricao;
                this.skus.toArray()[idx].nativeElement.innerHTML = this.pedido.itens[idx].codigo;
                this.qtde.toArray()[idx].nativeElement.innerHTML = `Qtde: ${this.pedido.itens[idx].quantidade}`;
                JsBarcode(el.nativeElement, this.pedido.itens[idx].codigo, {
                  format: 'CODE128',
                  lineColor: '#000000',
                  textAlign: 'center',
                  width: Utils.defineWidthBarCode(this.pedido.itens[idx].codigo),
                  height: 25,
                  margin: 0,
                  displayValue: false,
                });

                let barcode:any = el.nativeElement;

                //Se o tamanho do código de barras for maior do que o tamanho da etiqueta
                if(barcode.width && barcode.width.animVal.value > 150){
                  el.nativeElement.innerHTML = this.pedido.itens[idx].descricao;
                }
              });
              //Caso o código seja maior do que a label então aplica uma formatação menor nele: tamanho 0.5
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


      // Seleciona apenas o primeiro elemento encontrado, ajuste se necessário
      const windowPrint = window.open(
        '',
        '_blank',
        'left=150,top=100,width=600,height=800,toolbar=0,scrollbars=0,status=0'
      );
      let imprimeBranco = this.etqEmBrancoChk ? 2 : ''
      windowPrint!.document.write(templatebarcode(content,imprimeBranco));
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
      'left=150,top=100,width=600,height=800,toolbar=0,scrollbars=0,status=0'
    );
    let imprimeBranco = this.etqEmBrancoChk ? 2 : ''
    windowPrint!.document.write(templatebarcode(printContents,imprimeBranco));
    windowPrint!.document.close();
    windowPrint!.focus();

   setTimeout(() => {
      windowPrint!.print();
      windowPrint!.close();
    }, 250);
  }

  modalidadeEnvio(vol: any[]) {
    return vol.map((i: any) => `${i.id} - ${i.servico} - ${this.findLogisticaNameByService(i.servico)}`);
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
      },
    });
  }

  getSituacoes(idModule: number) {
    this.pedidoServ.getSituations(idModule).subscribe({
      next: (res: any) => {
      },
      error: (err: any) => {

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
          message: this.pedidoServ.handleError(err),
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
          this.dadosFilterArr = this.dataTempTable;
         /*  this.getOrderTest() */
          this.getDataDetail(this.dadosFilter)
          //Para evitar a inicialização automática do modal de detalhes
         if( this.dadosFilter.length == 1  &&
            this.form.controls['numCliente'].value != null ||
            this.form.controls['numPedido'].value != null ||
            this.form.controls['numPedidoLojaVirtual'].value != null) {
              this.getDetalhePedido(this.dadosFilter[0]) ;
         }
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
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getOrderTest() {
    this.isLoading = true

  let ids = [
              20277861575,
              20277138298,
              20277098485,
              20276815100,
              20276792246,
              20276779516,
              20276772252,
              20276284746,
              20276213570,
              20276792246,
              20276779516,
              20276772252,
              20276284746,
              20276213570
            ]

    let obs = ids.map(id => this.pedidoServ.getPedidosDetail(id))
    forkJoin(obs).subscribe({
      next: (res: any) => {
        let itens:any[] = [];
        res.forEach((i:any) => {
          itens.push(i.data);
        })

        console.log(itens);

        this.dadosFilter.push(...itens);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        })
      },
      complete: () => {
        this.getDataDetail(this.dadosFilter)
      }
    })
  }

  reloadTable() {
    this.dadosFilter = [];
    let params = this.fillParamsFilter([situacoes[9].id, situacoes[8].id]);
    this.getPedidos(params, 'table');
  }

  getDetalhePedido(item?: any) {
    this.isLoading = true;
    this.visualizarDialog = false;
    this.pedidoServ.getPedidosDetail(item.id).subscribe({
      next: (res: any) => {
        this.pedido = res.data;
        this.pedido.itens.forEach((i:any) => i.img = '')
        this.visualizarDialog = true;
        this.generateBarcode().then();
        this.getProductDetail();
        //Id do pedido | Id da situação - Em separação
        if (item.situacao.id != situacoes[9].id) {
          this.putSituation(item.id, situacoes[9].id);
          this.dadosFilter.length > 1 ? this.reloadTable() : '';
        }else{
          //Caso o pedido já esteja em separação ->
          //  -> Recarrega a tabela,
          //  -> fecha o modal
          //  -> manda uma notificação.

        /*   this.visualizarDialog = false
          this.dadosFilter.length > 1 ? this.reloadTable() : '';
          this.notify.notify({
            message: `Atenção: já este pedido está em separação !`,
            type: NotificationType.ERROR,
          }) */
        }

        //Ordenação dos pedidos em ordem alfabética por SKU
        this.pedido.itens.sort((a:any,b:any) => a.codigo < b.codigo ? -1 : 1);
      },
      error: (err: any) => {
        this.visualizarDialog = false;
        this.notify.notify({
          message: this.pedidoServ.handleError(err),
          type: NotificationType.ERROR,
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
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
  productImgs:any[] = []
  prodVar:Observable<any>[] = []
  detalhes:any = []
  getCodeProdPai(produto:any){
   //Recupera o código do produto pai
    console.log(produto);

   let nomeVar = produto.variacao.nome
   let idVar = nomeVar.split(':')[1].toLowerCase().split(' ').length > 1 ? nomeVar.split(':')[1].toLowerCase().split(' ').join('-') : nomeVar.split(':')[1].toLowerCase()
   let searchVar = produto.codigo.replace(`-${idVar}`,'')
   return this.pedidoServ.getProductByCode(searchVar)
  }
  getProductDetail(){
    this.isLoadingProduct = true;
    //Retorna a lista de ids dos produtos
    let iDitens = this.pedido.itens.map((item: any) =>  item.produto.id);
    //Uma observable por id
    let obs = iDitens.map((element:any) => {
     return this.pedidoServ.getProductById(element)
    });
    //Busca todas de uma vez
    forkJoin(obs).subscribe({
      next: (res: any) => {
        console.log(res);

        if(res){
          res.forEach((prd:any) => {
            this.detalhes.push(prd.data);
            //Verifica se o produto é uma varição ou não
            if(prd.data.variacao){
              this.prodVar.push(this.getCodeProdPai(prd.data))
            } else {
              this.getPhotos(prd.data)
            }

          });
        }
      },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
        this.isLoadingProduct = false;
      },
      complete: () => {
        this.prodVar.length > 0 ? this.getProductPais() : this.isLoadingProduct = false;

        this.getProductPais();
      },
    })
  }

    getPhotos(item: any){
      this.pedido.itens.forEach((element:any ) => {
        //Caso não seja pelo id ( Produto filh ) Será na recuperação de produto pai que vem com o imgurl
            if(element.produto.id == item.id ){
              element.img = (item && item.midia) && item.midia.imagens.externas.length > 0 ?

              item.midia.imagens.externas[0].link  :

              (item && item.midia) && item.midia.imagens.internas.length > 0 ?

              item.midia.imagens.internas[0].link :

              '';
             // element.dimensoes = `${item.pesoBruto}kg - A:${item.dimensoes.largura}cm x L:${item.dimensoes.altura}cm x P:${item.dimensoes.profundidade}cm`;
            } else if( item.imagemURL && element.codigo.includes(item.codigo)){
              //Verifica se o código contém no item que estamos buscando
              element.img = item.imagemURL;
            }
          }
        );
      }



    getProductPais(){
      this.isLoadingProduct = true;
      forkJoin(this.prodVar).subscribe({
        next: (res: any) => {
          res.forEach((prd:any) => {
            this.getPhotos(prd.data[0])
          });
        },
        error: (err: any) => {
          this.notify.notify({
            message: `Erro: ${this.pedidoServ.handleError(err)}`,
            type: NotificationType.ERROR,
          });
          this.isLoadingProduct = false;
        },
        complete: () => {
          this.isLoadingProduct = false;
        },
      })
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
    if (this.form.valid) {
      this.isLoading = true;
      this.reloadTable();
    } else {
      this.notify.notify({
        message: 'Preencha data inicial e final !',
        type: NotificationType.WARN,
      });
    }
  }

  convertDate(dateRange: Date[]) {
    let start = new Date(dateRange[0]).toISOString().split('T')[0];
    let end = new Date(dateRange[1]).toISOString().split('T')[0];
    return { start, end };
  }

  limpar() {
    this.form.controls['numCliente'].setValue(null);
    this.form.controls['numPedido'].setValue(null);
    this.form.controls['numPedidoLojaVirtual'].setValue(null);

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

  logisticaSelected: any  = []

  getLogisticas(){
    this.isLoading = true
    this.logisticasService.getLogisticas().pipe(
      //Obtem os serviços logisticos da empresa
      switchMap((res:any) => {
      this.logisticas = res.data
      return this.logisticasService.getLogisticasServicos()
      })
    ).subscribe({
      next: (res: any) => {
        this.logisticas = res.data;
      },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }



  /* Filtro por logística */

  ordersDetail:any = [];
  nfs:any = [];
  nfSelected: any  = []
  isLoadingLogistica = false
  getDataDetail(dadosFilter:any[]){
    this.isLoadingLogistica = true

    let obs = this.dadosFilter.map((item: any,index) => {
     let id = item.id
     return this.pedidoServ.getPedidosDetail(id)
    })

    forkJoin(obs).subscribe({
      next: (res: any) => {
          res.forEach((item: any,index:any) => {
            this.dadosFilter[index] = item.data
          });
        },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
      complete: () => {
      this.isLoadingLogistica = false
      },
    });
  }

  limparFiltro(){
    this.logisticaSelected = {descricao:''}
    this.dadosFilterArr = this.dadosFilter
  }

  filter(ev:any){
    let log = this.findLogistica(ev)
    let serv = this.findService(log?.id)
    this.dadosFilterArr = this.dadosFilter.filter( (i:any) =>
    {
          if (i.transporte.volumes && i.transporte.volumes.length > 0) {
            return this.findServiceByName(i.transporte.volumes[0].servico, serv) > 0;
        } else {
            return false;
        }
      }
    )
  }




  findLogistica(str:string){
   return logistic.find((i:any) => i.descricao == str )
  }

  findService(idLogistico:any){
    return service.filter((i:any) => i.logistica.id == idLogistico )
  }

  findServiceByName(str:string,services:any[] ){
    return services.filter((i:any) => i.descricao == str ||  i.aliases.includes(str) ).length
  }

  findLogisticaNameByService(str:string ){
    let idList = service.filter((i:any) => i.descricao == str ||  i.aliases.includes(str) )
    let id = 0
    id = idList[0].logistica.id

    return logistic.find((i:any) => i.id == id )?.descricao
  }

  findSalesChanel(id:number){
    return salesChanel.find((i:any) => i.id == id) ? `${salesChanel.find((i:any) => i.id == id)?.descricao} - ${salesChanel.find((i:any) => i.id == id)?.tipo}` : id
  }


}

