import { useDispatch } from 'react-redux';
import AddOpportunityScreen from '../Components/OpportunityScreens/AddOpportunityScreen'
import withUser from '../HOC/WithUserhoc';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AddOpportunity() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'opportunity')
        dispatch(setIsActive('opportunity'))
    }, []);
    return (
        <>
                    <AddOpportunityScreen />  
        </>
    )
}

export default withUser(AddOpportunity)