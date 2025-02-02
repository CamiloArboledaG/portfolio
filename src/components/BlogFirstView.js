import { Box } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const BlogFirstView = ({ title, summary, date, id }) => {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate(`/blog/${id}`)
  }

  return (
    <Box
      className="flex flex-col min-w-10 p-5 m-2 mb-10 cursor-pointer rounded-lg"
      sx={{
        boxShadow: '5px 5px 0px #2D1F33',
        borderRadius: '15px',
        border: '1px solid #2D1F33',
        transition: 'box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out', // Controlar la transición
        '&:hover': {
          boxShadow: '10px 10px 0px #2D1F33', // Mantener la sombra en hover
          transform: 'translate(-5px, -5px)', // Desplazar el botón para tapar la sombra
        },
        '&:active': {
          boxShadow: '0px 0px 0px #2D1F33', // Cambiar la sombra en active para parecer que el botón se mueve sobre la sombra
          transform: 'translate(5px, 5px)', // Desplazar el botón para tapar la sombra
        },
      }}
      onClick={handleButtonClick}
    >
      <h1 className="font-bold text-4xl max-2xl:text-2xl">{title}</h1>
      <span className="text-xs italic">{date}</span>
      <span className="py-3">{summary}</span>
    </Box>
  )
}
