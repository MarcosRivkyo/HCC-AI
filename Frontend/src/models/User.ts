export interface User {
  id: string;
  nombreUsuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  numeroTelefono: string;
  urlFotoPerfil?: string;
  verificado: number;
  rol: string;
}