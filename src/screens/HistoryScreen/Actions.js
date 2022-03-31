import { getEntry, getExit } from '../../Hooks'
import { useLocation } from '../../Hooks'
export const Actions = () => {
  const { data: allEntry, isLoading: getLoading } = getEntry()
  const { data: allExit, isLoading: Loading } = getExit()
  const {path} = useLocation()

  return {
    data: path === "/inventory/history/entry" ? allEntry : allExit,
    isLoading: getLoading || Loading,
    path
  }
}
