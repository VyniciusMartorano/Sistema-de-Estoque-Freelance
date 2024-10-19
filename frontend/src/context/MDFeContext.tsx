import { createContext, ReactNode, useState } from 'react'

import { MDFe } from '@/models/MDFe'

interface MDFeContextData {
  mdfeToEdited: MDFe
  setMDFeToEdited: React.Dispatch<React.SetStateAction<MDFe>>
  placaVeiculoDV: string | null
  setPlacaVeiculoDV: React.Dispatch<React.SetStateAction<string | null>>
  placaReboqueDV: string | null
  setPlacaReboqueDV: React.Dispatch<React.SetStateAction<string | null>>
}

interface MDFeProviderProps {
  children: ReactNode
}

export const MDFeContext = createContext({} as MDFeContextData)

export function MDFeProvider({ children }: MDFeProviderProps) {
  const [mdfeToEdited, setMDFeToEdited] = useState<MDFe>({} as MDFe)
  const [placaVeiculoDV, setPlacaVeiculoDV] = useState<string | null>('')
  const [placaReboqueDV, setPlacaReboqueDV] = useState<string | null>('')

  return (
    <MDFeContext.Provider
      value={{
        mdfeToEdited,
        placaVeiculoDV,
        placaReboqueDV,
        setMDFeToEdited,
        setPlacaVeiculoDV,
        setPlacaReboqueDV,
      }}
    >
      {children}
    </MDFeContext.Provider>
  )
}
