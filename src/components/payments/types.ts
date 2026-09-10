export type MonthlyPayment = {
  id_arriendo: number;
  id_pago: number | null;
  mes: string;
  nombre_arrendatario: string;
  rut_arrendatario: string | null;
  nombre_local: string;
  direccion_propiedad: string | null;
  arriendo_pagado: boolean;
  fecha_pago_arriendo: string | null;
  gastos_comunes_pagados: boolean;
  fecha_pago_gastos_comunes: string | null;
  comentarios: string;
  version: number;
  arriendo_activo?: boolean;
};

export type PaymentPage = {
  datos: MonthlyPayment[];
  total: number;
  pagina: number;
  paginasTotales: number;
};
export type PaymentInput = Pick<
  MonthlyPayment,
  | "mes"
  | "arriendo_pagado"
  | "fecha_pago_arriendo"
  | "gastos_comunes_pagados"
  | "fecha_pago_gastos_comunes"
  | "comentarios"
  | "version"
>;
