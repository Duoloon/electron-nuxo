import { atom } from 'jotai'
export const listArticles = atom([])
export const PERSISTOR_KEYS = {
  user: 'user',
  auth: 'auth',
  list: 'list',
  billIds: 'billids'
}

export const titles = {
  '/': 'Inventario',
  '/client': 'Clientes',
  '/product': 'Productos',
  '/supplier': 'Proveedor',
  '/inventory/history/entry': 'Historial de Entrada',
  '/inventory/history/exit': 'Historial de salida',
  '/setting': 'Ajustes'
}
export const download = {
  '/client': 'importar_cliente.xlsx',
  '/product': 'importar_producto.xlsx',
  '/supplier': 'importar_proveedor.xlsx'
}


export const dataexcelProducto = [
  {
    codebar: '123515',
    sku : '0001',
    nombre: 'pan',
    descripcion: "Bimbo",
    unidades: 1000,
    precio: 2000
  },
  {
    codebar: '1235545',
    sku : '0002',
    nombre: 'arroz',
    descripcion: "el gran marquez",
    unidades: 1000,
    precio: 2500
  }
]


export const dataexcelCliente = [
  {
    nombre: 'Cesar',
    direccion: 'pora ahi',
    correo: 'datos',
    telefono: 4140512,
    rut: 2776510, 
    notas: "notas"
  },
  {
    nombre: 'Cesar',
    direccion: 'pora ahi',
    correo: 'datos',
    telefono: 4140512,
    rut: 2776510, 
    notas: "notas"
  }
]

export const dataexcelProveedor = [
  {
    nombre: 'Cesar',
    direccion: 'pora ahi',
    correo: 'datos',
    telefono: 4140512,
    rut: 2776510, 
    bank: "Banco", 
    notas: "notas"
  },
  {
    nombre: 'Cesar',
    direccion: 'pora ahi',
    correo: 'datos',
    telefono: 4140512,
    rut: 2776510, 
    bank: "Banco", 
    notas: "notas"
  }
]

export const filedownload = {
  '/client': dataexcelCliente,
  '/product': dataexcelProducto,
  '/supplier': dataexcelProveedor
}