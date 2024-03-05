import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';

const withAdmin = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const adminLogin = useSelector((state) => state.adminLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    

    useEffect(() => {
      // If the user is not loading and not authenticated and not on the login page, redirect to login
      if (!hasCookie("SaLsUsr") && hasCookie("user")) {
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
