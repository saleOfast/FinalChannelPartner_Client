import EventScreens from '../../Components/MEDIA/EventScreen/EventScreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

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
export default WithUserhoc_MEDIA(EventScreen)
