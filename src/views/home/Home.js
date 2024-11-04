import { Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

const Home = () => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('xl'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
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
          margin: isSmallScreen ? '1em' : '8em',
          maxWidth: '50%',
        }}
      >
        <img
          src="yo.svg"
          alt="Camilo Arboleda Avatar"
          style={{
            height: 'auto',
            maxWidth: '400px',
            minWidth: '200px',
            width: '100%',
            boxShadow: '10px 10px 0px #2D1F33',
            borderRadius: '15px',
          }}
        />
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
