import AssignLeadScreen from '../Components/AssignLeadScreens/AssignLeadScreen'
import withUser from '../HOC/WithUserhoc'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AssignLeads() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'leads')
        dispatch(setIsActive('leads'))
    }, []);
    return (
        <>
            <AssignLeadScreen />
        </>
    )
}
export default withUser(AssignLeads)
