export class BuscaParams {
  pagination?: { page: number; limit: number };
  period?: { start: string; end: string };
  situations?: number[];

  idContato?: number | null;
  idLoja?: number | null;
  numero?: number | null;
}
