import { useNavigate } from 'react-router-dom'

export function useSGCNavigate() {
  const nav = useNavigate()

  const navigate = (route, options) => nav(route, options)

  return {
    navigate,
  }
}
