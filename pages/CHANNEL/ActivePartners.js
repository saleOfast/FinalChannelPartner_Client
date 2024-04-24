import React from 'react'
import ActivePartnersScreen_copy from '../../Components/ChannelPartner/ActivePartners/ActivePartnersScreen_copy'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const ActivePartners = () => {
  return (
    <>
      {/* <ActivePartnersScreen/> */}
      <ActivePartnersScreen_copy/>
    </>
  )
}

export default WithUserhoc_CP(ActivePartners)