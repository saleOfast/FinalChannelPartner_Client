import ManageProductCategoryScreen from '../Components/ManageProductCategory/ManageProductCategoryScreen';
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

export default withUser (function ManageProductCategory() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'productManage')
      dispatch(setIsActive('productManage'))
  }, []);
  return (

    <>
          <ManageProductCategoryScreen />
    </>
  )
})