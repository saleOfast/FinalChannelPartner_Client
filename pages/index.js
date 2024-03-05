import { useEffect, useState } from 'react'
import Head from 'next/head'
import SideBar from '../Components/Basics/SideBar'
import Topnav from '../Components/Basics/Topnav'
import DashBoardScreen from '../Components/Dashboard/DashBoardScreen';
import { hasCookie } from "cookies-next";
import { useSelector, useDispatch } from 'react-redux';
import Admindashboard from '../Components/AdminScreens/Admindashboard'
import SignInScreen from '../Components/Basics/SignInScreen';
import { UserLogIN, userLogOut } from '../store/ClientLoginSlice';
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter()
  const dbMode = useSelector((state) => state.dbMode.value)
  const loggedIn = useSelector((state) => state.userLogin.value)
  const dispatch = useDispatch()

  useEffect(() => {
    if(hasCookie('Admin')){
      router.push('/Admin')
    }
    if (!hasCookie("token")) {
      dispatch(userLogOut())
    } else {
      dispatch(UserLogIN())
    }
  }, [])


  // return (
  //   <>{loggedIn ? <>
  //     <Head>
  //       <title>LeadShyne</title>
  //       <meta name="description" content="Leadshyne CMS" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <main className="main_wrapper">
  //       <Topnav />
  //       <div className="content_wrapper">
  //         <SideBar isactive='dashboard' />
  //         {dbMode === 'user' ? <DashBoardScreen /> : <Admindashboard />}
  //       </div>
  //     </main>
  //   </> :
  //     <SignInScreen />}
  //   </>
  // )

    return (
    <>{loggedIn ? <>
          {dbMode === 'user' ? <DashBoardScreen /> : <Admindashboard />}
    </> :
      <SignInScreen />}
    </>
  )
}
