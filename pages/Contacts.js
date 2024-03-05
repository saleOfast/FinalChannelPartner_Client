import Head from 'next/head'
import SideBar from '../Components/Basics/SideBar'
import Topnav from '../Components/Basics/Topnav'
import ContactScreen from '../Components/ContactScreens/ContactScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

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

export default withUser(Contacts)
