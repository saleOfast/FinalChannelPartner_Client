import React from 'react'
import LeadDetailsScreen from '../../Components/ChannelPartner/Admin/LeadSource/LeadDetailsScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const LeadDetails = () => {
  return (
    <LeadDetailsScreen/>
  )
}

export default WithUserhoc_CP(LeadDetails)