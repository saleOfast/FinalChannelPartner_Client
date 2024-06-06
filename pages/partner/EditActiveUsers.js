import React from 'react'
import AddUserScreen from '../../Components/ChannelPartner/Admin/ChannelPartners/AddUserScreen'
import WithUserhoc_CP from '../../HOC/WithUserhoc_CP'

const EditActiveUsers = () => {
  return (
    <>
       <AddUserScreen/>
    </>
  )
}

export default WithUserhoc_CP(EditActiveUsers)