
//  import ManageLeadScreen from '../../Components/LeadsScreens/ManageLeadScreen'
import withUser from '../../HOC/WithUserhoc'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import ManageLeadScreen from '../../Components/MEDIA/LeadsScreens/ManageLeadScreen'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA'



 function ManageLeads() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leads ')
      dispatch(setIsActive('leads'))
  }, [dispatch]);
  return (
    <>
      <ManageLeadScreen />
    </>
  )
}

export default WithUserhoc_MEDIA(ManageLeads);