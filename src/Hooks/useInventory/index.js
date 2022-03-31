import { useMutation, useQuery, useQueryClient } from 'react-query'
import request from '../../api'
import { useSnackbar } from 'notistack'
import { useLocation } from '../useLocation'


export const getInventory = () => {
  const { isLoading, data, error } = useQuery('/api/inventario', () =>
    request.inventory.get()
  )
  return {
    isLoading,
    data: data?.data || [],
    error
  }
}
export const getEntry = () => {
  const { isLoading, data, error } = useQuery('/api/entrada', () =>
    request.entry.get()
  )
  return {
    isLoading,
    data: data?.data || [],
    error
  }
}
export const getExit = () => {
  const { isLoading, data, error } = useQuery('/api/salida', () =>
    request.exit.get()
  )
  return {
    isLoading,
    data: data?.data || [],
    error
  }
}
export const mutateEntry = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setPath } = useLocation()
  const { mutate, isLoading, error } = useMutation(
    payload =>
      payload?.id ? request.entry.put(payload) : request.entry.post(payload),
    {
      onSuccess: data => {
        if (data?.data) {
          enqueueSnackbar(`Entrada ${data?.message}`, {
            variant: 'success'
          })
          setPath('/')
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

export const mutateExit = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { setPath } = useLocation()
    const { mutate, isLoading, error } = useMutation(
      payload =>
        payload?.id ? request.exit.put(payload) : request.exit.post(payload),
      {
        onSuccess: data => {
          if (data?.data) {
            enqueueSnackbar(`Salida ${data?.message}`, {
              variant: 'success'
            })
            setPath('/')
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