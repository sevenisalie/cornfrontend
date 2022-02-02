import { useContext } from 'react'
import { RefreshContext } from '../contexts/RefreshContext'

export const useRefresh = () => {
  const { fast, slow, verySlow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, verySlowRefresh: verySlow }
}

export default useRefresh