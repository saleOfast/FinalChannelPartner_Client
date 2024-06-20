import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';

const withUser = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const userLogin = useSelector((state) => state.userLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    

    useEffect(() => {
      
      if (hasCookie("SaLsUsr")) {
        router.push('/Admin');
      }else if(!hasCookie("user")){
        router.push('/');
        
      }else{
        setRendercomponent(true)
      }
      
    }, [userLogin]);

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  };
};

export default withUser;
