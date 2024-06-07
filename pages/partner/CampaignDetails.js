import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import CampaignDetailsScreen from '../../Components/ChannelPartner/User/Campaign/CampaignDetailsScreen'

const CampaignDetails = () => {
  return (
    <>
        <CampaignDetailsScreen/>
    </>
  )
}

export default WithUserhoc_CP(CampaignDetails)