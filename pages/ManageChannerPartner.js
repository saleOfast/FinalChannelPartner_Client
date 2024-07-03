import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import ManageUserChannelScreens from '../Components/ChannelPartner/ManageUserChannel/ManageUserChannelScreens'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON( function ManageUsers() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'userManage')
      dispatch(setIsActive('userManage'))
  }, [dispatch]);
  return (
    <>
          <ManageUserChannelScreens />
    </>
  )
}
)