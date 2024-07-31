import ContactScreen from '../../Components/MEDIA/ContactScreens/ContactScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

 function Contacts() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'contact')
        dispatch(setIsActive('contact'))
    }, []);
    return (
        <>
           
                    <ContactScreen />
              
        </>
    )
}

export default WithUserhoc_MEDIA(Contacts)
