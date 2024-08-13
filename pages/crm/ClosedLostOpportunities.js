import OpportunityScreen from '../../Components/OpportunityScreens/OpportunityScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import ClosedLostOpportunitiesScreen from '../../Components/ClosedLostOpportunities/ClosedLostOpportunitiesScreen'


export default withUser( function ClosedLostOpportunities() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <ClosedLostOpportunitiesScreen />
        </>
    )
})
