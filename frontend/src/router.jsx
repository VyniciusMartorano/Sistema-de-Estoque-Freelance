import { CookiesProvider } from 'react-cookie'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AlmoxarifadoProvider } from './context/AlmoxarifadoContext'
import { AuthProvider } from './context/AuthContext'
import { MDFeProvider } from './context/MDFeContext'
import { privateRoutes } from './routes/private'
import { publicRoutes } from './routes/public'

export const router = createBrowserRouter([publicRoutes, privateRoutes])

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AuthProvider>
          <MDFeProvider>
            <AlmoxarifadoProvider>
              <RouterProvider router={router}></RouterProvider>
            </AlmoxarifadoProvider>
          </MDFeProvider>
        </AuthProvider>
      </CookiesProvider>
    </>
  )
}
