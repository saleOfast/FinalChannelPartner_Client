import { useEffect, useState } from 'react'
import DashBoardScreen from '../Components/Dashboard/DashBoardScreen';
import { hasCookie } from "cookies-next";
import { useSelector, useDispatch } from 'react-redux';
import Admindashboard from '../Components/AdminScreens/Admindashboard'
import SignInScreen from '../Components/Basics/SignInScreen';
import { UserLogIN, userLogOut } from '../store/ClientLoginSlice';
import { useRouter } from 'next/router';
import withUser from '../HOC/WithUserhoc';

export default  function Home() {

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



    return (
    <>{loggedIn ? <>
          {dbMode === 'user' ? <DashBoardScreen /> : <Admindashboard />}
    </> :
    
      <SignInScreen />}
    </>
  )
}