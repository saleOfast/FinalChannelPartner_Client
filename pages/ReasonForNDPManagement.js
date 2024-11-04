import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageReasonForNDPScreen from '../Components/ManageRasonForNDP/ManageReasonForNDPScreen'



export default WithUserhoc_COMMON (function ReasonForNDPManagement() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ReasonForNDPManagement')
      dispatch(setIsActive('ReasonForNDPManagement'))
  }, [dispatch]);
  return (
    <>

          <ManageReasonForNDPScreen/>
     
    </>
  )
})
