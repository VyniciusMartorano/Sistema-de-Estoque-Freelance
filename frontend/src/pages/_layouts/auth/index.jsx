import { Card } from 'primereact/card'
import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import logomarca from '@/assets/logo.png'
import { AuthContext } from '@/context/AuthContext'

export function AuthLayout() {
  const { isAuthenticated } = useContext(AuthContext)
  const { pathname } = useLocation()

  if (isAuthenticated) {
    return <Navigate to="/homepage" />
  }

  if (!isAuthenticated && pathname === '/') {
    return <Navigate to="/login" />
  }

  return (
    <div className="bg-auth-gradient-radial flex min-h-screen items-center justify-center">
      <div className="flex h-full w-full items-center justify-center">
        <Card
          className="border-1 w-[80%] rounded-lg bg-white p-0 shadow-xl lg:w-3/6 xl:w-2/6"
          header={
            <div className="bg-sgc-blue-background-light rounded-t-lg p-4">
              <img
                src={logomarca}
                className="m-auto block w-36"
                alt="Logo Simas Industrial"
              />
            </div>
          }
        >
          <Outlet />
        </Card>
      </div>
    </div>
  )
}
