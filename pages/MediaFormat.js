import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageMediaFormatScreen from '../Components/ManageMediaFormat/ManageMediaFormatScreen'


export default WithUserhoc_COMMON (function MediaFormat() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'MediaFormat')
      dispatch(setIsActive('MediaFormat'))
  }, [dispatch]);
  return (
    <>
    
          <ManageMediaFormatScreen/>
     
    </>
  )
})
