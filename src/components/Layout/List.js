import { Box, Typography, IconButton, TextField } from '@mui/material'
import { Delete, Add, Remove } from '@mui/icons-material'

export const ListItem = ({ title, price, cantidad, operationQuantity, destroy, id, update }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderRadius: 2,
        backgroundColor: '#EDEFF3',
        marginBottom: '4px'
      }}
    >
      <Typography variant="subtitle1" sx={{width:"100px"}} component="div">
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ marginLeft: 'auto',width:"150px" }}
        component="div"
      >
        Precio: {price}
      </Typography>
      <Box sx={{ marginLeft: 'auto' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => operationQuantity(id, "cantidad", "resta")}
        >
          <Remove />
        </IconButton>
        <TextField
          label="Cantidad"
          size="small"
          sx={{width:"80px",  marginLeft: 'auto'}}
          disabled={true}
          value={cantidad}
          variant="outlined"
        />
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => operationQuantity(id, "cantidad", "suma")}
          sx={{ marginLeft: 'auto' }}
        >
          <Add />
        </IconButton>
      </Box>

      <IconButton
        edge="start"
        color="inherit"
        disabled={update}
        sx={{ marginLeft: 'auto' }}
        aria-label="close"
        onClick={destroy}
      >
        <Delete />
      </IconButton>
    </Box>
  )
}
