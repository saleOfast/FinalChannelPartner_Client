
import ProductTaxMappingScreen from '../Components/ProductScreens/ProductTaxMappingScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default( function ProductTaxmapping() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>
                    <ProductTaxMappingScreen />
        </>
    )
}
)