import { Box, Typography } from '@mui/material'
import React from 'react'

const More = () => {
  return (
    <Box padding="50px" height="100%">
      <Box>
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
            paddingBottom: '25px',
          }}
        >
          MORE
        </Typography>
      </Box>

      {/* Imágenes en la esquina inferior derecha */}
      <Box
        gap="30px"
        display="flex"
        flexDirection="column"
        justifyContent="center" // Alinea las imágenes a la derecha
        alignItems="center" // Alinea las imágenes al fondo del contenedor
      >
        <img
          src="notFound.svg"
          alt="Image Works alt"
          style={{
            maxHeight: '100px',
            width: 'auto',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '5px 5px 0px 0px',
          }}
        />
        <Typography>COMING SOON</Typography>
      </Box>
    </Box>
  )
}

export default More
