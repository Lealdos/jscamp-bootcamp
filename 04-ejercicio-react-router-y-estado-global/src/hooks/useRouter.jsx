import { useLocation, useNavigate } from 'react-router'

export function useRouter() {
  const location = useLocation()
  const navigate = useNavigate()

  function navigateTo(path) {
    navigate(path)
  }

  return {
    currentPath: location.pathname,
    navigateTo,
  }
}
