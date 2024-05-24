import UserPrflMgmtscreens from '../Components/UserProfileManagementScreens/UserPrflMgmtscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function Email() {
  const dispatch = useDispatch()
//   useEffect(() => {
//       setCookie('isActive', 'userProfile')
//       dispatch(setIsActive('userProfile'))
//   }, []);
  return (
    <>
      
          <UserPrflMgmtscreens />
   
    </>
  )
}
)