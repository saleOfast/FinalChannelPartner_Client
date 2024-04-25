import React from 'react'
import ActivePartnersScreen from '../../Components/ChannelPartner/ActivePartners/ActivePartnersScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const ActivePartners = () => {
  return (
    <>
      <ActivePartnersScreen/>
    </>
  )
}

export default WithUserhoc_CP(ActivePartners)