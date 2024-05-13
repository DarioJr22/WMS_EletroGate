import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { situacoes } from 'src/app/services/itens';
import { PedidosService } from 'src/app/services/pedidos.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { LogisticasService } from '../../services/logisitica.service';
import { NotificationType } from 'src/app/services/notification';
import { NotificationService } from 'src/app/shared/notification/notification.service';
import { BuscaParams } from 'src/app/shared/params';
import { Objeto } from '../separacao/separacao.component';
import { Observable, catchError, concatMap, delayWhen, forkJoin, from, interval, map, merge, mergeMap, of, switchMap, timer } from 'rxjs';
import * as JsBarcode from 'jsbarcode';

import {NFeXML } from '../../services/NFs'
import Utils from 'src/app/services/Utils';
import { templatebarcode } from 'src/app/services/barcode.config';
import { logistic, service } from 'src/app/services/logistcMock';

@Component({
  selector: 'app-conferencia',
  templateUrl: './conferencia.component.html',
  styleUrls: ['./conferencia.component.scss'],
})


export class ConferenciaComponent implements OnInit {
  dadosFilter: Objeto[] = [];
  dados: Objeto[] = [];
  form: FormGroup;
  data: any;
  options: any;
  pedido: any;
  situacoes: any[] = situacoes;
  expandedRows: { [key: string]: boolean } = {};
  isLoading: boolean = false;
  logisticas = logistic
  servico = service
  visualizarDialog = false;
  visualizarDialogPdf = false;
  first = 0;
  rows = 10;
  hoje = new Date();
  rangeDates: any;
  detalhes: any[] = [];
  isLoadingProduct: boolean = false;
  isLoadingLogistica: boolean = false;
  filterActive:boolean = false
  dadosFilterArr:any[] = []

  @ViewChildren('barcodeElement') barcodeElements!: QueryList<ElementRef<HTMLImageElement> >;
  @ViewChildren('name') names!: QueryList<ElementRef<any>>;
  @ViewChildren('sku') skus!: QueryList<ElementRef<any>>;
  @ViewChildren('elementPrint') print!: QueryList<ElementRef<any>>;
  @ViewChildren('qtde') qtde!: QueryList<ElementRef<any>>;
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
                this.qtde.toArray()[
                  idx
                ].nativeElement.innerHTML = `Qtde: ${this.pedido.itens[idx].quantidade}`;
                JsBarcode(el.nativeElement, this.pedido.itens[idx].codigo, {
                  format: 'CODE128',
                  lineColor: '#000000',
                  textAlign: 'center',
                  width: Utils.defineWidthBarCode(
                    this.pedido.itens[idx].codigo
                  ),
                  height: 25,
                  margin: 0,
                  displayValue: false,
                });

                let barcode: any = el.nativeElement;

