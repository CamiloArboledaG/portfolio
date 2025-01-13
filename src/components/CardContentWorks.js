import { Box, Typography } from '@mui/material'
import React from 'react'
import ImageWithSkeleton from './ImageWithSkeleton'

const CardContentWorks = ({ srcImage, title }) => {
  return (
    <Box
      width="300px"
      height="200px"
      bgcolor="#302933"
      borderRadius="5px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <ImageWithSkeleton
        src={srcImage}
        alt="Image Works alt"
        width={140} // Ancho de la imagen original
        height={140} // Alto de la imagen original
        imagesStyles={{
          width: '140px',
          height: '140px',
          objectFit: 'cover', // Hace que la imagen se ajuste y llene el espacio manteniendo la proporción
          borderRadius: '5px 5px 0px 0px',
        }}
      />
      <Box
        bgcolor="#433847"
        height="60px"
        display="flex"
        alignItems="center"
        padding="10px"
        borderRadius="0px 0px 5px 5px"
        width="300px"
      >
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 'bolder',
            letterSpacing: '0.15em',
            color: '#ffffff',
            textTransform: 'uppercase', // Convierte todo el texto a mayúsculas
            padding: '18px 10px',
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  )
}

export default CardContentWorks
