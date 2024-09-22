import { Box, Typography } from '@mui/material'
import React from 'react'
import ComingSoon from '../../components/ComingSoon'

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
      <ComingSoon />
    </Box>
  )
}

export default More
