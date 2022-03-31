import React, { useState, forwardRef } from 'react'
import {
  Box,
  Divider,
  Button,
  ButtonGroup,
  Dialog,
  Typography,
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  TextField,
  Switch,
  Stack,
  FormControlLabel
} from '@mui/material'
import { AppBar, Search } from '../../components'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import { useLocation } from '../../Hooks'
import CloseIcon from '@mui/icons-material/Close'
import { Delete, Edit, ViewAgenda } from '@mui/icons-material'
import Slide from '@mui/material/Slide'
import { titles } from '../../variables'
import { Chart } from 'react-charts'
import { ResizableBox } from 'react-resizable'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const InventoryView = ({
  allInventory,
  isLoading,
  graficChange,
  entry,
  exit,
  solapada,
  graficasStock,
  graficasValor,
  graficasexitStock,
  graficasexitValor,
  grafsolapada1,
  grafsolapada2,
  entryChange
}) => {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(1)
  const primaryAxis = React.useMemo(
    () => ({
      getValue: datum => datum.date,
      elementType: 'line'
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: datum => datum.stars,
        elementType: 'line'
      }
    ],
    []
  )
  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Historial',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<ViewAgenda />}
            label="Edit"
            onClick={() => {
              setOpen(true)
              graficChange(id)
              entryChange(id)
            }}
            className="textPrimary"
            color="inherit"
          />
        ]
      }
    },
    {
      field: 'nombre',
      headerName: 'Producto',
      width: 150,
      valueGetter: ({ row }) => row?.Producto?.nombre
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 150,
      type: 'number',
      valueGetter: ({ row }) => row.stock
    },
    {
      field: 'entradasStock',
      headerName: 'Entradas Stock',
      width: 150,
      type: 'number',
      valueGetter: ({ row }) => row.EntradasStock
    },
    {
      field: 'entradasValor',
      headerName: 'Entradas Valor',
      width: 150,
      type: 'number',
      valueGetter: ({ row }) => row.EntradasValor
    },
    {
      field: 'salidasStock',
      headerName: 'Salidas Stock',
      width: 150,
      type: 'number',
      valueGetter: ({ row }) => row.SalidasStock
    },
    {
      field: 'salidasValor',
      headerName: 'Salidas Valor',
      width: 150,
      type: 'number',
      valueGetter: ({ row }) => row.SalidasValor
    },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'createdAt', headerName: 'Fecha', width: 250 }
  ]
  const columnsentry = [
    {
      field: 'nombre',
      headerName: 'Producto',
      width: 150
    },
    {
      field: 'entradasStock',
      headerName: 'Entradas Stock',
      width: 150
    },
    {
      field: 'entradasValor',
      headerName: 'Entradas Valor',
      width: 150
    },
    { field: 'fecha', headerName: 'Fecha', width: 250 }
  ]
  const columnsexit = [
    {
      field: 'nombre',
      headerName: 'Producto',
      width: 150
    },
    {
      field: 'salidasStock',
      headerName: 'Salidas Stock',
      width: 150
    },
    {
      field: 'salidasValor',
      headerName: 'Salidas Valor',
      width: 150
    },
    { field: 'fecha', headerName: 'Fecha', width: 250 }
  ]

  const columnsSolapada = [
    {
      field: 'nombre',
      headerName: 'Producto',
      width: 150
    },
    {
      field: 'entradasStock',
      headerName: 'Entradas Stock',
      width: 150
    },
    {
      field: 'salidasStock',
      headerName: 'Salidas Stock',
      width: 150
    },
    {
      field: 'entradasValor',
      headerName: 'Entradas Valor',
      width: 150
    },

    {
      field: 'salidasValor',
      headerName: 'Salidas Valor',
      width: 150
    },
    { field: 'fecha', headerName: 'Fecha', width: 250 }
  ]
  const datos = { rows: allInventory, columns }
  const datosentry = { rows: entry, columns: columnsentry }
  const datosexit = { rows: exit, columns: columnsexit }
  const datosSolapados = { rows: solapada, columns: columnsSolapada }
  // console.log(graficasentry)
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
      <AppBar />
      <Box sx={{ height: '700px', width: '100%', padding: 3 }}>
        <DataGrid
          {...datos}
          loading={isLoading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <MuiAppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Historial
            </Typography>
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
            <ButtonGroup
              fullWidth
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                variant={tab === 1 ? 'contained' : 'outlined'}
                onClick={() => setTab(1)}
              >
                Entrada
              </Button>
              <Button
                variant={tab === 2 ? 'contained' : 'outlined'}
                onClick={() => setTab(2)}
              >
                Salida
              </Button>
              <Button
                variant={tab === 3 ? 'contained' : 'outlined'}
                onClick={() => setTab(3)}
              >
                Solapada
              </Button>
            </ButtonGroup>
            {tab === 1 && (
              <Box>
                <Box sx={{ marginTop: 2 }} />

                <Box>
                  <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                    <DataGrid
                      {...datosentry}
                      loading={isLoading}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ marginTop: 2 }} />
                <Typography variant="h6" component="div">
                  Graficas:
                </Typography>
                <Box sx={{ marginTop: 2 }} />

                <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: graficasStock,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: graficasValor,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                </Stack>
              </Box>
            )}
            {tab === 2 && (
              <Box>
                <Box sx={{ marginTop: 2 }} />

                <Box>
                  <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                    <DataGrid
                      {...datosexit}
                      loading={isLoading}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ marginTop: 2 }} />
                <Typography variant="h6" component="div">
                  Graficas:
                </Typography>
                <Box sx={{ marginTop: 2 }} />

                <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: graficasexitStock,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: graficasexitValor,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                </Stack>
              </Box>
            )}
            {tab === 3 && (
              <Box>
                <Box sx={{ marginTop: 2 }} />

                <Box>
                  <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                    <DataGrid
                      {...datosSolapados}
                      loading={isLoading}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ marginTop: 2 }} />
                <Typography variant="h6" component="div">
                  Graficas:
                </Typography>
                <Box sx={{ marginTop: 2 }} />

                <Stack direction="row" sx={{ height: '300px' }} spacing={2}>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: grafsolapada1,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                  <ResizableBox width={600} height={300} style={{}}>
                    <Chart
                      options={{
                        data: grafsolapada2,
                        primaryAxis,
                        secondaryAxes
                      }}
                    />
                  </ResizableBox>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default InventoryView
