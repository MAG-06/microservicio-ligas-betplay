export type TipoLiga =
  | "normal"
  | "juvenil_reservas"
  | "femenino"
  | "esports"
  | "especiales";

export interface Liga {
  id: number;
  nombre: string;
  pais: string | null;
  tipo: TipoLiga;
  partidos: number;
  ruta: string;
}
