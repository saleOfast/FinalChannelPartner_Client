import React from 'react'
import DashBoardScreenCHANNEL from '../../Components/ChannelPartner/Reports&Dashboard/DashBoardScreenCHANNEL'
import ChannelSignInScreen from '../../Components/ChannelPartner/SignIn/ChannelSignInScreen';
import { useSelector } from 'react-redux';

const index = () => {
const userInfo=hasCookie("userInfo") ? true:false;
  return (
    <>
      {
        userInfo ? <DashBoardScreenCHANNEL/> : <ChannelSignInScreen/>
      }
    </>
    
  )
}

export default index