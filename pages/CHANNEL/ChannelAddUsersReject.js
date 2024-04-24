import React from 'react'
import ChannelAddUserScreen from '../../Components/ChannelPartner/PendingReequests/ChannelAddUserScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const ChannelAddUsersReject = () => {
  return (
    <><ChannelAddUserScreen/></>
  )
}

export default WithUserhoc_CP(ChannelAddUsersReject)