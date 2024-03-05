
import LeaveHeadScreen from '../Components/LeaveHead/LeaveHeadScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function ManageLeadHeadScreen() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'HRProcess')
      dispatch(setIsActive('HRProcess'))
  }, []);
  return (
    <>
          <LeaveHeadScreen/>
    </>
  )
})
