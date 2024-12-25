import { createContext, useState } from 'react'

export const EstoqueContext = createContext({})

export function EstoqueProvider({ children }) {
  const [ciId, setCiId] = useState(null)
  const [vendaId, setVendaId] = useState(null)

  return (
    <EstoqueContext.Provider
      value={{
        ciId,
        setCiId,
        vendaId,
        setVendaId,
      }}
    >
      {children}
    </EstoqueContext.Provider>
  )
}
