import React from 'react'
import CartScreen from '../../Components/DMS/Cart/CartScreen'
import withUser from '../../HOC/WithUserhoc'

const Cart = () => {
  return (
    <><CartScreen/></>
  )
}
export default withUser(Cart) 