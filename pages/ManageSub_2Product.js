
import Sub_2ProductScreen from '../Components/ManageProductSub-2Catogery/Sub_2ProductScreen';
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';


 export default withUser( function ManageSub_2Product(){
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ProfilePermissionManagement')
      dispatch(setIsActive('ProfilePermissionManagement'))
  }, []);
    return(

        <>
        <Sub_2ProductScreen/>
        </>
    )
})