import { AppBar, Button, Divider, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function App() {
  const [activeButton, setActiveButton] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName)
    navigate(buttonName)
  }

  useEffect(() => {
    const currentPath = location.pathname.replace('/', '')
    setActiveButton(currentPath || 'home')
  }, [location])

  return (
    <div className="h-screen">
      <div className="p-5">
        <AppBar position="static" style={{ display: 'flex', flexDirection: 'row', height: '66px' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('home')}
            style={{
              borderRadius: '15px 0px 0px 15px',
              flex: '1',
              ...(activeButton === 'home' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>HOME</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px', borderColor: 'transparent' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('works')}
            style={{
              borderRadius: '0px',
              flex: '1',
              ...(activeButton === 'works' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>WORKS</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px', borderColor: 'transparent' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('info')}
            style={{
              borderRadius: '0px',
              flex: '1',
              ...(activeButton === 'info' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>INFO</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px', borderColor: 'transparent' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('more')}
            style={{
              borderRadius: '0px 15px 15px 0px',
              flex: '3',
              ...(activeButton === 'more' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>MORE</Typography>
          </Button>
        </AppBar>
      </div>
      <div
        className="p-5"
        style={{ minHeight: 'calc(100% - 106px)', display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            backgroundColor: '#ECF0F1',
            flexGrow: 1, // Esto asegura que el div ocupe todo el espacio disponible
            borderRadius: '15px',
            border: '10px solid #6B487A',
            minHeight: '100%', // Asegura que el div interno tenga la altura mínima
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
