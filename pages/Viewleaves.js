import ViewLeaveScreen from '../Components/LeaveHead/ViewLeaveScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import { useEffect } from 'react'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function Viewleaves() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leaveType')
      dispatch(setIsActive('leaveType'))
  }, []);
  return (
    <>
     
          <ViewLeaveScreen/>
       
    </>
  )
})
