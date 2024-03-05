import AddProductScreen from '../Components/ProductScreens/AddProductScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

function AddProduct() {
        const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>
                    <AddProductScreen />
        </>
    )
}


export default withUser(AddProduct)
