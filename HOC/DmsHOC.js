import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { hasCookie } from 'cookies-next';
import { clearTheme } from '../store/themeSlice';
import { clearValue } from '../store/permissionSlice';
import { userLogOut } from '../store/ClientLoginSlice';
import { toast } from 'react-toastify';

const DmsHOC = (WrappedComponent) => {
  return ({ ...rest }) => {
    const router = useRouter();
    const userLogin = useSelector((state) => state.userLogin.value)
    const [rendercomponent, setRendercomponent] = useState(false)
    const dispatch=useDispatch()

    useEffect(() => {
      
      if (hasCookie("SaLsUsr")) {
        router.push('/admin');
      }else if(!hasCookie("user")){
        setRendercomponent(true)
      }else{
        dispatch(clearTheme());
        dispatch(clearValue())
        dispatch(userLogOut()); 
        toast.warning("Illegal Route Access")
        router.push('/')
      }
    }, [userLogin]);

    return rendercomponent ? <WrappedComponent {...rest} /> : null ;
  };
};

export default DmsHOC;
