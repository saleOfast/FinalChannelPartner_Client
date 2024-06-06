import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import VisitsScreen from '../../Components/ChannelPartner/User/Visits/VisitsScreen'

const Visits = () => {
  return (
    <>
        <VisitsScreen/>
    </>
  )
}

export default WithUserhoc_CP(Visits)