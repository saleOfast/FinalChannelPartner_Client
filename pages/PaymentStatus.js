import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManagePaymentStatusScreen from '../Components/ManagePaymentStatus/ManagePaymentStatusScreen'



export default WithUserhoc_COMMON (function PaymentStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'PaymentStatus')
      dispatch(setIsActive('PaymentStatus'))
  }, [dispatch]);
  return (
    <>

          <ManagePaymentStatusScreen/>
     
    </>
  )
})
