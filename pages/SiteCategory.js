import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageSiteCategoryScreen from '../Components/ManageSiteCategory/ManageSiteCategoryScreen'


export default WithUserhoc_COMMON (function SiteCategory() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'SiteCategory')
      dispatch(setIsActive('SiteCategory'))
  }, [dispatch]);
  return (
    <>
    
          <ManageSiteCategoryScreen/>
     
    </>
  )
})
