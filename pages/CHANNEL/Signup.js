import React from 'react'
import ChannelSignUpScreen from '../../Components/ChannelPartner/Signup/ChannelSignUpScreen'
import ChannelPartnerHOC from '../../HOC/ChannelPartnerHOC'
const Signup = () => {
  return (
    <ChannelSignUpScreen/>
  )
}

export default  ChannelPartnerHOC(Signup)
