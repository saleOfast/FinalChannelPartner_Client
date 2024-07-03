import ManageLeadStatusScreen from '../Components/ManageLeadStatus/ManageLeadStatusScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import { useEffect } from 'react'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON (function ManageLeadStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, [dispatch]);
  return (
    <>
        <ManageLeadStatusScreen/>
    </>
  )
})
