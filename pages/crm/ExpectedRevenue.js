import OpportunityScreen from '../../Components/OpportunityScreens/OpportunityScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import ExpectedRevenueScreen from '../../Components/ExpectedRevenue/ExpectedRevenueScreen'

export default withUser( function ExpectedRevenue() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <ExpectedRevenueScreen />
        </>
    )
})
