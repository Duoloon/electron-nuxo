import { useMutation, useQuery } from 'react-query'
import request from '../../api'
import { useSnackbar } from 'notistack'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { persistState, getPersistedState } from '../../utils'

const licenceAtom = atom(getPersistedState('license') ?? {})

export const useLicense = () => {
  const [license, setLicense] = useAtom(licenceAtom)

  useEffect(() => persistState('license', license), [license])

  const status = () => {
    var res = false
    if (license?.data) {
      var fechaActual = new Date()
      var fechaExpiracion = new Date(license?.data?.expiresAt)
      if (fechaActual.valueOf() > fechaExpiracion.valueOf()) {
        res = true
      }
    }
    return res
  }

  return {
    license,
    setLicense,
    status
  }
}

export const getLicense = () => {
  const { isLoading, data, error } = useQuery('/api/License', () =>
    request.license.get()
  )
  return {
    isLoading,
    data: data?.data || [],
    message: data?.message || {},
    error
  }
}

export const mutateLicense = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { mutate, isLoading, error } = useMutation(
    payload => request.license.post(payload),
    {
      onSuccess: data => {
        if (data?.data) {
          enqueueSnackbar(`Licencia ${data?.message}`, {
            variant: 'success'
          })
          //   setPath('/history')
          setTimeout(() => {
            window.location.reload(true)
          }, 3000)
        }
      }
    }
  )
  return {
    isLoading,
    error,
    mutate
  }
}

export const destroyLicense = () => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    mutate: destroy,
    isLoading,
    error
  } = useMutation(payload => request.license.deleteC(payload), {
    onSuccess: data => {
      if (data?.data) {
        enqueueSnackbar(`Licencia ${data?.message}`, {
          variant: 'success'
        })
        setTimeout(() => {
          window.location.reload(true)
        }, 3000)
      }
    }
  })

  return {
    isLoading,
    error,
    destroy
  }
}
