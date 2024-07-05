import UserPrflMgmtscreens from '../Components/UserProfileManagementScreens/UserPrflMgmtscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import EmailConfigScreen from '../Components/EmailConfiguration/EmailConfigScreen'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON( function EmailConfiguration() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'emailConfig')
      dispatch(setIsActive('emailConfig'))
  }, [dispatch]);
  return (
    <>
      
          <EmailConfigScreen/>
   
    </>
  )
}
)