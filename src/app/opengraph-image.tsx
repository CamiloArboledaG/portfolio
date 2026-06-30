import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Camilo Arboleda - Full Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a2e1f',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #2d4a35 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: '#eef2e9',
              letterSpacing: '0.1em',
              marginBottom: 20,
            }}
          >
            CAMILO ARBOLEDA
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: '#e8a04c',
              letterSpacing: '0.05em',
            }}
          >
            Full Stack Developer
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#9aa896',
              marginTop: 30,
              display: 'flex',
              gap: 20,
            }}
          >
            <span>React</span>
            <span>•</span>
            <span>Next.js</span>
            <span>•</span>
            <span>React Native</span>
            <span>•</span>
            <span>Go</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
