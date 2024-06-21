import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';

const withAdmin = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const adminLogin = useSelector((state) => state.adminLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    const dispatch=useDispatch()

    useEffect(() => {
      // If the user is not loading and not authenticated and not on the login page, redirect to login
      if (!hasCookie("SaLsUsr") && hasCookie("user")) {
        dispatch(clearTheme());
        dispatch(clearValue())
        dispatch(userLogOut())
        toast.warning("Illegal Route Access")
        router.push('/');
      }else{
        setRendercomponent(true)
      }
      
    }, [adminLogin]);

    // Render the wrapped component only if authenticated and not on the login page
 

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  };
};

export default withAdmin;

