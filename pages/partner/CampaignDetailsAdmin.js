import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import CampaignDetailsAdminScreen from '../../Components/ChannelPartner/Admin/Campaign/CampaignDetailsAdminScreen'

const CampaignDetailsAdmin = () => {
  return (
    <>
        <CampaignDetailsAdminScreen/>
    </>
  )
}

export default WithUserhoc_CP(CampaignDetailsAdmin)