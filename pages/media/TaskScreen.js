
import Taskscreens from '../../Components/TasksScreens/Taskscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA( function TaskScreen() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'tasks')
        dispatch(setIsActive('tasks'))
    }, [dispatch]);
    return (
        <>
                    <Taskscreens />

        </>
    )
}
)