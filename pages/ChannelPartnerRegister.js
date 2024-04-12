import React from 'react'
import ChannelPartnerRegisterScreen from '../Components/ChannelPartner/ChannelPartnerRegister/ChannelPartnerRegisterScreen'
import ChannelPartnerHOC from '../HOC/ChannelPartnerHOC'

const ChannelPartnerRegister = () => {
  return (
    <>
        <ChannelPartnerRegisterScreen/>
    </>
  )
}

export default ChannelPartnerHOC(ChannelPartnerRegister) 