import UserPrflMgmtscreens from '../Components/UserProfileManagementScreens/UserPrflMgmtscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import LicenseDetailScreen from '../Components/LicenseDetails/LicenseDetailScreen'

export default withUser( function LicenseDetails() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'licenseDetails')
      dispatch(setIsActive('licenseDetails'))
  }, [dispatch]);
  return (
    <>
      
          <LicenseDetailScreen/>
   
    </>
  )
}
)