import OpportunityScreen from '../Components/OpportunityScreens/OpportunityScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function Opportunity() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunity')
      dispatch(setIsActive('opportunity'))
  }, []);
    return (
        <>
                    <OpportunityScreen />
        </>
    )
})
