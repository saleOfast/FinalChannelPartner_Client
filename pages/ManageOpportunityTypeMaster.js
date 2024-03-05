
import OpportunityTypeMasterScreen from '../Components/OpportunityTypeMaster/OpportunityTypeMasterScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import withUser from '../HOC/WithUserhoc'

export default withUser (function ManageOpportunityTypeMaster() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunityType')
      dispatch(setIsActive('opportunityType'))
  }, []);
  return (
    <>
     
          <OpportunityTypeMasterScreen/>
    
    </>
  )
})