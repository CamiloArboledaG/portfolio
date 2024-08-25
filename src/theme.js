import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Define el tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#8E44AD',
    },
    secondary: {
      main: '#ECF0F1',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#8E44AD',
    },
    third: {
      main: '#6B487A',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          padding: '10px 10px',
          boxShadow: '10px 10px 0px #2D1F33',
          transition: 'box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out', // Controlar la transición
          '&:hover': {
            boxShadow: '15px 15px 0px #2D1F33', // Mantener la sombra en hover
            transform: 'translate(-5px, -5px)', // Desplazar el botón para tapar la sombra
            backgroundColor: '#ECF0F1',
          },
          '&:active': {
            boxShadow: '0px 0px 0px #2D1F33', // Cambiar la sombra en active para parecer que el botón se mueve sobre la sombra
            transform: 'translate(10px, 10px)', // Desplazar el botón para tapar la sombra
            transition: 'none', // Eliminar la transición en active para evitar movimientos raros
            backgroundColor: '#ECF0F1',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          boxShadow: 'none',
        },
      },
    },
  },
})

export default theme
