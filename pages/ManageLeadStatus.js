import ManageLeadStatusScreen from '../Components/ManageLeadStatus/ManageLeadStatusScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import { useEffect } from 'react'

export default withUser (function ManageLeadStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, []);
  return (
    <>
        <ManageLeadStatusScreen/>
    </>
  )
})
