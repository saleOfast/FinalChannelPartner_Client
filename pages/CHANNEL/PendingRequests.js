import React from 'react'
import PendingRequestsScreen from '../../Components/ChannelPartner/PendingReequests/PendingRequestsScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const PendingRequests = () => {
  return (
    <>
        <PendingRequestsScreen/>
    </>
  )
}

export default WithUserhoc_CP(PendingRequests)