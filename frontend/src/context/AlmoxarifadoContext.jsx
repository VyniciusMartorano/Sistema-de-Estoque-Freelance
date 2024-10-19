import { createContext, ReactNode, useState } from 'react'



export const AlmoxarifadoContext = createContext({})

export function AlmoxarifadoProvider({ children }) {
  const [almoxarifadoId, setAlmoxarifadoId] = useState<number | null>(null)

  return (
    <AlmoxarifadoContext.Provider
      value={{
        almoxarifadoId,
        setAlmoxarifadoId,
      }}
    >
      {children}
    </AlmoxarifadoContext.Provider>
  )
}
