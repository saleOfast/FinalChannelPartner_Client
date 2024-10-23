
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import withUser from '../HOC/WithUserhoc'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ConversionPercentageScreen from '../Components/ConversionPercentage/ConversionPercentageScreen'


export default WithUserhoc_COMMON (function ConversionPercentage() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ConversionPercentage')
      dispatch(setIsActive('ConversionPercentage'))
  }, [dispatch]);
  return (
    <>
     
          <ConversionPercentageScreen />
    
    </>
  )
})