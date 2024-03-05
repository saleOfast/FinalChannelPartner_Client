
import ManageQuotationStatusScreen from '../Components/QuotationStatusScreen/ManageQuotationStatusScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser( function ManageQuotationStatus() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'QuotationsManage')
      dispatch(setIsActive('QuotationsManage'))
  }, []);
    return (
        <>
           
                    <ManageQuotationStatusScreen />
 
        </>
    )
})