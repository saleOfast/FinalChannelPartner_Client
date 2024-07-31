
//  import ManageLeadScreen from '../../Components/LeadsScreens/ManageLeadScreen'
import withUser from '../../HOC/WithUserhoc'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA'
import SiteManagementScreen from '../../Components/MEDIA/SiteManagementScreen/SiteManagementScreen'



 function ManageLeads() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'SiteManagement ')
      dispatch(setIsActive('SiteManagement'))
  }, [dispatch]);
  return (
    <>
      <SiteManagementScreen />
    </>
  )
}

export default WithUserhoc_MEDIA(ManageLeads);