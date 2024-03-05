import AddContactScreen from '../Components/ContactScreens/AddContactScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

 function AddContact() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'contact')
        dispatch(setIsActive('contact'))
    }, []);
    return (
        <>
                    <AddContactScreen />
        </>
    )
}

export default withUser(AddContact)