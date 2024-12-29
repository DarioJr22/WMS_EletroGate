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

export interface Situacoes {
  id:number,
  nome:string,
  idHerdado:number,
  cor:string
}

export const situacoes =
[
      {
        "id": 6,
        "nome": "Em aberto",
        "idHerdado": 0,
        "cor": "#E9DC40"
      },
      {
        "id": 9,
        "nome": "Atendido",
        "idHerdado": 0,
        "cor": "#3FB57A"
      },
      {
        "id": 12,
        "nome": "Cancelado",
        "idHerdado": 0,
        "cor": "#CBCBCB"
      },
      {
        "id": 15,
        "nome": "Em andamento",
        "idHerdado": 0,
        "cor": "#0065F9"
      },
      {
        "id": 18,
        "nome": "Venda Agenciada",
        "idHerdado": 0,
        "cor": "#FF7835"
      },
      {
        "id": 21,
        "nome": "Em digitação",
        "idHerdado": 0,
        "cor": "#FF66E3"
      },
      {
        "id": 24,
        "nome": "Verificado",
        "idHerdado": 0,
        "cor": "#85F39E"
      },
      {
        "id": 223206,
        "nome": "[Em processamento]",
        "idHerdado": 9,
        "cor": "#ed66ff"
      },
      {
        "id": 223259,
        "nome": "[Pronto para separação]",
        "idHerdado": 15,
        "cor": "#da1b1b"
      },
      {
        "id": 223260,
        "nome": "[Em separação]",
        "idHerdado": 9,
        "cor": "#ff8100"
      },
      {
        "id": 223275,
        "nome": "[Aguardando conferência]",
        "idHerdado": 9,
        "cor": "#ffff00"
      }
]
