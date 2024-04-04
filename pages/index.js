import { useEffect, useState } from 'react'
import { hasCookie } from "cookies-next";
import { useSelector, useDispatch } from 'react-redux';
import Admindashboard from '../Components/AdminScreens/Admindashboard'
import SignInScreen from '../Components/Basics/SignInScreen';
import { UserLogIN, userLogOut } from '../store/ClientLoginSlice';
import { useRouter } from 'next/router';

import LandingPageDMS from '../Components/DMS/LandingPageDMS/LandingPageDMS';
import DashBoardScreenSALES from '../Components/Dashboard/SALES/DashBoardScreenSALES';
import DashBoardScreenCHANNEL from '../Components/Dashboard/CHANNEL/DashBoardScreenCHANNEL';
import DashBoardScreen from '../Components/Dashboard/CRM/DashBoardScreen';
import Tabs from '../Components/DMS/Tabs/Tabs';

export default  function Home() {

  const router = useRouter()
  const dbMode = useSelector((state) => state.dbMode.value)
  const loggedIn = useSelector((state) => state.userLogin.value)
  const permission = useSelector((state) => state.permissionMode.value);
  const [dashbarMode,setDashboardMode]=useState();
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


  const checkDashboard=()=>{
    if(hasCookie("crm")){
      setDashboardMode("crm")
    }else if(hasCookie("dms")){
      setDashboardMode("dms")
    }else if(hasCookie("sales")){
      setDashboardMode("sales")
    } else{
      setDashboardMode("channel")
    }
  }

  useEffect(() => {
    checkDashboard()
  }, [ permission]);

  const assignDashboard=(dashbarMode)=>{
    
   switch (dashbarMode) {
    case "crm":
      return(
        dbMode==="user" ? <DashBoardScreen /> : <Admindashboard />
      )
      break;
    
      case "dms":
        return(
          dbMode==="user" ? <LandingPageDMS />  : <Admindashboard />
        )
        break;

        case "channel":
          return(
            dbMode==="user" ? <DashBoardScreenCHANNEL /> : <Admindashboard />
          )
          break;

          case "sales":
            return(
              dbMode==="user" ? <DashBoardScreenSALES /> : <Admindashboard />
            )
            break;
   
    default:
      
      break;
   }
  }


    return (
      <>
        {loggedIn ? (
          // <>{dbMode === "user" ? <DashBoardScreen /> : <Admindashboard />}</>\
          assignDashboard(dashbarMode)
        ) : (
          <SignInScreen />
        )}
      </>
    );
}