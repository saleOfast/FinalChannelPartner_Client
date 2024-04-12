import React from 'react'
import PaymentMethodScreen from '../../Components/DMS/PaymentMethodScreen/PaymentMethodScreen'
import withUser from '../../HOC/WithUserhoc'

const PaymentMethod = () => {
  return (
    <>
        <PaymentMethodScreen/>
    </>
  )
}
export default withUser(PaymentMethod) 

