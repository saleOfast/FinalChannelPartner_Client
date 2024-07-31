
import AddAccountScreen from '../../Components/MEDIA/AccountScreens/AddAccountScreen'
import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
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

export default WithUserhoc_MEDIA(AddAccount);