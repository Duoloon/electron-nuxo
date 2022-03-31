import React, { useState, useEffect } from 'react'
import { getLicense, mutateLicense, useLicense } from '../../Hooks'
import { useSnackbar } from 'notistack'

const data = {
  licenseKey: ''
}
export const Actions = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [values, setValues] = useState(data)
  const { data: allLicencia, isLoading: getLoading, message } = getLicense()
  const { license, setLicense } = useLicense()
  const { mutate, isLoading: Loading, error } = mutateLicense()

  useEffect(() => {
    if (allLicencia[0]) {
      setValues(allLicencia[0])
      setLicense(message)
    }
  }, [allLicencia])
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Error creando o editando la licencia', {
        variant: 'error'
      })
    }
  }, [error])
  const { licenseKey } = values || {}

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    })
  }
  const saveData = () => {
    mutate({ id: values?.id, licenseKey: licenseKey })
  }
  // console.log(allLicencia)
  return {
    isLicense: license?.data?.id ? true : false,
    licenseKey,
    isLoading: getLoading || Loading,
    // error,
    handleChange,
    saveData
  }
}
