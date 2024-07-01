import React from 'react'
import NewOrderScreen from '../../Components/DMS/Orders/NewOrderScreen'
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS'

const NewOrders = () => {
  return (
    <>
        <NewOrderScreen/>
    </>
  )
}
export default WithUserhoc_DMS(NewOrders) 