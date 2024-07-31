import { useDispatch } from 'react-redux';
import AddLeadsScreen from '../../Components/MEDIA/LeadsScreens/AddLeadsScreen'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';

 function AddLeads() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'leads')
        dispatch(setIsActive('leads'))
    }, []);
    return (
        <>
            <AddLeadsScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(AddLeads)
