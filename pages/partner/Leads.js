import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import LeadsScreen from '../../Components/ChannelPartner/User/Leads/LeadsScreen'

const Leads = () => {
  return (
    <>
        <LeadsScreen/>
    </>
  )
}

export default WithUserhoc_CP(Leads)