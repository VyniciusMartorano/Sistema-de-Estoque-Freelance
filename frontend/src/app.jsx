import { QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AlmoxarifadoProvider } from './context/AlmoxarifadoContext'
import { AuthProvider } from './context/AuthContext'
import { GrupoItemProvider } from './context/GrupoItemContext'
import { MDFeProvider } from './context/MDFeContext'
import { queryClient } from './lib/react-query'
import { router } from './router'

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <AuthProvider>
            <MDFeProvider>
                <AlmoxarifadoProvider>
                  <RouterProvider router={router}></RouterProvider>
                </AlmoxarifadoProvider>
            </MDFeProvider>
          </AuthProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </>
  )
}
