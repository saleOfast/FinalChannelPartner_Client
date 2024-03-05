import SubProductScreen from '../Components/ManageProductSubCatogery/SubProductScreen';
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';


 export default withUser( function ManageSubProduct(){
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ProfilePermissionManagement')
      dispatch(setIsActive('ProfilePermissionManagement'))
  }, []);
    return(

        <>
 
        <SubProductScreen/>

        </>
    )
})