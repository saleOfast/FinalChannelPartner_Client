import { useEffect } from 'react';
import AddEventScreen from '../Components/EventScreen/AddEventScreen'
import withUser from '../HOC/WithUserhoc';
import { setCookie } from 'cookies-next';
import { useDispatch } from 'react-redux';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AddEvent() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'tasks')
        dispatch(setIsActive('tasks'))
    }, []);
    return (
        <>
                    <AddEventScreen /> 
        </>
    )
}

export default withUser(AddEvent)
