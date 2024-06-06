import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import BrokerageScreen from '../../Components/ChannelPartner/User/Brokerage/BrokerageScreen'

const Brokerage = () => {
  return (
    <>
        <BrokerageScreen/>
    </>
  )
}

export default WithUserhoc_CP(Brokerage)