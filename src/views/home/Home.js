import { Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import ImageWithSkeleton from '../../components/ImageWithSkeleton'

const Home = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [transformStyle, setTransformStyle] = useState({})

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30 // Ajusta 20 para el ángulo
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15
    setTransformStyle({
      transform: `rotateX(${y}deg) rotateY(${x}deg)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-out',
    })
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: isSmallScreen ? 'column-reverse' : 'row',
        height: !isSmallScreen && '100%',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: isSmallScreen ? '1em' : '5em',
          maxWidth: '50%',
        }}
      >
        <div
          style={{
            boxShadow: '10px 10px 0px #2D1F33',
            borderRadius: '15px',
            padding: '10px',
            display: 'inline-block',
            border: '1px solid #2D1F33',
          }}
        >
          <ImageWithSkeleton
            src="yo2.svg"
            alt="Camilo Arboleda Avatar"
            width={1536} // Ancho de la imagen original
            height={2048} // Alto de la imagen original
            imagesStyles={{
              width: isXSmallScreen ? '200px' : '370px', // Define el ancho en píxeles
              maxWidth: '400px', // Asegura un máximo si es necesario
              borderRadius: '8px',
              ...transformStyle,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      <div
        style={{
          flex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          margin: isSmallScreen ? '1em' : '0em 8em 0em 0em',
        }}
      >
        <Typography
          style={{
            fontSize: isMediumScreen ? '36px' : '68px', // Ajuste de fontSize
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          CAMILO ARBOLEDA
        </Typography>
        <Typography
          style={{
            fontSize: isMediumScreen ? '18px' : '24px', // Ajuste de fontSize
            fontWeight: 'bolder',
            letterSpacing: '0.15em',
            color: '#2D1F33',
            margin: '50px 0px',
          }}
        >
          SOFTWARE DEVELOPER
        </Typography>
        <Typography
          style={{
            fontSize: isMediumScreen ? '14px' : '16px', // Ajuste de fontSize
            fontWeight: 'lighter',
            letterSpacing: '0.10em',
            color: '#2D1F33',
          }}
        >
          I'm a Full Stack Developer based in Cali, Colombia.
          <br /> <br /> I am passionate about taking on meaningful challenges that allow me to
          deepen my knowledge and enhance my skills. With a strong enthusiasm for both frontend and
          backend development, I find great satisfaction in crafting seamless and efficient
          applications from concept to completion. Whether I'm designing intuitive, responsive user
          interfaces or implementing robust server-side logic, I am dedicated to delivering
          high-quality solutions that meet user needs and exceed expectations.
        </Typography>
      </div>
    </div>
  )
}

export default Home
