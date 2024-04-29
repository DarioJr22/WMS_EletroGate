export class BuscaParams {
  pagination: { page: number; limit: number } = { page: 1, limit: 100 };
  period?: { start: string; end: string };
  situations?: number[];

  idContato?: number | null;
  idLoja?: number | null;
  numero?: number | null;
}
