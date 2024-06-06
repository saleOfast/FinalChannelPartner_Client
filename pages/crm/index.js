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
import { useSelector } from 'react-redux';  
import SignInScreen from '../../Components/Basics/SignInScreen';

const index = () => {
const loggedIn = useSelector((state) => state.userLogin.value)
  return (
    <>
          {
            loggedIn ?  <DashBoardScreen/>  :  <SignInScreen />
          

          }
    </>
    
  )
}

export default index