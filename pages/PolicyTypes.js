import PolicyTypesScreen from '../Components/PolicyHead/PolicyTypesScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function PolicyTypes() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'policy')
      dispatch(setIsActive('policy'))
  }, []);
  return (
    <>
          <PolicyTypesScreen />
    </>
  )
})
