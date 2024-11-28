import { createContext, useState } from 'react'

export const EstoqueContext = createContext({})

export function EstoqueProvider({ children }) {
  const [ciId, setCiId] = useState(null)

  return (
    <EstoqueContext.Provider
      value={{
        ciId,
        setCiId,
      }}
    >
      {children}
    </EstoqueContext.Provider>
  )
}
