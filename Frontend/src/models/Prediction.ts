export interface Prediction {
  id: string;
  idEstudio: string;
  fecha: string;
  modeloClasificacion: number;
  submodeloClasificacion: string;
  modeloSegmentacion: string;
  clasePredicha: number;
  probabilidades: string;
  imagenSegmentada: string;
  explicacion: string;
}