
import OpportunityViewScreen from '../../Components/MEDIA/OpportunityScreens/OpportunityViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA (function OpportunityView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunity')
      dispatch(setIsActive('opportunity'))
  }, [dispatch]);
  return (
    <>
          <OpportunityViewScreen/>
    </>
  )
}
)