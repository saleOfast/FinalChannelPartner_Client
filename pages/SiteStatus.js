import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageMediaTypeScreen from '../Components/ManageMediaType/ManageMediaTypeScreen'
import ManageSiteStatusScreen from '../Components/ManageSiteStatus/ManageSiteStatusScreen'


export default WithUserhoc_COMMON (function SiteStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'SiteStatus')
      dispatch(setIsActive('SiteStatus'))
  }, [dispatch]);
  return (
    <>
    
          <ManageSiteStatusScreen/>
     
    </>
  )
})
