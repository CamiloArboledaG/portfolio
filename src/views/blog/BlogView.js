import React, { useEffect, useState } from 'react'
import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import blogJson from './blogJson.json'
import { useParams } from 'react-router-dom'

export const BlogView = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { id } = useParams() // Obtiene el id del blog de la URL
  const [content, setContent] = useState('')

  useEffect(() => {
    // Cargar el archivo .html cuando cambie el id
    fetch(`/blog/${id}.html`)
      .then((response) => response.text()) // Lee el archivo como texto
      .then((data) => setContent(data)) // Establece el contenido en el estado
      .catch((error) => console.error('Error al cargar el archivo HTML', error))
  }, [id])

  // Buscar el blog por ID
  const blog = blogJson.blog.find((item) => item.id.toString() === id)

  if (!blog) {
    return (
      <Box padding="50px">
        <Typography>No blog found</Typography>
      </Box>
    )
  }

  return (
    <Box className="flex mb-5 flex-col" padding={isSmallScreen ? '1em' : '50px'}>
      <h1 className="font-bold text-6xl">{blog.title}</h1>
      <span className="text-xs py-3 italic">{blog.date}</span>
      <span className="py-3">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        )}
      </span>
    </Box>
  )
}
