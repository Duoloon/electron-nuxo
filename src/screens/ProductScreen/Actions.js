import React, { useState, useEffect } from 'react'
import {
  getProducts,
  mutateProduct,
  destroyProduct,
  getCombo,
  mutateCombo,
  destroyCombo,
  importProduct
} from '../../Hooks'
import { useSnackbar } from 'notistack'

const data = {
  nombre: '',
  sku: '',
  codebar: '',
  descripcion: '',
  unidad: 0,
  precio: 0
}
export const Actions = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [values, setValues] = useState(data)
  const [product, setProduct] = useState([])
  const { data: allProduct, isLoading: getLoading } = getProducts()
  const { dataC: allCombo, isLoading: getLoadingCombo } = getCombo()
  const { mutate, isLoading: posLoading, error } = mutateProduct()
  const { mutateC, isLoading: posLoadingCombo, errorC } = mutateCombo()
  const { mutate: importExcel, isLoading: Loading } = importProduct()
  const { destroy, isLoading: destroyIsLoading } = destroyProduct()
  const { destroyC, isLoading: destroyIsLoadingCombo } = destroyCombo()
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Error creando o editando el producto', {
        variant: 'error'
      })
    }
  }, [error])

  useEffect(() => {
    if (errorC) {
      enqueueSnackbar('Error creando o editando el Combo', {
        variant: 'error'
      })
    }
  }, [errorC])

  const { nombre, sku, codebar, descripcion, unidad, precio } = values || {}

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    })
  }
  const saveData = opcion => {
    opcion
      ? mutate(values)
      : mutateC({
          id: values.id,
          nombre: nombre,
          sku: sku,
          codebar: codebar,
          descripcion: descripcion,
          unidad: unidad,
          precio: precio,
          productos: product
        })
  }
  const emptyList = () => {
    setProduct([])
    enqueueSnackbar('Se borro la lista', {
      variant: 'success'
    })
  }
  const addProducList = code => {
    const resultado = allProduct.find(item => item.codebar === code)
    if (resultado) {
      const res = product.find(item => item.codebar === resultado.codebar)
      var newData
      if (res) {
        newData = product.map(item => {
          if (item.codebar === res.codebar) {
            item['cantidad'] = item['cantidad'] + 1
            return item
          }
          return item
        })
      } else {
        newData = [
          ...product,
          {
            nombre: resultado.nombre,
            precio: resultado.precio,
            id: resultado.id,
            codebar: resultado.codebar,
            cantidad: 1
          }
        ]
      }
      setProduct(newData)
    } else {
      enqueueSnackbar('Producto no registrado', {
        variant: 'error'
      })
    }
  }

  const operationQuantity = (index, props, operation) => {
    const newData = product.map((item, key) => {
      if (key === index) {
        if (operation === 'suma') {
          item[props] = item[props] + 1
        } else {
          if (item[props] !== 0) item[props] = item[props] - 1
          else setProduct([])
        }
        return item
      }
      return item
    })
    setProduct(newData)
  }
  const removeProducList = position => {
    const newData = [
      ...product.slice(0, position),
      ...product.slice(position + 1)
    ]
    setProduct(newData)
  }
  return {
    values,
    nombre,
    sku,
    codebar,
    descripcion,
    unidad,
    precio,
    allProduct,
    allCombo,
    product,
    isLoading:
      getLoading ||
      posLoading ||
      destroyIsLoading ||
      getLoadingCombo ||
      posLoadingCombo ||
      destroyIsLoadingCombo ||
      Loading,
    error,
    handleChange,
    setValues,
    saveData,
    setProduct,
    destroy,
    destroyC,
    removeProducList,
    addProducList,
    emptyList,
    operationQuantity, 
    importExcel
  }
}
