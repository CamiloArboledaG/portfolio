import { Box, Typography } from '@mui/material'
import React from 'react'

const CardContentWorks = () => {
  return (
    <Box maxWidth="300px" maxHeight="180px" bgcolor="#302933" borderRadius="5px">
      <img
        src="pruebaCard.svg"
        alt="Camilo Arboleda Avatar"
        style={{
          maxHeight: '140px',
          width: '100%',
          height: '100%', // Hace que ocupe todo el contenedor
          objectFit: 'cover', // Hace que la imagen se ajuste y llene el espacio manteniendo la proporción
          borderRadius: '5px 5px 0px 0px',
        }}
      />
      <Box
        bgcolor="#433847"
        height="40px"
        display="flex"
        alignItems="center"
        padding="10px"
        borderRadius="0px 0px 5px 5px"
      >
        <Typography
          style={{
            fontSize: '16px',
            fontWeight: 'bolder',
            letterSpacing: '0.15em',
            color: '#ffffff',
          }}
        >
          Prueba
        </Typography>
      </Box>
    </Box>
  )
}

export default CardContentWorks
