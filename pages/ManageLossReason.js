import ManageLossReasonScreen from '../Components/ManageLossReason/ManageLossReasonScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON (function ManageLossReason() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, [dispatch]);
  return (
    <>
     
        <ManageLossReasonScreen/>
       
    </>
  )
}
)