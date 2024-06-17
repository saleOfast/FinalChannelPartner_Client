

import React from 'react'
import DashBoardScreen from '../../Components/Dashboard/CRM/DashBoardScreen';
import Admindashboard from '../../Components/AdminScreens/Admindashboard';
import { useSelector } from "react-redux"; 
import SignInScreen from '../../Components/Basics/SignInScreen';
import { hasCookie } from 'cookies-next';

const Index = () => {
const dbMode = useSelector((state) => state.dbMode.value);
const userInfo=hasCookie("userInfo") ? true:false;
 
  return (
    <>
          {
            userInfo ? dbMode==="user" ?  <DashBoardScreen/> : <Admindashboard/>   :  <SignInScreen />
          }
    </>
    
  )
}

export default Index