import React from 'react'
import {
  Box,
  Button,
  Typography,
  TextField,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Chip,
  Link
} from '@mui/material'
import { AppBar } from '../../components'
import { ExpandMore } from '@mui/icons-material'

const { shell } = window.require('electron')

const SettingView = ({
  licenseKey,
  isLicense,
  isLoading,
  handleChange,
  saveData
}) => {
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

      <Box sx={{ padding: 15 }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ width: '20%', flexShrink: 0 }}>
              Licencia{' '}
            </Typography>
            <Chip
              label={isLicense ? 'Licencia Registrada' : 'Registra tu Licencia'}
              color={isLicense ? 'success' : 'warning'}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%', padding: 3 }}>
              <TextField
                id="outlined-basic"
                label="Licencia"
                size="small"
                value={licenseKey}
                onChange={handleChange('licenseKey')}
                fullWidth
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={saveData}
                disabled={isLoading}
                sx={{ marginTop: 3, width: '100%' }}
              >
                {isLicense ? 'Actualizar Licencia' : 'Registrar Licencia'}
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography sx={{ width: '20%', flexShrink: 0 }}>
              Información
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Conoce un poco más sobre nuestra aplicación
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%', padding: 3 }}>
              <Typography>
                Solución de gestión de inventarios local con funciones de
                códigos de barras, entrada y salidas de inventario, graficas y
                muchas cosas más.
              </Typography>
              <Box sx={{ marginTop: 2 }} />
              <Typography>
                Nuestra Versión Gratuita cuenta con un limite de creación de 50
                Sku, posteriormente sera necesario adquirir una licencia, la
                cual puedes adquirir por un bajo costo en{' '}
                <Link
                  color="secondary"
                  onClick={async () =>
                    await shell.openExternal(
                      'https://duoloon.com/tienda/licencia-inventario-duosimple/'
                    )
                  }
                  underline="always"
                >
                  {'nuestro portal web.'}
                </Link>
              </Typography>
              <Box sx={{ marginTop: 2 }} />
              <Typography>
                Tambien si deseas conocer mas acerca de nuestros productos,
                puedes visitar nuestra{' '}
                <Link
                  color="secondary"
                  onClick={async () =>
                    await shell.openExternal('https://duoloon.com/tienda/')
                  }
                  underline="always"
                >
                  {'tienda.'}
                </Link>
              </Typography>

              <Box sx={{ marginTop: 2 }} />
              <Typography>
                Si deseas conocer más información acerca de nuestros servicios,
                puedes contactarnos a nuestro correo {' '}
                <Link color="secondary" underline="always">
                  {'hola@duoloon.com'}
                </Link>{' '}
                de atención al cliente o puedes escribirnos mediante{' '}
                <Link
                  color="secondary"
                  onClick={async () =>
                    await shell.openExternal(
                      'https://api.whatsapp.com/send/?phone=56937585831&text&app_absent=0'
                    )
                  }
                  underline="always"
                >
                  {'whatsapp.'}
                </Link>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

export default SettingView
