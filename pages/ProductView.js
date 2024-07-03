import ProductViewScreen from '../Components/ProductScreens/ProductViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function ProductView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'product')
      dispatch(setIsActive('product'))
  }, [dispatch]);
  return (
    <>
          <ProductViewScreen/>
    </>
  )
})