import AddSub_3Product from '../Components/ManageProductSub-3Catogery/AddSub_3Product'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


 function AddSub_3ProductList() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>
                    <AddSub_3Product/>
        </>
    )
}

export default withUser(AddSub_3ProductList)
