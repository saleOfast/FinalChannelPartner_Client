
import ManageLeadScreen from '../Components/LeadsScreens/ManageLeadScreen'
import withUser from '../HOC/WithUserhoc'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'

 function ManageLeads() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leads ')
      dispatch(setIsActive('leads'))
  }, []);
  return (
    <>
      <ManageLeadScreen />
    </>
  )
}

export default withUser(ManageLeads);