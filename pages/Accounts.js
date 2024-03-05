import { useEffect } from 'react';
import AccountScreen from '../Components/AccountScreens/AccountScreen'
import withUser from '../HOC/WithUserhoc';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';
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

export default withUser(Accounts);