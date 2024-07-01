import React from 'react'
import PaymentMethodScreen from '../../Components/DMS/PaymentMethodScreen/PaymentMethodScreen'
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS'

const PaymentMethod = () => {
  return (
    <>
        <PaymentMethodScreen/>
    </>
  )
}
export default WithUserhoc_DMS(PaymentMethod) 

