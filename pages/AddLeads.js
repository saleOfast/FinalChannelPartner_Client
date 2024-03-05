import { useDispatch } from 'react-redux';
import AddLeadsScreen from '../Components/LeadsScreens/AddLeadsScreen'
import withUser from '../HOC/WithUserhoc'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';

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

export default withUser(AddLeads)
