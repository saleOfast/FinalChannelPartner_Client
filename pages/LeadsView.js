import LeadViewScreen from '../Components/LeadsScreens/LeadViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function LeadsView() {
  const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'leads')
        dispatch(setIsActive('leads'))
    }, []);
  return (
    <>
          <LeadViewScreen />
    </>
  )
}
)
