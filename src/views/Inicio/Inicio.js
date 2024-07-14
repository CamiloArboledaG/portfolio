import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Inicio() {
    const [changeIcon, setChangeIcon] = useState(["🦒", "🦉", "💜"])
    const [index, setIndex] = useState(0)
    const [combo, setCombo] = useState(0)
    const lastClickTime = useRef(0)
    const comboTimeout = useRef(null)
    const theme = useTheme();

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

        if (timeSinceLastClick <= 1000) {
            setCombo(prevCombo => prevCombo + 1)
        } else {
            setCombo(1)
        }

        lastClickTime.current = currentTime

        if (comboTimeout.current) {
            clearTimeout(comboTimeout.current)
        }
        comboTimeout.current = setTimeout(resetCombo, 1000)

        let newIndex = index + 1
        if (newIndex >= changeIcon.length) newIndex = 0
        setIndex(newIndex)
    }

    return (
        <Container className='flex h-full relative'>
            {combo > 1 && (
                <Box className="absolute top-4 left-4" style={{ backgroundColor: theme.palette.secondary.main }} >
                    <Typography
                        variant="h6"
                        style={{ fontWeight: 'bold', }}
                    >
                        Combo x{combo}
                    </Typography>
                </Box>
            )}
            <Box className="flex items-center justify-between h-full flex-col p-20" >
                <div className=''></div>
                <Button onClick={changeIconButton} variant="contained" color="secondary" className='p-10 m-12' style={{ fontSize: '48px', width: '100px', height: '100px' }}>
                    {changeIcon[index]}
                </Button>
                <Button variant="contained" color="secondary" style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '299px' }}>
                    Comenzar
                </Button>
            </Box>
        </Container>
    );
}

export default Inicio;