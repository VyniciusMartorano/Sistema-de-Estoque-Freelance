import { CookiesProvider } from 'react-cookie'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AlmoxarifadoProvider } from './context/AlmoxarifadoContext'
import { AuthProvider } from './context/AuthContext'
import { privateRoutes } from './routes/private'
import { publicRoutes } from './routes/public'

export const router = createBrowserRouter([publicRoutes, privateRoutes])

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AuthProvider>
          <AlmoxarifadoProvider>
            <RouterProvider router={router}></RouterProvider>
          </AlmoxarifadoProvider>
        </AuthProvider>
      </CookiesProvider>
    </>
  )
}
