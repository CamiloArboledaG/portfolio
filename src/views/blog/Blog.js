import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { BlogFirstView } from '../../components/BlogFirstView'
import blogJson from './blogJson.json'

export const Blog = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box display="flex" flexDirection="column" padding={isSmallScreen ? '1em' : '50px'}>
      <Box className="mb-5">
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          BLOG
        </Typography>
        <span>This blog is for practicing my English and writing by sharing my opinion</span>
      </Box>
      <Box className="flex-wrap">
        {blogJson.blog.map((blog) => (
          <BlogFirstView title={blog.title} summary={blog.summary} date={blog.date} id={blog.id} />
        ))}
      </Box>
    </Box>
  )
}
