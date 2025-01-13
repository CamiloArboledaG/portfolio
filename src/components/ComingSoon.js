import { Box, Typography } from '@mui/material'
import React from 'react'
import ImageWithSkeleton from './ImageWithSkeleton'

const ComingSoon = () => {
  return (
    <Box
      gap="30px"
      display="flex"
      flexDirection="column"
      justifyContent="center" // Alinea las imágenes a la derecha
      alignItems="center" // Alinea las imágenes al fondo del contenedor
    >
      <ImageWithSkeleton
        src="notFound.svg"
        alt="Image Works alt"
        width={101} // Ancho de la imagen original
        height={86} // Alto de la imagen original
        imagesStyles={{
          width: '101px', // Define el ancho en píxeles
          borderRadius: '8px',
        }}
      />
      <Typography>COMING SOON</Typography>
    </Box>
  )
}

export default ComingSoon
