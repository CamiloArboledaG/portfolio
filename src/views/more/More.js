import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import ComingSoon from '../../components/ComingSoon'

const More = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box padding={isSmallScreen ? '1em' : '50px'} height="100%">
      <Box>
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
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
      <ComingSoon />
    </Box>
  )
}

export default More
