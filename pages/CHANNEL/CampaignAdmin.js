import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import CampaignAdminScreen from '../../Components/ChannelPartner/Admin/Campaign/CampaignAdminScreen'

const CampaignAdmin = () => {
  return (
    <>
        <CampaignAdminScreen/>
    </>
  )
}

export default WithUserhoc_CP(CampaignAdmin)