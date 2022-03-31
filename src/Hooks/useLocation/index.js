import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { persistState, getPersistedState } from '../../utils'

const locationAtom = atom(getPersistedState('location') ?? '/')
const useLocation = () => {
  const [path, setPath] = useAtom(locationAtom)

  useEffect(() => persistState('location', path), [path])

  return {
    path,
    setPath
  }
}

export { useLocation }
