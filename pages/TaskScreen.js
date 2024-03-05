
import Taskscreens from '../Components/TasksScreens/Taskscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function TaskScreen() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'tasks')
        dispatch(setIsActive('tasks'))
    }, []);
    return (
        <>
                    <Taskscreens />

        </>
    )
}
)