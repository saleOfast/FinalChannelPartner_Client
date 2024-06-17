import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import LeadsScreen from '../../Components/ChannelPartner/Admin/LeadSource/LeadsScreen'

const LeadSource = () => {
  return (
    <>
        <LeadsScreen/>
    </>
  )
}

export default WithUserhoc_CP(LeadSource)