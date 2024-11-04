import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageEstimationTypeScreen from '../Components/ManageEstimationType/ManageEstimationTypeScreen'




export default WithUserhoc_COMMON (function ManageEstimationType() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ManageEstimationType')
      dispatch(setIsActive('ManageEstimationType'))
  }, [dispatch]);
  return (
    <>

          <ManageEstimationTypeScreen/>
     
    </>
  )
})
