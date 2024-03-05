import AddSubProduct from '../Components/ManageProductSubCatogery/AddSubProduct'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import withUser from '../HOC/WithUserhoc';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';


 function AddSubProductList() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>
                    <AddSubProduct/>
        </>
    )
}

export default withUser(AddSubProductList)