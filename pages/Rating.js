import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageRatingScreen from '../Components/ManageRating/ManageRatingScreen'


export default WithUserhoc_COMMON (function Rating() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'Rating')
      dispatch(setIsActive('Rating'))
  }, [dispatch]);
  return (
    <>
    
          <ManageRatingScreen/>
     
    </>
  )
})
