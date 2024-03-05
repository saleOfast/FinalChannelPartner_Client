import ProductViewScreen from '../Components/ProductScreens/ProductViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function ProductView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'product')
      dispatch(setIsActive('product'))
  }, []);
  return (
    <>
          <ProductViewScreen/>
    </>
  )
})