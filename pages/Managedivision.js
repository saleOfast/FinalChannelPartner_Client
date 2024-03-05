import ManageDivisionScreen from '../Components/ManageDivisionScreens/ManageDivisionScreen'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function Managedivision() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'organization')
      dispatch(setIsActive('organization'))
  }, []);
  return (
    <>
          <ManageDivisionScreen />
    </>
  )
}
)