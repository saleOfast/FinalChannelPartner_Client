
import OpportunityTypeMasterScreen from '../Components/OpportunityTypeMaster/OpportunityTypeMasterScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import withUser from '../HOC/WithUserhoc'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON (function ManageOpportunityTypeMaster() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunityType')
      dispatch(setIsActive('opportunityType'))
  }, [dispatch]);
  return (
    <>
     
          <OpportunityTypeMasterScreen/>
    
    </>
  )
})