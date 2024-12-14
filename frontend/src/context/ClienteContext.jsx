import { createContext, useState } from 'react'

export const ClienteContext = createContext({})

export function ClienteProvider({ children }) {
  const [clienteId, setClienteId] = useState(null)
  const [userId, setUserId] = useState(null)

  return (
    <ClienteContext.Provider
      value={{
        clienteId,
        setClienteId,
        setUserId,
        userId,
      }}
    >
      {children}
    </ClienteContext.Provider>
  )
}
