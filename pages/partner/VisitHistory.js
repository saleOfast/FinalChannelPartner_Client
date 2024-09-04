import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import VisitHistoryScreen from '../../Components/ChannelPartner/User/Visits/VisitHistoryScreen'

const VisitHistory = () => {
  return (
    <>
        <VisitHistoryScreen/>
    </>
  )
}

export default WithUserhoc_CP(VisitHistory)