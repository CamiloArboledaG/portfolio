import {
  AppBar,
  Box,
  Button,
  Divider,
  FormControl,
  Hidden,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IconChangeButton from './components/IconChangeButton'

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
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <AppBar
            position="static"
            style={{ display: 'flex', flexDirection: 'row', height: '66px' }}
          >
            <Box paddingRight="20px">
              <IconChangeButton size="66px" fontSize="28px" />
            </Box>
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
              onClick={() => handleButtonClick('blog')}
              style={{
                borderRadius: '0px',
                flex: '1',
                ...(activeButton === 'blog' && {
                  boxShadow: '0px 0px 0px #2D1F33',
                  transform: 'translate(10px, 10px)',
                }),
              }}
            >
              <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>BLOG</Typography>
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
        </Box>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <AppBar
            position="static"
            style={{ display: 'flex', flexDirection: 'row', height: '66px' }}
          >
            <Box paddingRight="20px">
              <IconChangeButton size="66px" fontSize="28px" />
            </Box>
            <FormControl
              fullWidth
              sx={{ padding: '0px 10px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            >
              <Select
                id="demo-simple-select"
                value={activeButton}
                onChange={(event) => handleButtonClick(event.target.value)}
                variant="outlined"
                displayEmpty
                sx={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                <MenuItem value="home" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  HOME
                </MenuItem>
                <MenuItem value="works" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  WORKS
                </MenuItem>
                <MenuItem value="info" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  INFO
                </MenuItem>
                <MenuItem value="blog" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  BLOG
                </MenuItem>
                <MenuItem value="more" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  MORE
                </MenuItem>
              </Select>
            </FormControl>
          </AppBar>
        </Box>
      </div>
      <div
        style={{
          margin: '20px',
          backgroundColor: '#ECF0F1',
          borderRadius: '15px',
          border: '10px solid #6B487A',
          height: 'calc(100% - 146px)', // Asegura que el div interno tenga la altura mínima
          overflow: 'auto', // Scroll automático cuando el contenido sobrepasa la altura
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default App
