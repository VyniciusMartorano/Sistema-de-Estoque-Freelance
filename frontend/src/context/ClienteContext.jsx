import { createContext, useState } from 'react'

export const ClienteContext = createContext({})

export function ClienteProvider({ children }) {
  const [clienteId, setClienteId] = useState(null)

  return (
    <ClienteContext.Provider
      value={{
        clienteId,
        setClienteId,
      }}
    >
      {children}
    </ClienteContext.Provider>
  )
}
