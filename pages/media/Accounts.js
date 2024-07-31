import { useEffect } from 'react';
import AccountScreen from '../../Components/MEDIA/AccountScreens/AccountScreen'
// import withUser from '../../HOC/WithUserhoc';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';

function Accounts() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'account')
        dispatch(setIsActive('account'))
    }, []);
    return (
        <>
            <AccountScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(Accounts);