import LeadViewScreen from '../../Components/LeadsScreens/LeadViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA (function LeadsView() {
  const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'leads')
        dispatch(setIsActive('leads'))
    }, [dispatch]);
  return (
    <>
          <LeadViewScreen />
    </>
  )
}
)
