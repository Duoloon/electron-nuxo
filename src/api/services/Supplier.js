import { request } from '../base'

const endpoints = {
  delete: '/api/proveedor/',
  put: '/api/proveedor/',
  get: '/api/proveedor',
  excel: '/api/proveedor/excel'
}

export const deleteS = async id => {
  const res = await request.delete(endpoints.delete + id)
  return res.data
}

export const put = async payload => {
  const res = await request.put(endpoints.put + payload?.id, payload)
  return res.data
}
export const post = async payload => {
  const res = await request.post(endpoints.get, payload)
  return res.data
}
export const excel = async payload => {
  const res = await request.post(endpoints.excel, payload)
  return res.data
}

export const get = async () => {
  const res = await request.get(endpoints.get)
  return res.data
}
