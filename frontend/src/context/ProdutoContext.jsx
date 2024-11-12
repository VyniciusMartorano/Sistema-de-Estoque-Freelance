import { createContext, useState } from 'react'

export const ProdutoContext = createContext({})

export function ProdutoProvider({ children }) {
  const [produtoId, setProdutoId] = useState(null)

  return (
    <ProdutoContext.Provider
      value={{
        produtoId,
        setProdutoId,
      }}
    >
      {children}
    </ProdutoContext.Provider>
  )
}
