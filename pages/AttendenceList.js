import Head from 'next/head'
import SideBar from '../Components/Basics/SideBar'
import Topnav from '../Components/Basics/Topnav'
import AttendenceListScreen from '../Components/AttendenceScreens/AttendenceListScreen'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AttendenceList() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'HRProcess')
        dispatch(setIsActive('HRProcess'))
    }, []);
    return (
        <>
          
                    <AttendenceListScreen/>
          
        </>
    )
}
export default withUser(AttendenceList)
