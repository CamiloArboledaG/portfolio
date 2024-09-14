import { Box, Typography } from '@mui/material'
import React from 'react'
import CardContentWorks from '../../components/CardContentWorks'

const Works = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%" padding="50px">
      <Box flex="1" paddingBottom="50px">
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
            paddingBottom: '25px',
          }}
        >
          WORKS
        </Typography>
        <Box
          display="flex"
          overflow="auto" // Permite el scroll horizontal
          flexWrap="nowrap" // Evita que los elementos salten a la siguiente línea
          gap={2} // Espacio entre las tarjetas
          width="100%"
          sx={{
            scrollbarWidth: 'thin', // Para navegadores que soporten un scrollbar más delgado
            '&::-webkit-scrollbar': { height: '8px' }, // Para navegadores basados en Webkit
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          }}
        >
          <CardContentWorks title="COMING SOON" srcImage="notFound.svg" />
        </Box>
      </Box>
      <Box flex="1">
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
            paddingBottom: '25px',
          }}
        >
          JOBS
        </Typography>
        <Box
          display="flex"
          overflow="auto" // Permite el scroll horizontal
          flexWrap="nowrap" // Evita que los elementos salten a la siguiente línea
          gap={2} // Espacio entre las tarjetas
          width="100%"
          sx={{
            scrollbarWidth: 'thin', // Para navegadores que soporten un scrollbar más delgado
            '&::-webkit-scrollbar': { height: '8px' }, // Para navegadores basados en Webkit
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          }}
        >
          <CardContentWorks title="Globe Software" srcImage="globe.svg" />
          <CardContentWorks title="Botmeni" srcImage="botmeni.svg" />
        </Box>
      </Box>
    </Box>
  )
}

export default Works
