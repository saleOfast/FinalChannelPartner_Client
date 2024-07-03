import { useDispatch } from 'react-redux';
import AddUserScreen from '../Components/AdminScreens/AddUserScreen'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


 function AddUsers() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'tasks')
        dispatch(setIsActive('tasks'))
    }, []);
    return (
        <>
        <AddUserScreen />
        </>
    )
}

export default WithUserhoc_COMMON(AddUsers)
