import React, { useState, useEffect } from 'react'
import { format } from 'rut.js'
import {
  getSupplier,
  mutateSupplier,
  destroySupplier,
  importSupplier
} from '../../Hooks'
import { useSnackbar } from 'notistack'

const data = {
  nombre: '',
  direccion: '',
  correo: '',
  rut: '',
  notas: '',
  bank: '',
  telefono: ''
}
export const Actions = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [values, setValues] = useState(data)
  const { data: allSuppliers, isLoading: getLoading } = getSupplier()
  const { mutate, isLoading: posLoading, error } = mutateSupplier()
  const { mutate: importExcel, isLoading: Loading } = importSupplier()
  const { destroy, isLoading: destroyIsLoading } = destroySupplier()

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Error creando o editando al proveedor', {
        variant: 'error'
      })
    }
  }, [error])

  const { nombre, correo, telefono, rut, direccion, bank, notas } = values || {}

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: prop === 'rut' ? format(event.target.value) : event.target.value
    })
  }
  const saveData = () => {
    mutate(values)
  }
  return {
    values,
    nombre,
    correo,
    telefono,
    rut,
    direccion,
    notas,
    bank,
    allSuppliers,
    isLoading: getLoading || posLoading || destroyIsLoading || Loading,
    error,
    handleChange,
    setValues,
    saveData,
    destroy,
    importExcel
  }
}
