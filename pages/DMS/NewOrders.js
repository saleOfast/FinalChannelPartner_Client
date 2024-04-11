import React from 'react'
import NewOrderScreen from '../../Components/DMS/Orders/NewOrderScreen'
import withUser from '../../HOC/WithUserhoc'

const NewOrders = () => {
  return (
    <>
        <NewOrderScreen/>
    </>
  )
}
export default withUser(NewOrders) 