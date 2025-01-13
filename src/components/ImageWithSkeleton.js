import React, { useState } from 'react'
import { Skeleton } from '@mui/material'

const ImageWithSkeleton = ({ imagesStyles, width, height, ...props }) => {
  const [loading, setLoading] = useState(true)

  // Calcular el alto en píxeles basado en el ancho y el aspecto de la imagen
  const calculatedWidth = imagesStyles?.width ? parseInt(imagesStyles.width, 10) : 400 // Fallback de 400px
  const calculatedHeight = (calculatedWidth * height) / width // Calcular altura basada en el aspect ratio

  return (
    <>
      {loading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          style={{
            width: `${calculatedWidth}px`, // Ancho absoluto en píxeles
            height: `${calculatedHeight}px`, // Alto absoluto en píxeles
            ...imagesStyles, // Mantener estilos adicionales
          }}
        />
      )}
      <img
        {...props}
        onLoad={() => setLoading(false)}
        style={{
          ...imagesStyles,
          display: loading ? 'none' : 'block',
        }}
      />
    </>
  )
}

export default ImageWithSkeleton
