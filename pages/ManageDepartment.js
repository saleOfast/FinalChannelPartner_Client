import ManageDepartmentScreen from '../Components/ManageDepartmentScreen/ManageDepartmentScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function ManageDepartment() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'organization')
      dispatch(setIsActive('organization'))
  }, []);
  return (
    <>
          <ManageDepartmentScreen/>
    </>
  )
})
