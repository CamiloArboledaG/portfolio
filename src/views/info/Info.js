import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import ImageWithSkeleton from '../../components/ImageWithSkeleton'

const Info = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={isSmallScreen ? '1em' : '50px'}
      height="100%"
      justifyContent="space-between"
    >
      <Box>
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          INFO
        </Typography>
      </Box>

      {/* Imágenes en la esquina inferior derecha */}
      <Box
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        padding={isSmallScreen ? '25px 0px' : ''}
        gap="30px"
        justifyContent="flex-end" // Alinea las imágenes a la derecha
        alignItems="flex-end" // Alinea las imágenes al fondo del contenedor
      >
        <a href="https://github.com/CamiloArboledaG" target="_blank" rel="noopener noreferrer">
          <Button color="primary" variant="contained">
            <ImageWithSkeleton
              src="github.svg"
              alt="Image Works alt"
              width={50} // Ancho de la imagen original
              height={50} // Alto de la imagen original
              imagesStyles={{
                width: '50px',
                height: '50px',
                objectFit: 'cover', // Hace que la imagen se ajuste y llene el espacio manteniendo la proporción
                borderRadius: '5px 5px 0px 0px',
              }}
            />
          </Button>
        </a>
        <a
          href="https://www.linkedin.com/in/camiloarboledag/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="primary" variant="contained">
            <ImageWithSkeleton
              src="linkedln.svg"
              alt="Image Works alt"
              width={50} // Ancho de la imagen original
              height={50} // Alto de la imagen original
              imagesStyles={{
                width: '50px',
                height: '50px',
                objectFit: 'cover', // Hace que la imagen se ajuste y llene el espacio manteniendo la proporción
                borderRadius: '5px 5px 0px 0px',
              }}
            />
          </Button>
        </a>
        <a href="https://x.com/camilo_arbga" target="_blank" rel="noopener noreferrer">
          <Button color="primary" variant="contained">
            <ImageWithSkeleton
              src="twitter.svg"
              alt="Image Works alt"
              width={50} // Ancho de la imagen original
              height={50} // Alto de la imagen original
              imagesStyles={{
                width: '50px',
                height: '50px',
                objectFit: 'cover', // Hace que la imagen se ajuste y llene el espacio manteniendo la proporción
                borderRadius: '5px 5px 0px 0px',
              }}
            />
          </Button>
        </a>
      </Box>
    </Box>
  )
}

export default Info
