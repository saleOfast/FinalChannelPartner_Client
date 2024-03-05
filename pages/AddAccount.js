
import AddAccountScreen from '../Components/AccountScreens/AddAccountScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import withUser from '../HOC/WithUserhoc'
import { useEffect } from 'react'

function AddAccount() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'account')
        dispatch(setIsActive('account'))
    }, []);
    return (
        <>
            <AddAccountScreen />   
        </>
    )
}

export default withUser(AddAccount);