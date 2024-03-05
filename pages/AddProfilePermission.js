import { useDispatch } from 'react-redux';
import AddProfilepermissionScreen from '../Components/ProfilePerManagement/AddProfilepermissionScreen'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AddProfilePermission() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>
                    <AddProfilepermissionScreen/>
        </>
    )
}

export default withUser(AddProfilePermission)