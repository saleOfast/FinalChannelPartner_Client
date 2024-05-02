import React from 'react'
import ChannelAddUserScreen from '../../Components/ChannelPartner/Admin/PendingReequests/ChannelAddUserScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const PendingRequestsDetail = () => {
  return (
    <><ChannelAddUserScreen/></>
  )
}

export default WithUserhoc_CP(PendingRequestsDetail)