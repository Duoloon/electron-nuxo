import { useMutation, useQuery, useQueryClient } from 'react-query'
import request from '../../api'
import { useSnackbar } from 'notistack'
import { useLocation } from '../useLocation'

export const getClients = () => {
  const { isLoading, data, error } = useQuery('/api/cliente', () =>
    request.client.get()
  )
  return {
    isLoading,
    data: data?.data || [],
    error
  }
}

export const mutateClients = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setPath } = useLocation()
  const { mutate, isLoading, error } = useMutation(
    payload =>
      payload?.id ? request.client.put(payload) : request.client.post(payload),
    {
      onSuccess: data => {
        if (data?.data) {
          enqueueSnackbar(`Cliente ${data?.message}`, {
            variant: 'success'
          })
          setPath('/client')
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
export const importClients = () => {
  const { enqueueSnackbar } = useSnackbar()
  // const { setPath } = useLocation()
  const { mutate, isLoading, error } = useMutation(
    payload => request.client.excel(payload),
    {
      onSuccess: data => {
        if (data?.message) {
          enqueueSnackbar(`Datos ${data?.message}`, {
            variant: 'success'
          })
          // setPath('/client')
        }
        setTimeout(() => {
          window.location.reload(true)
        }, 3000)
      }
    }
  )
  return {
    isLoading,
    error,
    mutate
  }
}
export const destroyClients = () => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    mutate: destroy,
    isLoading,
    error
  } = useMutation(payload => request.client.deleteC(payload), {
    onSuccess: data => {
      if (data?.data) {
        enqueueSnackbar(`Cliente ${data?.message}`, {
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
