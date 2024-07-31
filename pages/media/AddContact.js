import AddContactScreen from '../../Components/MEDIA/ContactScreens/AddContactScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

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

export default WithUserhoc_MEDIA(AddContact)