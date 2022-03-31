import React, { useState, forwardRef, useRef } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  Typography,
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  TextField,
  Stack
} from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { AppBar, ListItem } from '../../components'
import { Delete, Edit } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { useLocation } from '../../Hooks'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import Slide from '@mui/material/Slide'
import scanner from './scanner.mp3'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ProductView = ({
  values,
  nombre,
  sku,
  codebar,
  descripcion,
  unidad,
  precio,
  allProduct,
  isLoading,
  allCombo,
  product,
  error,
  handleChange,
  setValues,
  saveData,
  setProduct,
  destroy,
  destroyC,
  removeProducList,
  emptyList,
  operationQuantity,
  addProducList,
  importExcel
}) => {
  const audio = new Audio(scanner)
  const scannerRef = useRef()
  const [tab, setTab] = useState(true)
  const { path, setPath } = useLocation()
  const [open, setOpen] = useState(true)
  const [update, setUpdate] = useState(false)
  const [ids, setIds] = useState([])
  console.log(allProduct)
  const handleClick = () => {
    setOpen(false)
    setPath('/product')
    setValues({})
    setUpdate(false)
    setProduct([])
    setIds([])
  }

  const handleValues = id => {
    setIds(id)
    const res = tab
      ? allProduct.filter(x => x.id === id)
      : allCombo.filter(x => x.id === id)
    if (res) {
      setValues(res[0])
      if (!tab) {
        const array = res[0].Productos.map(item => {
          item['cantidad'] = item.Combo_Producto.cantidad
          return item
        })
        setUpdate(true)
        setProduct(array)
      }
      setOpen(true)
      setPath('/product/create')
    }
  }
  const save = () => {
    saveData(tab)
    setOpen(false)
    setIds([])
  }

  const columns = [
    { field: 'sku', headerName: 'Sku', width: 150 },
    { field: 'codebar', headerName: 'Codigo', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'descripcion', headerName: 'Descripción', width: 150 },
    { field: 'unidad', headerName: 'Unidades', width: 150 },
    { field: 'precio', headerName: 'Precio', width: 150 },
    { field: 'createdAt', headerName: 'Fecha', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleValues(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => {
              tab ? destroy(id) : destroyC(id)
            }}
            color="inherit"
          />
        ]
      }
    }
  ]

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '10px',
        width: '100%',
        height: '100%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
      }}
    >
      {path === '/product' ? (
        <>
          <AppBar
            action={setOpen}
            saveData={importExcel}
            allProduct={allProduct}
          />
          {/* <Box sx={{ paddingLeft: 3, paddingRight: 3, paddingTop: 3 }}>
            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                variant={tab ? 'contained' : 'outlined'}
                onClick={() => setTab(true)}
              >
                Productos
              </Button>
              <Button
                variant={tab ? 'outlined' : 'contained'}
                onClick={() => setTab(false)}
              >
                Combos
              </Button>
            </ButtonGroup>
          </Box> */}
          <Box sx={{ height: '700px', width: '100%', padding: 3 }}>
            <DataGrid
              rows={tab ? allProduct : allCombo}
              columns={columns}
              loading={isLoading}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </>
      ) : (
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
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  {update
                    ? `Actualizar ${tab ? 'Producto' : 'Combo'}`
                    : `Crear ${tab ? 'Producto' : 'Combo'}`}
                </Typography>
                <Button disabled={isLoading} color="inherit" onClick={save}>
                  {update ? 'Actualizar' : 'Crear'}
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
                  {tab ? 'Detalles del Producto:' : 'Detalles del Combo:'}
                </Typography>
                <Box sx={{ marginTop: 2 }} />
                <Stack direction="row" spacing={2}>
                  <TextField
                    id="codebar"
                    label="Codebar"
                    size="small"
                    placeholder={codebar}
                    variant="outlined"
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        var code = e.target.value
                        setValues({
                          ...values,
                          codebar: code
                        })
                        document.getElementById('sku').focus()
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
                    fullWidth
                  />
                  <TextField
                    id="sku"
                    label="Sku"
                    size="small"
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        document.getElementById('nombre').focus()
                      }
                    }}
                    value={sku}
                    variant="outlined"
                    onChange={handleChange('sku')}
                    fullWidth
                  />
                </Stack>

                <Box sx={{ marginTop: 2 }} />
                <TextField
                  id="nombre"
                  label="Nombre"
                  size="small"
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      document.getElementById('descripcion').focus()
                    }
                  }}
                  variant="outlined"
                  value={nombre}
                  onChange={handleChange('nombre')}
                  fullWidth
                />
                <Box sx={{ marginTop: 2 }} />
                <TextField
                  id="descripcion"
                  label="Descripción"
                  size="small"
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      document.getElementById('unidad').focus()
                    }
                  }}
                  value={descripcion}
                  variant="outlined"
                  onChange={handleChange('descripcion')}
                  fullWidth
                />
                <Box sx={{ marginTop: 2 }} />
                <Stack direction="row" spacing={2}>
                  <TextField
                    id="unidad"
                    label="Unidad"
                    size="small"
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        document.getElementById('precio').focus()
                      }
                    }}
                    value={unidad}
                    type="number"
                    onChange={handleChange('unidad')}
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    id="precio"
                    label="Precio"
                    size="small"
                    value={precio}
                    type="number"
                    variant="outlined"
                    onChange={handleChange('precio')}
                    fullWidth
                  />
                </Stack>
                <Box sx={{ marginTop: 2 }} />

                {!tab && (
                  <>
                    <Typography variant="h6" component="div">
                      Productos del Combo:
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
                      {!update && (
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
                                addProducList(code)
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

                          <Button
                            sx={{ marginLeft: 'auto' }}
                            variant="contained"
                            color="error"
                            onClick={emptyList}
                          >
                            Borrar Todo
                          </Button>
                        </Box>
                      )}

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
                          height: '250px',
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
                            update={update}
                            destroy={() => removeProducList(key)}
                            operationQuantity={operationQuantity}
                          />
                        ))}
                      </Scrollbars>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Dialog>
        </Box>
      )}
    </Box>
  )
}

export default ProductView
