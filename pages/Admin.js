import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LoginScreen from '../Components/SuperAdminScreen/LoginScreen'
import { hasCookie, getCookie } from 'cookies-next';
import { adminMode } from '../store/dbModeSlice'
import AdminDashboard from '../Components/SuperAdminScreen/AdminDashboard';
import { LoggedIn } from '../store/adMinLoginSlice'
import withAdmin from '../HOC/Withhoc';

function Products() {

    const dispatch = useDispatch()
    const adminLogin = useSelector((state) => state.adminLogin.value)
    const [userInfo, setuserInfo] = useState({})

    function checkLogin() {
        if (hasCookie('Admin') && hasCookie("SaLsUsr") && hasCookie("saLsTkn")) {
            dispatch(LoggedIn())
            dispatch(adminMode())
        }
    }
    useEffect(() => {
        if (hasCookie('SaLsUsr')) {
            let userInfo = JSON.parse(getCookie('SaLsUsr'));
            setuserInfo(userInfo);
            checkLogin(userInfo);
        } else {
            checkLogin(userInfo);    
        }
    }, [])

    return (
        <>
            {adminLogin ? <>
                <Head>
                    <title>LeadShyne</title>
                    <meta name="description" content="Leadshyne CMS" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="main_wrapper">
                    <AdminDashboard />
                </main>
            </> : <LoginScreen />}
        </>
    )
}

export default withAdmin(Products)