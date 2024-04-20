export interface Item{
  id:number;
  codigo:string;
  descricao:string;
  descricaoDetalhada:string;
  produto:{id:number};
  quantidade:number;
  unidade:string;
  valor:number;
  comissao:any;
  desconto:0;
}
