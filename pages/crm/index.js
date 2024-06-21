

import React, { use, useEffect } from 'react'
import DashBoardScreen from '../../Components/Dashboard/CRM/DashBoardScreen';
import Admindashboard from '../../Components/AdminScreens/Admindashboard';
import { useDispatch, useSelector } from "react-redux"; 
import SignInScreen from '../../Components/Basics/SignInScreen';
import { hasCookie } from 'cookies-next';
import { stopLoading } from '../../store/loaderSlice';
import { useRouter } from 'next/router';
import { UserLogIN, userLogOut } from '../../store/ClientLoginSlice';
import crmIndexHOC from '../../HOC/crmIndexHOC';

const Index = () => {
  const dispatch=useDispatch();
const dbMode = useSelector((state) => state.dbMode.value);
const userInfo=hasCookie("userInfo") ? true:false;
const router=useRouter()
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
            userInfo ? dbMode==="user" ?  <DashBoardScreen/> : <Admindashboard/>   :  <SignInScreen />
          }
    </>
    
  )
}

export default crmIndexHOC(Index)