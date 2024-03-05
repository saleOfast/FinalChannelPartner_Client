
import ManageLeadRatingScreen from '../Components/ManageLeadRating/ManageLeadRatingScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


export default withUser (function ManageRating() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, []);
  return (
    <>
      
          <ManageLeadRatingScreen/>
      
    </>
  )
}
)