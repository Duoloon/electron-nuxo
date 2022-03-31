import React, { useState, forwardRef } from 'react'
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
  Switch,
  FormControlLabel
} from '@mui/material'
import { AppBar, Search } from '../../components'
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import { useLocation } from '../../Hooks'
import CloseIcon from '@mui/icons-material/Close'
import { Delete, Edit } from '@mui/icons-material'
import Slide from '@mui/material/Slide'
import { titles } from '../../variables'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const HistoryView = ({ data, isLoading, path }) => {
  const columnsEntry = [
    {
      field: 'proveedor',
      headerName: 'Nombre Proveedor',
      width: 150,
      valueGetter: ({ row }) => row.Proveedor?.nombre
    },
    {
      field: 'rut',
      headerName: 'Rut Proveedor',
      width: 150,
      valueGetter: ({ row }) => row.Proveedor?.rut
    },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'productos',
      headerName: 'Producto',
      width: 150,
      valueGetter: ({ row }) => row.Productos[0]?.nombre
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      type: 'number',
      width: 150,
      valueGetter: ({ row }) => row.Productos[0]?.Entrada_Producto?.cantidad
    },
    { field: 'nota', headerName: 'Notas', width: 150 },
    { field: 'date', headerName: 'Fecha', width: 150 }
  ]
  const columnsExit = [
    {
      field: 'cliente',
      headerName: 'Nombre Cliente',
      width: 150,
      valueGetter: ({ row }) => row.Cliente?.nombre
    },
    {
      field: 'rut',
      headerName: 'Rut Cliente',
      width: 150,
      valueGetter: ({ row }) => row.Cliente?.rut
    },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'productos',
      headerName: 'Producto',
      width: 150,
      valueGetter: ({ row }) => row.Productos[0]?.nombre
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      type: 'number',
      width: 150,
      valueGetter: ({ row }) => row.Productos[0]?.Salida_Producto?.cantidad
    },
    { field: 'nota', headerName: 'Notas', width: 150 },
    { field: 'date', headerName: 'Fecha', width: 150 }
  ]
  const datos = {
    rows: data,
    columns: path === '/inventory/history/entry' ? columnsEntry : columnsExit
  }
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
    </Box>
  )
}

export default HistoryView
