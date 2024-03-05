import ProductScreen from '../Components/ProductScreens/ProductScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function Products() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'product')
      dispatch(setIsActive('product'))
  }, []);
    return (
        <>
           
                    <ProductScreen />
            
        </>
    )
}
)