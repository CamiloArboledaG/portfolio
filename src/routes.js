import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Inicio from './views/Inicio/Inicio'
import App from './App'
import Home from './views/home/Home'
import { getSession } from './utils/utils'
import Works from './views/works/Works'
import Info from './views/info/Info'
import More from './views/more/More'
import { Blog } from './views/blog/Blog'
import { BlogView } from './views/blog/BlogView'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // Inicializa como null
  const [loading, setLoading] = useState(true) // Estado de carga

  useEffect(() => {
    const session = getSession()
    if (session?.iniciado) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setLoading(false) // Finaliza la carga después de la verificación
  }, [])

  if (loading) {
    return <div>Loading...</div> // Puedes cambiarlo a un spinner u otro indicador de carga
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<App />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/works"
            element={
              <ProtectedRoute>
                <Works />
              </ProtectedRoute>
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute>
                <Info />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more"
            element={
              <ProtectedRoute>
                <More />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <BlogView />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Inicio />}></Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
