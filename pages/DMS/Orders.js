import React from 'react'
import OrdersScreen from '../../Components/DMS/Orders/OrdersScreen'
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS'

const Orders = () => {
  return (
    <div style={{overflowX:"auto"}} className=' bg-white'><OrdersScreen /></div>
  )
}
export default WithUserhoc_DMS(Orders) 