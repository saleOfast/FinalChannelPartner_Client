import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageMediaTypeScreen from '../Components/ManageMediaType/ManageMediaTypeScreen'


export default WithUserhoc_COMMON (function MediaType() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'MediaType')
      dispatch(setIsActive('MediaType'))
  }, [dispatch]);
  return (
    <>
    
          <ManageMediaTypeScreen/>
     
    </>
  )
})
