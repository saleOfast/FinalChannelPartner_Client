
import OpportunityViewScreen from '../Components/OpportunityScreens/OpportunityViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function OpportunityView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunity')
      dispatch(setIsActive('opportunity'))
  }, []);
  return (
    <>
          <OpportunityViewScreen/>
    </>
  )
}
)