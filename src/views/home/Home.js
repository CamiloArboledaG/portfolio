import { Typography } from '@mui/material'
import React from 'react'

const Home = () => {
  return (
    <div className=" flex">
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '8em',
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
          marginRight: '8em',
        }}
      >
        <Typography
          style={{
            fontSize: '68px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            color: '#2D1F33',
          }}
        >
          CAMILO ARBOLEDA
        </Typography>
        <Typography
          style={{
            fontSize: '24px',
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
            fontSize: '16px',
            fontWeight: 'lighter',
            letterSpacing: '0.10em',
            color: '#2D1F33',
          }}
        >
          I'm a Full Stack developer who lives in Cali, Colombia.
          <br />
          <br />I am a person who likes to take on important challenges to strengthen my knowledge
          and advance my skills. I have a passion for both frontend and backend development, finding
          joy in creating seamless and efficient applications from start to finish. Whether it's
          designing intuitive and responsive user interfaces or building robust server-side logic, I
          am committed to delivering high-quality solutions.
        </Typography>
      </div>
    </div>
  )
}

export default Home
