import ManageDivisionScreen from '../Components/ManageDivisionScreens/ManageDivisionScreen'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function Managedivision() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'organization')
      dispatch(setIsActive('organization'))
  }, [dispatch]);
  return (
    <>
          <ManageDivisionScreen />
    </>
  )
}
)