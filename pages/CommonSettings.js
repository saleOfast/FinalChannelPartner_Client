import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import CommonSettingScreen from '../Components/CommonSettings/CommonSettingScreen'

export default WithUserhoc_COMMON( function CommonSettings() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'commonSettings')
      dispatch(setIsActive('commonSettings'))
  }, [dispatch]);
  return (
    <>
      
        <CommonSettingScreen/>
    </>
  )
}
)