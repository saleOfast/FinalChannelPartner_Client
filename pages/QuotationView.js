import QuotationScreenView from '../Components/QuotationScreens/QuotationScreenView'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function QuotationView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'quotation')
      dispatch(setIsActive('quotation'))
  }, []);
  return (
    <>
          <QuotationScreenView/>
    </>
  )
})