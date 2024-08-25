import { AppBar, Button, Divider, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  const [activeButton, setActiveButton] = useState('HOME')

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName)
  }

  return (
    <div className="h-screen">
      <div className="p-5">
        <AppBar position="static" style={{ display: 'flex', flexDirection: 'row', height: '66px' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('HOME')}
            style={{
              borderRadius: '15px 0px 0px 15px',
              flex: '1',
              ...(activeButton === 'HOME' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>HOME</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('WORKS')}
            style={{
              borderRadius: '0px',
              flex: '1',
              ...(activeButton === 'WORKS' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>WORKS</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('INFO')}
            style={{
              borderRadius: '0px',
              flex: '1',
              ...(activeButton === 'INFO' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>INFO</Typography>
          </Button>
          <Divider orientation="vertical" style={{ width: '2px' }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleButtonClick('MORE')}
            style={{
              borderRadius: '0px 15px 15px 0px',
              flex: '3',
              ...(activeButton === 'MORE' && {
                boxShadow: '0px 0px 0px #2D1F33',
                transform: 'translate(10px, 10px)',
              }),
            }}
          >
            <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>MORE</Typography>
          </Button>
        </AppBar>
      </div>
      <Outlet />
    </div>
  )
}

export default App
