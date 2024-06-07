import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import CampaignScreen from '../../Components/ChannelPartner/User/Campaign/CampaignScreen'

const Campaign = () => {
  return (
    <>
        <CampaignScreen/>
    </>
  )
}

export default WithUserhoc_CP(Campaign)