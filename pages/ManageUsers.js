import ManageUserScreens from '../Components/AdminScreens/ManageUserScreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function ManageUsers() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'userManage')
      dispatch(setIsActive('userManage'))
  }, []);
  return (
    <>
          <ManageUserScreens />
    </>
  )
}
)