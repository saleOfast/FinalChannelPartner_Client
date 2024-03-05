import EventScreens from '../Components/EventScreen/EventScreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

 function EventScreen() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'tasks')
      dispatch(setIsActive('tasks'))
  }, []);
    return (
        <>

                    <EventScreens />
 
        </>
    )
}
export default withUser(EventScreen)
