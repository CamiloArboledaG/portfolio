import { Box, Typography } from '@mui/material'
import React from 'react'
import CardContentWorks from '../../components/CardContentWorks'

const Works = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%" padding="50px">
      <Box flex="1">
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          WORKS
        </Typography>
        <Box>
          <CardContentWorks />
        </Box>
      </Box>
      <Box flex="1">
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          JOBS
        </Typography>
        <Box>
          <CardContentWorks />
        </Box>
      </Box>
    </Box>
  )
}

export default Works
