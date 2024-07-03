import AddProductCategory from '../Components/ManageProductCategory/AddProductCategory'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


function AddProductCat() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'product')
      dispatch(setIsActive('product'))
  }, []);
    return (
        <>
                    <AddProductCategory/>
        </>
    )
}

export default WithUserhoc_COMMON(AddProductCat)
