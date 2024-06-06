// import React from 'react'
// import DashBoardScreenCHANNEL from '../../Components/ChannelPartner/Reports&Dashboard/DashBoardScreenCHANNEL'

// const index = () => {
//   return (
//     <DashBoardScreenCHANNEL/>
//   )
// }

// export default index


import React from 'react'
import DashBoardScreenCHANNEL from '../../Components/ChannelPartner/Reports&Dashboard/DashBoardScreenCHANNEL'
import ChannelSignInScreen from '../../Components/ChannelPartner/SignIn/ChannelSignInScreen';
import { useSelector } from 'react-redux';

const index = () => {
const loggedIn = useSelector((state) => state.userLogin.value)
  return (
    <>
      {
        loggedIn ? <DashBoardScreenCHANNEL/> : <ChannelSignInScreen/>
      }
    </>
    
  )
}

export default index