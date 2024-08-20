import { useDispatch } from 'react-redux';
import AddOpportunityScreen from '../../Components/MEDIA/OpportunityScreens/AddOpportunityScreen'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';

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

export default WithUserhoc_MEDIA(AddOpportunity)