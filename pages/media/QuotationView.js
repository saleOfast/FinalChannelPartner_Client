import QuotationScreenView from '../../Components/QuotationScreens/QuotationScreenView'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA( function QuotationView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'quotation')
      dispatch(setIsActive('quotation'))
  }, [dispatch]);
  return (
    <>
          <QuotationScreenView/>
    </>
  )
})