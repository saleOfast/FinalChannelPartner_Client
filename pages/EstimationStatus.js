import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageEstimationStatusScreen from '../Components/ManageEstimationStatus/ManageEstimationStatusScreen'



export default WithUserhoc_COMMON (function EstimationStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'EstimationStatus')
      dispatch(setIsActive('EstimationStatus'))
  }, [dispatch]);
  return (
    <>

          <ManageEstimationStatusScreen/>
     
    </>
  )
})
