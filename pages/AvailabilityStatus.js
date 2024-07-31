import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageAvailabilityStatusScreen from '../Components/ManageAvailabilityStatus/ManageAvailabilityStatusScreen'


export default WithUserhoc_COMMON (function AvailabilityStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'AvailabilityStatus')
      dispatch(setIsActive('AvailabilityStatus'))
  }, [dispatch]);
  return (
    <>
    
          <ManageAvailabilityStatusScreen/>
     
    </>
  )
})
