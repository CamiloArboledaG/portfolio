import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'
import CardContentWorks from '../../components/CardContentWorks'
import ComingSoon from '../../components/ComingSoon'

const Works = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box display="flex" flexDirection="column" padding={isSmallScreen ? '1em' : '50px'}>
      <Box flex="1" paddingBottom="50px">
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
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
          padding="1em"
          sx={{
            scrollbarWidth: 'thin', // Para navegadores que soporten un scrollbar más delgado
            '&::-webkit-scrollbar': { height: '8px' }, // Para navegadores basados en Webkit
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          }}
        >
          <ComingSoon />
        </Box>
      </Box>
      <Box flex="1">
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
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
          padding="1em"
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
