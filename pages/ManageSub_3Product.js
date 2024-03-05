import Sub_3ProductScreen from '../Components/ManageProductSub-3Catogery/Sub_3ProductScreen';
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';


 export default withUser( function ManageSub_3Product(){
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ProfilePermissionManagement')
      dispatch(setIsActive('ProfilePermissionManagement'))
  }, []);

    return(

        <>
        <Sub_3ProductScreen/>
        </>
    )
})