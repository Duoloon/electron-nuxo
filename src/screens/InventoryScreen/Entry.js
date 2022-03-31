import React, { useState, forwardRef, useEffect, useRef } from 'react'
import {
  Box,
  Divider,
  Button,
  Dialog,
  Typography,
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  TextField,
  Autocomplete,
  Stack,
  Switch,
  FormControlLabel
} from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import { useLocation, getSupplier, getProducts, mutateEntry } from '../../Hooks'
import { ListItem } from '../../components'
import CloseIcon from '@mui/icons-material/Close'
import { Delete, Edit } from '@mui/icons-material'
import Slide from '@mui/material/Slide'
import { titles } from '../../variables'
import scanner from './scanner.mp3'
import { useSnackbar } from 'notistack'
import { Scrollbars } from 'react-custom-scrollbars'
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
const data = {
  date: new Date(),
  status: '',
  nota: '',
  ProveedorId: {}
}
const EntryView = () => {
  const audio = new Audio(scanner)
  const scannerRef = useRef()
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(true)
  const [autocomplete, setAutocomplete] = useState([])
  const [product, setProduct] = useState([])
  const {mutate: saveEntry, isLoading: loadingEntry} = mutateEntry()
  const { path, setPath } = useLocation()
  const { data: allSuplier } = getSupplier()
  const { data: allProduct } = getProducts()
  const [value, setValues] = useState(data)

  useEffect(() => {
    var newValue = allSuplier.map(item => {
      item['label'] = item.nombre
      return item
    })
    setAutocomplete(newValue)
  }, [allSuplier])

  const handleChange = prop => event => {
    setValues({
      ...value,
      [prop]: event.target.value
    })
  }
  const handleClick = () => {
    setOpen(false)
    setPath('/')
  }

  const save = () => {
    setOpen(false)
    setPath('/')
    saveEntry({
      date: value.date,
      status: value.status,
      nota: value.nota,
      proveedor: value?.ProveedorId?.id,
      productos: product
    })
  }

  const emptyList = () => {
    setProduct([])
    enqueueSnackbar('Se borro la lista', {
      variant: 'success'
    })
  }
  const addProducList = (code, prop) => {
    const resultado = allProduct.find(item => item[prop] === code)
    if (resultado) {
      const res = product.find(item => item[prop] === resultado[prop])
      var newData
      if (res) {
        newData = product.map(item => {
          if (item[prop] === res[prop]) {
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

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClick}
        TransitionComponent={Transition}
      >
        <MuiAppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClick}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {'Crear Entrada'}
            </Typography>
            <Button color="inherit" disabled={loadingEntry} onClick={save}>
              {'Crear'}
            </Button>
          </Toolbar>
        </MuiAppBar>
        <Box
          component="main"
          sx={{
            p: 3,
            width: '100%',
            height: '100%',
            backgroundColor: '#EDEFF3'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: 3,
              width: '100%',
              height: '100%',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" component="div">
              Entrada del inventario:
            </Typography>
            <Box sx={{ marginTop: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2}>
                <DateTimePicker
                  label="Fecha de Ingreso"
                  value={value.date}
                  onChange={newValue => {
                    setValues({
                      ...value,
                      ['date']: newValue
                    })
                  }}
                  size="small"
                  fullWidth
                  renderInput={params => (
                    <TextField {...params} fullWidth size="small" />
                  )}
                />
                <Autocomplete
                  disablePortal
                  id="proveedor"
                  options={autocomplete}
                  size="small"
                  onChange={(event, newValue) => {
                    setValues({
                      ...value,
                      ['ProveedorId']: newValue
                    })
                  }}
                  fullWidth
                  renderInput={params => (
                    <TextField {...params} label="Proveedor" />
                  )}
                />
                <TextField
                  id="status"
                  label="Status"
                  size="small"
                  value={value.status}
                  onChange={handleChange('status')}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="nota"
                  label="Nota"
                  size="small"
                  value={value.nota}
                  onChange={handleChange('nota')}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </LocalizationProvider>

            <>
              <Box sx={{ marginTop: 2 }} />
              <Typography variant="h6" component="div">
                Productos o Combos:
              </Typography>
              <Box sx={{ marginTop: 2 }} />

              <Box
                sx={{
                  borderRadius: 2,
                  width: '100%',
                  height: '100%',
                  border: '1px solid #131B4F',
                  padding: 3
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    id="escaner"
                    label="Escanear"
                    size="small"
                    variant="outlined"
                    inputRef={scannerRef}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        var code = e.target.value
                        addProducList(code, 'codebar')
                        scannerRef.current.value = ''
                      }
                    }}
                    autoFocus
                    onChange={async () => {
                      audio.currentTime = 0
                      await audio
                        .play()
                        .then(() => {
                          console.log('audio played auto')
                        })
                        .catch(error => {
                          console.log(error)
                        })
                    }}
                    sx={{ width: '200px' }}
                  />

                  <Autocomplete
                    disablePortal
                    id="search"
                    getOptionLabel={item => item.nombre}
                    options={allProduct}
                    size="small"
                    sx={{ width: '200px', marginLeft: 3 }}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        var code = e.target.value

                        addProducList(code, 'nombre')
                      }
                    }}
                    renderInput={params => (
                      <TextField {...params} label="Buscar por nombre" />
                    )}
                  />

                  <Button
                    sx={{ marginLeft: 'auto' }}
                    variant="contained"
                    color="error"
                    onClick={emptyList}
                  >
                    Borrar Todo
                  </Button>
                </Box>

                <Box sx={{ marginTop: 2 }} />

                <Scrollbars
                  renderTrackHorizontal={props => (
                    <Box
                      {...props}
                      sx={{ display: 'none' }}
                      className="track-horizontal"
                    />
                  )}
                  style={{
                    height: '85%',
                    overflowX: 'hidden'
                  }}
                >
                  {product.map((item, key) => (
                    <ListItem
                      key={key}
                      id={key}
                      title={item?.nombre}
                      price={item?.precio}
                      cantidad={item?.cantidad}
                      update={false}
                      destroy={() => removeProducList(key)}
                      operationQuantity={operationQuantity}
                    />
                  ))}
                </Scrollbars>
              </Box>
            </>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default EntryView
