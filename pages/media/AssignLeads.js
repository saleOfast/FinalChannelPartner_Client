// import AssignLeadScreen from '../../Components/AssignLeadScreens/AssignLeadScreen'
// import withUser from '../../HOC/WithUserhoc'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import AssignLeadScreen from '../../Components/MEDIA/AssignLeadScreens/AssignLeadScreen';


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
export default WithUserhoc_MEDIA(AssignLeads)
