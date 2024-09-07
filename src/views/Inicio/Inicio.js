import React, { useState, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { setSession } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

const Inicio = () => {
  const changeIcon = ['🦒', '🦉', '💜']
  const [index, setIndex] = useState(0)
  const [combo, setCombo] = useState(0)
  const lastClickTime = useRef(0)
  const comboTimeout = useRef(null)
  const theme = useTheme()
  const comboHeight = 60 // Altura del componente de combo
  const navigate = useNavigate()

  const resetCombo = () => {
    setCombo(0)
  }

  useEffect(() => {
    return () => {
      if (comboTimeout.current) {
        clearTimeout(comboTimeout.current)
      }
    }
  }, [])

  const changeIconButton = () => {
    const currentTime = new Date().getTime()
    const timeSinceLastClick = currentTime - lastClickTime.current

    if (timeSinceLastClick <= 500) {
      setCombo((prevCombo) => prevCombo + 1)
    } else {
      setCombo(1)
    }

    lastClickTime.current = currentTime

    if (comboTimeout.current) {
      clearTimeout(comboTimeout.current)
    }
    comboTimeout.current = setTimeout(resetCombo, 500)

    let newIndex = index + 1
    if (newIndex >= changeIcon.length) newIndex = 0
    setIndex(newIndex)
  }

  const handleComenzar = () => {
    setSession({ iniciado: true })
    navigate('/home')
  }

  return (
    <div className="h-screen">
      <Container className="flex h-full relative">
        <Box
          className="absolute left-0"
          style={{
            top: combo > 1 ? 0 : -comboHeight,
            transition: 'top 0.3s ease-out',
          }}
        >
          <Box
            style={{
              backgroundColor: theme.palette.secondary.main,
              borderRadius: '0px 0px 15px 15px',
              borderStyle: 'solid',
              borderWidth: '0 10px 10px 10px',
              borderColor: theme.palette.third.main,
              padding: '10px 40px',
              height: `${comboHeight}px`,
            }}
          >
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              Combo x{combo}
            </Typography>
          </Box>
        </Box>
        <Box className="flex items-center justify-between h-full flex-col p-20">
          <div className=""></div>
          <Button
            onClick={changeIconButton}
            variant="contained"
            color="secondary"
            className="p-10 m-12"
            style={{ fontSize: '48px', width: '100px', height: '100px' }}
          >
            {changeIcon[index]}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '299px' }}
            onClick={handleComenzar}
          >
            Comenzar
          </Button>
        </Box>
      </Container>
    </div>
  )
}

export default Inicio