                //Se o tamanho do código de barras for maior do que o tamanho da etiqueta
                if (barcode.width && barcode.width.animVal.value > 150) {
                  el.nativeElement.innerHTML = this.pedido.itens[idx].descricao;
                }
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
    let paramsTable = this.fillParamsFilter([situacoes[10].id]);
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
    return vol.map((i: any) => `${i.id} - ${i.servico}`);
  }

  getModulo() {
    this.pedidoServ.getModule().subscribe({
      next: (res: any) => {
        //Obtem os módulos da aplicação
        let retorno: any = [];
        let id = 0;
        retorno = res.data;

        //Recupera o módulo de vendas
        id = retorno.find((i: any) => i.nome == 'Vendas').id;
        //Usao para obter as situações do módulo
        this.getSituacoes(id);
      },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }

  getSituacoes(idModule: number) {
    this.pedidoServ.getSituations(idModule).subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }

  getSitucaoStl(id: number) {
    let situacao = this.situacoes.find((i) => i.id == id);
    if (situacao) {
      if (situacao.id == 223275) {
        return [situacao.nome, situacao.cor, '#000'];
      }
      return [situacao.nome, situacao.cor, '#fff'];
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
          let params = this.fillParamsFilter([situacoes[10].id]);
          this.getPedidos(params, 'table');
        }
      },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }

  dataTempTable: any[] = [];
  dataTempChart: any[] = [];
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
          this.dadosFilter.length == 1  ? this.getDetalhePedido(this.dadosFilter[0]) : '';
        /*   this.getDataDetail(this.dadosFilter); */
          /* this.getOrderTest(20257925227) */


          this.dataTempTable = [];
        } else if (itens.length < 100 && dataSource == 'chart') {
          this.dados = this.dataTempChart;
          this.createChart();
          this.dataTempChart = [];
        }
      },
      error: (err: any) => {
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  reloadTable() {
    this.dadosFilter = [];
    let params = this.fillParamsFilter([situacoes[10].id]);
    this.getPedidos(params, 'table');
  }

  getDetalhePedido(item?: any) {
    this.visualizarDialog == false ? this.visualizarDialog == false : this.visualizarDialog = true;
    this.pedidoServ.getPedidosDetail(item.id).subscribe({
      next: (res: any) => {
        this.pedido = res.data;
        this.pedido.itens.forEach((i: any) => (i.img = ''));
        this.visualizarDialog = true;
        this.generateBarcode().then();
        this.dadosFilter.length > 1 ? this.reloadTable() : '';
        this.getProductDetail();
        this.pedido.itens.sort((a: any, b: any) =>
          a.codigo < b.codigo ? -1 : 1
        );
      },
      error: (err: any) => {
        this.visualizarDialog = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
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

  getEtiqueta(pedido: number[], nfId: number) {
    this.isLoading = true;
    //Faz a requisição, mas antes adiciona etapas para recuperação de dados da nota fiscal
    this.logisticasService.getEtiquetaDeTransporte(pedido).subscribe({
      next: (res: any) => {
        let result = [];
        result = res.data;
        result.map((et: { id: number; link: string; observacao: string }) => {
          window.open(et.link);

          this.logisticasService
            .getBlob(this.formatLink(et.link))
            .subscribe((res: any) => {
              const blobPdf = new Blob([res], { type: 'application/pdf' });
              Utils.addImgeToPDF(this.simplDanfe, blobPdf);
            });
        }); // window.open(et.link,'_blank'))
      },
      error: (err: any) => {
        this.isLoading = false;

        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  formatLink(link: string) {
    let linkFormated = link.split('aws.com')[1];
    return linkFormated;
  }

  //Obter dados da nota fiscal
  getNfeData(idNfe: number) {
    this.pedidoServ.getNF(idNfe).subscribe({
      next: (res: any) => {
        // Gerar NF
        this.gerarNFE(res.data.linkDanfe, res.data.xml);
        // Obter xml
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }

  //Gerar nota fiscal
  //1º Gera a nota fiscal

  formatDocument(document: string) {
    let doc = document;
    doc = doc.replace(
      '<title>Bling - </title>',
      '<title>Bling - DANFE</title>'
    );
    doc = doc.replace(
      '</style>',
      '.p-button{cursor:pointer;color:#fff;border-radius: 0.5rem;padding:0.5rem 1rem; border-radius:0.5rem;background:#22c55e; border: 1px solid #22c55e;}.p-button:hover{border-radius:0.5rem;background:#22c55e;border: 1px solid #22c55e;} @media print{ .p-button{ visibility: hidden;}}</style>'
    );
    doc = doc.replace(
      '<body>',
      `<button class="p-button" style="margin: 2rem" onclick="window.print()">IMPRIMIR</button>`
    );
    doc = doc.replace(
      '<style>',
      `<link rel="icon" type="image/x-icon" href="https://www.bling.com.br/images/favicons/logo-bling-dark-32.ico" /> <style>`
    );
    return doc;
  }

  simplDanfe: string = '';
  simplDanfeData: any = '';
  getSvg(html: any) {
    let startSvg = html.indexOf('<svg');
    let endSvg = html.indexOf('</svg>') + '</svg>'.length;
    let svg = html.substring(startSvg, endSvg);
    return svg;
  }

  setTitle(html: string) {
    let startSvg = html.indexOf('<title');
    let endSvg = html.indexOf('</title>') + '</title>'.length;
    let svg = html.substring(startSvg, endSvg);
  }

  urlPdf: string = '';
  gerarEtqDanfe(pedidoId: number[], nfId: number) {
    this.visualizarDialogPdf = false;
    this.isLoading = true;
    let nfData: any;
    //Faz fluxo de obtenção da danfe simplificada
    this.pedidoServ
      .getNF(nfId)
      .pipe(
        //Requisição de recuperação de informações da Nota
        switchMap((nfData: any) => {
          const xml = nfData.data.xml;
          return this.pedidoServ.getDanfe(nfData.data.linkDanfe).pipe(
            //Obtem a danfe para recolhimento de dados
            switchMap((danfeData: any) => {
              const htmlDanfe = danfeData;
              //Obtem o xml da nota para recolhimento de dados
              return this.pedidoServ.getXml(xml).pipe(
                switchMap((xmlData: any) => {
                  //Tranformação do xml em JSON
                  let json = this.pedidoServ.parseXml(xmlData);
                  //Pega o svg do código de barras que tá no xml
                  let svg = this.getSvg(htmlDanfe);
                  //Extração de dados do xml / Disposição desses dados num html
                  return this.extractData(json, svg).pipe(
                    switchMap((data: any) => {
                      this.simplDanfeData = data;
                      //Retorna a danfe simplificada
                      return this.pedidoServ
                        .gerarDanfeSimplificadoHtml(
                          data.nomeFantasia,
                          data.svgBarcode,
                          data.codigo,
                          data.protocolo,
                          data.tipo,
                          data.numero,
                          data.serie,
                          data.dataEmissao,
                          data.qtde,
                          data.doc,
                          data.destIE,
                          data.nome,
                          data.endereco,
                          data.observacao
                        )
                        .pipe(
                          switchMap((simplDanfe: any) => {
                            this.simplDanfe = simplDanfe;
                            return this.logisticasService
                              .getEtiquetaDeTransporte(pedidoId)
                              .pipe(
                                //Retorna os dados da etiqueta de transporte // Links
                                switchMap((res: any) => {
                                  let etq = [];
                                  let result: Observable<any>[] = [];
                                  etq = res.data;

                                  //Cria uma observable para cada link recuperado // Executa várias observables ao mesmo tempo
                                  //Levando em consideração que em alguns casos serão necessários várias etiquetas de trasporte.
                                  result = etq.map((element: any) => {
                                    return this.logisticasService.getBlob(
                                      this.formatLink(element.link)
                                    );
                                  });
                                  //Executa todas ao mesmo tempo usando forkjoin
                                  return forkJoin(result);
                                }),

                                map((res) => res)
                              );
                            })
                          );
                        })
                      );
                    })
                  );
                })
              );
            }),
        catchError((err: any) => {
          this.notify.notify({
            message: `Erro: ${this.pedidoServ.handleError(err)}`,
            type: NotificationType.ERROR,
          });
          return of(null);
        })
      )
      .subscribe({
        next: async (blob: any) => {
          let pdf = await Utils.addImgeToPDF(this.simplDanfeData, blob[0]);
          let url = URL.createObjectURL(pdf);
          this.urlPdf = url;

          this.visualizarDialogPdf = true;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.notify.notify({
            message: `Erro: ${err}`,
            type: NotificationType.ERROR,
          });
        },
        complete: () => {
          this.visualizarDialogPdf = true;
          this.isLoading = false;
        },
      });
  }

  gerarNFE(danfeURL: string, xmlUrl: string) {
    this.pedidoServ.getDanfe(danfeURL).subscribe({
      next: (res: string) => {
        this.getXML(xmlUrl, res);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }
  //Recupera o xml com os dados da nota e
  getXML(urlXml: string, htmlDanfe?: any) {
    this.pedidoServ.getXml(urlXml).subscribe({
      next: (res: string) => {
        //Tranformação do xml em JSON
        let json: NFeXML = this.pedidoServ.parseXml(res);

        //Extração do código de barras
        let svg = this.getSvg(htmlDanfe);

        //Junção dos dados
        //Isso será executado no switchmap
        /*   this.extractData(json,svg).subscribe(
        (data:any) => {

            this.pedidoServ.gerarDanfeSimplificado(
              data.nomeFantasia,
              data.svgBarcode,
              data.codigo,
              data.protocolo,
              data.tipo,
              data.numero,
              data.serie,
              data.dataEmissao,
              data.qtde,
              data.doc,
              data.destIE,
              data.nome,
              data.endereco,
              data.observacao).then((danfe: any) => {

                this.simplDanfe = danfe;

              }
            )
        }

      ).catch((err: any) => {
        this.notify.notify({
          message: `Erro ao extrair dados da nota: ${err}`,
          type: NotificationType.ERROR
        })
      }) */
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }

  extractData(dados: NFeXML, svg: string) {
    const data: any = {};
    let extractPromise = new Observable((subscriber) => {
      //Recuperação de nome fantasia
      data.nomeFantasia = `${dados.NFe.infNFe.emit.xNome.text}\n${
        'CNPJ:' +
        this.pedidoServ.maskDoc(dados.NFe.infNFe.emit.CNPJ?.text, 'pj')
      } IE:${dados.NFe.infNFe.emit.IE.text}\n${
        dados.NFe.infNFe.emit.enderEmit?.xLgr.text
      }, ${dados.NFe.infNFe.emit.enderEmit?.nro.text}, ${
        dados.NFe.infNFe.emit.enderEmit?.xCpl?.text
      }, ${dados.NFe.infNFe.emit.enderEmit?.xBairro.text}\n${
        dados.NFe.infNFe.emit.enderEmit?.xMun.text
      } - ${dados.NFe.infNFe.emit.enderEmit?.UF.text}`;

      //Dados de código - Svg
      data.svgBarcode = svg;

      //Dados de código - Código
      data.codigo = dados.protNFe.infProt.chNFe.text;

      //Dados de protocolo
      //Separação dia e hora
      let dia = dados.protNFe.infProt.dhRecbto.text
        .split('T')[0]
        .split('-')
        .reverse()
        .join('/');
      let hr = dados.protNFe.infProt.dhRecbto.text
        .split('T')[1]
        .substring(0, 8);

      //Nº de protocolo da danfe
      data.protocolo = `${dados.protNFe.infProt.nProt.text} ${dia} ${hr}`;

      //Data de emissão
      data.dataEmissao = `${dia}`;

      //Tipo da nota fisxcall
      data.tipo = `${
        dados.NFe.infNFe.ide.tpNF.text == '1' ? '1 - Saída' : '0 - Entrada'
      }`;

      //Nº da nota fixcal
      data.numero = `${dados.NFe.infNFe.ide.nNF.text}`;

      //Serie
      data.serie = `${dados.NFe.infNFe.ide.serie.text}`;

      //Numero do documento do caboclo
      data.doc = `${
        dados.NFe.infNFe.dest.CNPJ?.text
          ? this.pedidoServ.maskDoc(dados.NFe.infNFe.dest.CNPJ?.text, 'pj')
          : this.pedidoServ.maskDoc(dados.NFe.infNFe.dest.CPF?.text, 'pf')
      }`;

      //IE do documento do caboclo
      data.destIE = `${
        dados.NFe.infNFe.dest.CNPJ?.text
          ? 'IE:' + dados.NFe.infNFe.dest.IE?.text
          : ''
      }`;

      //Nome do documento do caboclo
      data.nome = `${dados.NFe.infNFe.dest.xNome.text}`;

      //Quantidade de itens
      data.qtde = `${
        dados.NFe.infNFe.det.length ? dados.NFe.infNFe.det.length : 1
      }`;

      //Endereço
      data.endereco = `${dados.NFe.infNFe.dest.enderDest?.xLgr.text}, ${
        dados.NFe.infNFe.dest.enderDest?.nro.text
      } ${
        dados.NFe.infNFe.dest.enderDest?.xCpl?.text
          ? ', ' + dados.NFe.infNFe.dest.enderDest?.xCpl?.text
          : ''
      } , ${dados.NFe.infNFe.dest.enderDest?.xBairro.text} ${
        dados.NFe.infNFe.dest.enderDest?.xMun.text
      } - ${dados.NFe.infNFe.dest.enderDest?.UF.text}`;

      data.observacao = `${dados.NFe.infNFe.infAdic.infCpl.text}`;

      subscriber.next(data);
    });

    return extractPromise;
  }

  getOrderTest(id: number) {
    this.isLoading = true;
    this.pedidoServ.getPedidosDetail(id).subscribe({
      next: (res: any) => {
        let itens: Objeto[] = [];
        itens.push(res.data);
        this.dadosFilter.push(...itens);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notify.notify({
          message: `Erro: ${this.pedidoServ.handleError(err)}`,
          type: NotificationType.ERROR,
        });
      },
    });
  }
  searchOnEnter(e: KeyboardEvent | Date) {
    if (
      (e instanceof KeyboardEvent && e.code == 'Enter') ||
      e instanceof Date
    ) {
      this.buscarItemLista();
    }
  }


  getProductDetail() {
    this.isLoadingProduct = true;
    //Retorna a lista de ids dos produtos
    let iDitens = this.pedido.itens.map((item: any) => item.produto.id);

    //Uma observable por id
    let obs = iDitens.map((element: any) =>
      this.pedidoServ.getProductById(element)
    );

    //Se for duas ou menos itens na lista - Manda tudo de uma vez !

    //Busca todas de uma vez
    forkJoin(obs).subscribe({
      next: (res: any) => {
        console.log(res);

        if (res) {
          res.forEach((prd: any) => {
            this.detalhes.push(prd.data);
            this.getPhotos(prd.data);
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
        this.isLoadingProduct = false;
      },
    });

  }

  getPhotos(item: any) {
    this.pedido.itens.forEach((element: any) => {
      if (element.produto.id == item.id) {
        console.log(item);
        element.img = item.midia.imagens.externas[0].link;
        element.dimensoes = `${item.pesoBruto}kg - A:${item.dimensoes.largura}cm x L:${item.dimensoes.altura}cm x P:${item.dimensoes.profundidade}cm`;

      }
    });
  }


  logisticaSelected: any  = []

  getDataDetail(dadosFilter:any[]){
    this.isLoadingLogistica = true

    this.dadosFilter.forEach((item: any,index) => {
      let id = item.id
      this.pedidoServ.getPedidosDetail(id).subscribe({
        next: (res: any) => {
          let i = res.data;
          Object.assign(this.dadosFilter[index], i);
        },
        error: (err: any) => {
          this.notify.notify({
            message: `Erro: ${this.pedidoServ.handleError(err)}`,
            type: NotificationType.ERROR,
          });
          this.isLoadingLogistica = false;
        },
        complete: () => {
          console.log('complete');
          console.log(this.dadosFilter);
            this.isLoadingLogistica = false;
        },
      });
    })
  }

  limparFiltro(){
    this.logisticaSelected = {descricao:''}
    this.dadosFilterArr = this.dadosFilter
  }

  filter(){
    let log = this.findLogistica(this.logisticaSelected.descricao)
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
}
