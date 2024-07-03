import RolePermissionScreens from '../Components/UserProfileManagementScreens/RolePermissionScreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON( function UserProfileManagement() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'userprflMgt')
      dispatch(setIsActive('userprflMgt'))
  }, [dispatch]);
  return (
    <>
          <RolePermissionScreens />
    </>
  )
}
)