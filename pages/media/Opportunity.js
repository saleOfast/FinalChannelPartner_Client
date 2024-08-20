import OpportunityScreen from '../../Components/MEDIA/OpportunityScreens/OpportunityScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA( function Opportunity() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'opportunity')
      dispatch(setIsActive('opportunity'))
  }, [dispatch]);
    return (
        <>
                    <OpportunityScreen />
        </>
    )
})
