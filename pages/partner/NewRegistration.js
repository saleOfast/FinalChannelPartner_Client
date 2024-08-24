import React from 'react'
import NewRegistrationScreen from '../../Components/ChannelPartner/NewRegistration/NewRegistrationScreen'
import ChannelPartnerHOC from "../../HOC/ChannelPartnerHOC";

const NewRegistration = () => {
  return (
    <>
        <NewRegistrationScreen/>
    </>
  )
}

export default ChannelPartnerHOC(NewRegistration) 