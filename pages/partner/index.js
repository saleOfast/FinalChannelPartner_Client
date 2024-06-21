import React, { useEffect } from 'react'
import DashBoardScreenCHANNEL from '../../Components/ChannelPartner/Reports&Dashboard/DashBoardScreenCHANNEL'
import ChannelSignInScreen from '../../Components/ChannelPartner/SignIn/ChannelSignInScreen';
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { UserLogIN, userLogOut } from '../../store/ClientLoginSlice';

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
        userInfo ? <DashBoardScreenCHANNEL/> : <ChannelSignInScreen/>
      }
    </>
    
  )
}

export default  Index