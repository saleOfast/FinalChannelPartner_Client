import React from 'react'
import LeadDetailsScreen from '../../Components/ChannelPartner/User/Leads/LeadDetailsScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const LeadDetails = () => {
  return (
    <LeadDetailsScreen/>
  )
}

export default WithUserhoc_CP(LeadDetails)