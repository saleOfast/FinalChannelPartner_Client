// import React from 'react'
// import DashBoardScreen from '../../Components/Dashboard/CRM/DashBoardScreen';
// const index = () => {
//   return (
//     <DashBoardScreen/>
//   )
// }

// export default index

import React from 'react'
import DashBoardScreen from '../../Components/Dashboard/CRM/DashBoardScreen';
import Admindashboard from '../../Components/AdminScreens/Admindashboard';
import { useSelector } from 'react-redux';  
import SignInScreen from '../../Components/Basics/SignInScreen';

const index = () => {
const loggedIn = useSelector((state) => state.userLogin.value)
const dbMode = useSelector((state) => state.dbMode.value);

  return (
    <>
          {
            loggedIn ? dbMode==="user" ?  <DashBoardScreen/> : <Admindashboard/>   :  <SignInScreen />
          

          }
    </>
    
  )
}

export default index