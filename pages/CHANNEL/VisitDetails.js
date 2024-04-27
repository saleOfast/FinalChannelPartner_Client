import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import VisitDetailsScreen from '../../Components/ChannelPartner/User/Visits/VisitDetailsScreen'

const VisitDetails = () => {
  return (
    <>
        <VisitDetailsScreen/>
    </>
  )
}

export default WithUserhoc_CP(VisitDetails)