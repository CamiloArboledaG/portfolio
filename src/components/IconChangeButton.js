import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'

const IconChangeButton = ({ onClickBefore = () => {}, size = '100px', fontSize = '48px' }) => {
  const changeIcon = ['🦒', '🦉', '💜']
  const [index, setIndex] = useState(0)

  // Cargar el índice desde localStorage cuando el componente se monte
  useEffect(() => {
    const storedIndex = localStorage.getItem('iconIndex')
    if (storedIndex !== null) {
      setIndex(parseInt(storedIndex, 10))
    }
  }, [])

  const changeIconButton = () => {
    onClickBefore()
    let newIndex = index + 1
    if (newIndex >= changeIcon.length) newIndex = 0
    setIndex(newIndex)

    // Guardar el nuevo índice en localStorage
    localStorage.setItem('iconIndex', newIndex)
  }

  return (
    <Button
      onClick={changeIconButton}
      variant="contained"
      color="secondary"
      className="p-10 m-12"
      style={{ fontSize: fontSize, width: size, height: size }}
    >
      {changeIcon[index]}
    </Button>
  )
}

export default IconChangeButton
