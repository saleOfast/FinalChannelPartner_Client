import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageBusinessTypeScreen from '../Components/ManageBusinessType/ManageBusinessTypeScreen'



export default WithUserhoc_COMMON (function BusinessType() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'BusinessType')
      dispatch(setIsActive('BusinessType'))
  }, [dispatch]);
  return (
    <>

          <ManageBusinessTypeScreen/>
     
    </>
  )
})
