import { Box, Typography } from '@mui/material'
import React from 'react'

const ComingSoon = () => {
  return (
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
  )
}

export default ComingSoon
