import UserPrflMgmtscreens from '../Components/UserProfileManagementScreens/UserPrflMgmtscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import LicenseDetailScreen from '../Components/LicenseDetails/LicenseDetailScreen'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON( function LicenseDetails() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'licenseDetails')
      dispatch(setIsActive('licenseDetails'))
  }, [dispatch]);

  

  return (
    <>
      
          <LicenseDetailScreen  />
   
    </>
  )
}
)