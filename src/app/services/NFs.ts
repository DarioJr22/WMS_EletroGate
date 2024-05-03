interface TextNode {
  text: string;
}

interface Address {
  xLgr: TextNode;
  nro: TextNode;
  xCpl?: TextNode;
  xBairro: TextNode;
  cMun: TextNode;
  xMun: TextNode;
  UF: TextNode;
  CEP: TextNode;
  cPais: TextNode;
  xPais: TextNode;
  fone: TextNode;
}

interface Person {
  CNPJ?: TextNode;
  CPF?: TextNode;
  xNome: TextNode;
  enderEmit?: Address;
  enderDest?: Address;
  indIEDest?: TextNode;
  IE: TextNode;
  email?: TextNode;
}

interface Product {
  cProd: TextNode;
  cEAN: TextNode;
  xProd: TextNode;
  NCM: TextNode;
  CEST: TextNode;
  indEscala: TextNode;
  CFOP: TextNode;
  uCom: TextNode;
  qCom: TextNode;
  vUnCom: TextNode;
  vProd: TextNode;
  cEANTrib: TextNode;
  uTrib: TextNode;
  qTrib: TextNode;
  vUnTrib: TextNode;
  vFrete: TextNode;
  vDesc: TextNode;
  indTot: TextNode;
  nItemPed: TextNode;
}

interface InfNFe {
  ide: {
      cUF: TextNode;
      cNF: TextNode;
      natOp: TextNode;
      mod: TextNode;
      serie: TextNode;
      nNF: TextNode;
      dhEmi: TextNode;
      dhSaiEnt: TextNode;
      tpNF: TextNode;
      idDest: TextNode;
      cMunFG: TextNode;
      tpImp: TextNode;
      tpEmis: TextNode;
      cDV: TextNode;
      tpAmb: TextNode;
      finNFe: TextNode;
      indFinal: TextNode;
      indPres: TextNode;
      indIntermed: TextNode;
      procEmi: TextNode;
      verProc: TextNode;
  };
  emit: Person;
  infAdic:{
    infCpl: TextNode
  }
  dest: Person;
  det: [] | any/*  {
      prod: Product;
      imposto: {
          vTotTrib: TextNode;
          ICMS: {
              ICMSSN102: {
                  orig: TextNode;
                  CSOSN: TextNode;
              }
          };
          IPI: {
              cEnq: TextNode;
              IPINT: {
                  CST: TextNode;
              }
          };
          PIS: {
              PISNT: {
                  CST: TextNode;
              }
          };
          COFINS: {
              COFINSNT: {
                  CST: TextNode;
              }
          };
      };
  } */  ;
}

interface NFe {
  infNFe: InfNFe;
  Signature: any; // Use any or define a specific type based on your requirements
}

export interface NFeXML {
  NFe: NFe;
  protNFe?: any; // Similarly, define this as needed or use any
}
