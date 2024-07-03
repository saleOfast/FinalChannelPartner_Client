
import ProductTaxMappingScreen from '../Components/ProductScreens/ProductTaxMappingScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

function ProductTaxmapping() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, [dispatch]);
    return (
        <>
                    <ProductTaxMappingScreen />
        </>
    )
}

export default WithUserhoc_COMMON(ProductTaxmapping)