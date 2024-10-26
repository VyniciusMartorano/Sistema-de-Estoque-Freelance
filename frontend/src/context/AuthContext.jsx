import { AxiosError } from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'sonner'

import { apiBase } from '@/api/apibase'
import { AuthService } from '@/services/auth'

import Service from './service'

export const AuthContext = createContext({})
const service = new Service()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies([
    'auth.token',
    'auth.refreshToken',
  ])

  const token = cookies['auth.token']
  const refreshToken = cookies['auth.refreshToken']
  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      apiBase.interceptors.response.use(
        (response) => {
          return response
        },
        async (error) => {
          if (
            error.response?.status !== 401 ||
            error.response?.data.detail ===
              'No active account found with the given credentials'
          ) {
            return Promise.reject(error)
          }
          if (error.response.status === 'falha') {
            return Promise.reject(error)
          }

          if (error.config.url === '/refresh') {
            signOut()

            return Promise.reject(error)
          }

          return apiBase
            .post('/refresh', {
              refresh: refreshToken,
            })
            .then((response) => {
              error.response.config.headers.Authorization = `Bearer ${response.data.access}`
              apiBase.defaults.headers.Authorization = `Bearer ${response.data.access}`

              setCookie('auth.token', response.data.access, {
                path: '/',
              })

              setCookie('auth.refreshToken', refreshToken, {
                path: '/',
              })

              return apiBase(error.response.config)
            })
            .catch(() => signOut())
        }
      )

      if (!user?.username) {
        apiBase.defaults.headers.Authorization = `Bearer ${token}`
        setIsLoading(true)
        toast.promise(
          AuthService.getUserData(token)
            .then((user) => {
              if (user.username) {
                setUser(user)
              }
            })
            .finally(() => setIsLoading(false))
        )
      }
    }
  }, [token])

  async function signUp({ cpf, username, password }) {
    try {
      const userRegistered = await service.getUserRegistered(username)

      if (userRegistered) {
        await service.changeUserPassword({
          username,
          cpf,
          password,
          userId: userRegistered.id,
        })
      }
      await signIn({ username, password })
    } catch (error) {
      throw new AxiosError(error)
    }
  }

  async function signIn({ username, password }) {
    try {
      const response = await service.signIn({
        username,
        password,
      })

      const { access, refresh } = response.data

      console.log(apiBase)
      apiBase.axios.defaults.headers.Authorization = `Bearer ${access}`
      service.getUser(access).then(({ data }) => setUser(data))

      setCookie('auth.token', access, {
        path: '/',
      })

      setCookie('auth.refreshToken', refresh, {
        path: '/',
      })
    } catch (err) {
      throw new AxiosError(err)
    }
  }

  function signOut() {
    removeCookie('auth.token', { path: '/' })
    removeCookie('auth.refreshToken', { path: '/' })
    setUser(undefined)
    apiBase.defaults.headers.Authorization = ''
  }

  function validateUserPermission(permission) {
    const userPermissions = user?.user_permissions
    if (!userPermissions) {
      return false
    }
    return userPermissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        validateUserPermission,
        isAuthenticated,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
