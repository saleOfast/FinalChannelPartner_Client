import ViewLeaveScreen from '../Components/LeaveHead/ViewLeaveScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import { useEffect } from 'react'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON( function Viewleaves() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leaveType')
      dispatch(setIsActive('leaveType'))
  }, [dispatch]);
  return (
    <>
     
          <ViewLeaveScreen/>
       
    </>
  )
})
