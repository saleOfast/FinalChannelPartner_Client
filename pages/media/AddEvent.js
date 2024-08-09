import { useEffect } from 'react';
import AddEventScreen from '../../Components/MEDIA/EventScreen/AddEventScreen'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setCookie } from 'cookies-next';
import { useDispatch } from 'react-redux';
import { setIsActive } from '../../store/isActiveSidebarSlice';

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

export default WithUserhoc_MEDIA(AddEvent)
