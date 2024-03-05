import AddSub_2Product from '../Components/ManageProductSub-2Catogery/AddSub_2Product'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


function AddSub_2ProductList() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
    return (
        <>     
                    <AddSub_2Product/>
        </>
    )
}

export default withUser(AddSub_2ProductList)
