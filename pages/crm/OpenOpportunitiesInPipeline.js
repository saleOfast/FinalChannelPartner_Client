import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import OpenOpportunitiesInPipelineScreen from '../../Components/OpenOpportunitiesInPipeline/OpenOpportunitiesInPipelineScreen'




export default withUser( function OpenOpportunitiesInPipeline() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <OpenOpportunitiesInPipelineScreen />
        </>
    )
})
