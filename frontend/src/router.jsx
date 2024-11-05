import { CookiesProvider } from 'react-cookie'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AuthProvider } from './context/AuthContext'
import { ClienteProvider } from './context/ClienteContext'
import { privateRoutes } from './routes/private'
import { publicRoutes } from './routes/public'

export const router = createBrowserRouter([publicRoutes, privateRoutes])

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AuthProvider>
          <ClienteProvider>
            <RouterProvider router={router}></RouterProvider>
          </ClienteProvider>
        </AuthProvider>
      </CookiesProvider>
    </>
  )
}
