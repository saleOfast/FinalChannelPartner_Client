import { useDispatch } from 'react-redux';
import AddfieldScreens from '../Components/AddFields/AddfieldScreens'
import withUser from '../HOC/WithUserhoc';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AdditionalFields() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'dynamicFields')
        dispatch(setIsActive('dynamicFields'))
    }, []);
    return (
        <>  
                    <AddfieldScreens />      
        </>
    )
}
export default withUser(AdditionalFields)
