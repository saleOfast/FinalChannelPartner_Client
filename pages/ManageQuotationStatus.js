
import ManageQuotationStatusScreen from '../Components/QuotationStatusScreen/ManageQuotationStatusScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON( function ManageQuotationStatus() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'QuotationsManage')
      dispatch(setIsActive('QuotationsManage'))
  }, [dispatch]);
    return (
        <>
           
                    <ManageQuotationStatusScreen />
 
        </>
    )
})