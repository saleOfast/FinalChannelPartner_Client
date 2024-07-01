import React, { useEffect } from 'react'
import LandingPageDMS  from '../../Components/DMS/LandingPageDMS/LandingPageDMS'
import SignInScreen from '../../Components/Basics/SignInScreen';
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { UserLogIN, userLogOut } from '../../store/ClientLoginSlice';
import dmsIndexHOC from '../../HOC/dmsIndexHOC';

const Index = () => {
const userInfo=hasCookie("userInfo") ? true:false;
const router=useRouter()
const dispatch=useDispatch()
useEffect(() => {
  if (hasCookie("Admin")) {
    router.push("/admin");
  }
  if (!hasCookie("token")) {
    dispatch(userLogOut());
  } else {
    dispatch(UserLogIN());
  }
}, []);
  return (
    <>
      {
        userInfo ? <LandingPageDMS/> : <SignInScreen/>
      }
    </>
    
  )
}

export default dmsIndexHOC(Index)