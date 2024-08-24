import React from 'react'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'
import CPRegisterLeadsScreen from '../../Components/ChannelPartner/Admin/CPRegisterLeads/CPRegisterLeadsScreen'

const CPRegisterLeads = () => {
  return (
    <>
        <CPRegisterLeadsScreen/>
    </>
  )
}

export default WithUserhoc_CP(CPRegisterLeads)